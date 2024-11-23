/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client"; // Ensure you have socket.io-client installed
import {
  Button,
  ButtonWrapper,
  Container,
  RecordButton,
  RecordingIndicator,
  ResultCard,
  ResultsContainer,
  StopButton,
  Timer,
} from "../../ui/AudioStreamUI";
import { float32ToWav } from "../../utils/float32ToWav";
import { FaMicrophone, FaStop } from "react-icons/fa";
import useColors from "../../hooks/useColors";
import { getRenderableGrapheme } from "../../utils/getRenderableGrapheme";
import { formatSecToTime } from "../../utils/formatSecToTime";

const AudioStreamingComponent = () => {
  const colors = useColors();
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState(""); // Initialize as an empty string
  const [textWithGuidList, setTextWithGuidList] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [light, setLight] = useState("red");
  const scktio = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const currentStreamIndex = useRef(0);
  const audioBuffer = useRef(null); // Buffer to accumulate audio
  const sendingInterval = useRef(null); // Interval for sending data
  const timerRef = useRef(null);
  const initializeWebSockets = async () => {
    if (scktio.current) {
      scktio.current.disconnect();
    }

    const socket = io("https://stt.bangla.gov.bd:9394/", {
      transports: ["websocket"],
    });

    socket.on("disconnected_from_server", ({ message }) => {
      console.warn("Disconnected from server:", message);
      stopRecording();
    });

    socket.on("result", (message) => {
      if (message.chunk === "small_chunk") {
        let textArray = [message.output];
        let textWithGuidObj = {
          guid: message.guid,
          graphemeArray: textArray,
          phonemeArray: [],
          audio: undefined,
          index: message.output === "" ? null : message.index,
          alternatives: undefined,
          type: "large_chunk",
        };
        setTextWithGuidList((prevTextWithGuidList) => {
          let joinedList = [...prevTextWithGuidList, textWithGuidObj];
          return joinedList.sort(
            (a, b) =>
              parseInt(a.index.split(":")[0]) - parseInt(b.index.split(":")[0])
          );
        });
      } else {
        let textArray = [message.output];
        let textWithGuidObj = {
          guid: message.guid,
          graphemeArray: textArray,
          phonemeArray: [],
          audio: undefined,
          index: message.output === "" ? null : message.index,
          alternatives: undefined,
          type: "large_chunk",
        };
        let replacingIndices = message.index;
        let startIndex = parseInt(replacingIndices.split(":")[0]);
        let endIndex = parseInt(replacingIndices.split(":")[1]);
        setTextWithGuidList((prevTextWithGuidList) => {
          const newList = [...prevTextWithGuidList];

          let indicesToReplace = [];
          newList.forEach((item, index) => {
            if (
              parseInt(item.index.split(":")[0]) >= startIndex &&
              parseInt(item.index.split(":")[0]) <= endIndex
            ) {
              indicesToReplace.push(index);
            }
            if (index !== -1) {
              newList.splice(indicesToReplace[0], indicesToReplace.length);
            }
          });

          newList.push(textWithGuidObj);

          return newList.sort(
            (a, b) =>
              parseInt(a.index.split(":")[0]) - parseInt(b.index.split(":")[0])
          );
        });
      }
    });

    scktio.current = socket;
  };

  const startRecording = async () => {
    setTextWithGuidList([]);
    setRecordingTime(0);
    currentStreamIndex.current = 0;

    await initializeWebSockets();

    if (scktio.current) {
      scktio.current.emit("send_analytics", {
        analytics: { device: navigator.userAgent },
      });
    }

    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const scriptProcessor = audioContext.createScriptProcessor(1024, 1, 1);
    const source = audioContext.createMediaStreamSource(mediaStream);

    source.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0);
      const samples = Float32Array.from(inputData); // Create a copy to avoid mutation issues

      // Accumulate samples into a buffer
      audioBuffer.current = audioBuffer.current
        ? Float32Array.from([...audioBuffer.current, ...samples])
        : samples;

      // Ensure audio buffer only sends data every 500ms
      if (!sendingInterval.current) {
        sendingInterval.current = setInterval(() => {
          if (audioBuffer.current && audioBuffer.current.length > 0) {
            const audioBlob = float32ToWav(audioBuffer.current);

            const reader = new FileReader();
            reader.onload = (e) => {
              const base64String = e.target.result.split(",")[1];
              if (scktio.current) {
                scktio.current.emit("audio_transmit", {
                  audio: base64String,
                  index: currentStreamIndex.current,
                  endOfStream: false,
                });
                currentStreamIndex.current += 1;
              }
            };
            reader.readAsDataURL(audioBlob);

            // Clear the buffer after sending
            audioBuffer.current = null;
          }
        }, 500); // 500ms interval
      }
    };

    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    audioContextRef.current = audioContext;
    mediaStreamRef.current = mediaStream;
    scriptProcessorRef.current = scriptProcessor;

    setIsRecording(true);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Clear the sending interval
    if (sendingInterval.current) {
      clearInterval(sendingInterval.current);
      sendingInterval.current = null;
    }

    // Send the last buffer with endOfStream: true
    if (audioBuffer.current && audioBuffer.current.length > 0) {
      const audioBlob = float32ToWav(audioBuffer.current);
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1];
        if (scktio.current) {
          scktio.current.emit("audio_transmit", {
            audio: base64String,
            index: currentStreamIndex.current,
            endOfStream: true, // Mark the final transmission
          });
        }
      };
      reader.readAsDataURL(audioBlob);
      audioBuffer.current = null; // Clear the buffer
    } else if (scktio.current) {
      // If no remaining buffer, send an empty end-of-stream message
      scktio.current.emit("audio_transmit", {
        audio: null,
        index: currentStreamIndex.current,
        endOfStream: true,
      });
    }

    // Disconnect script processor
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }

    // Stop media stream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Close the audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Disconnect the socket
    if (scktio.current) {
      scktio.current.disconnect();
      scktio.current = null;
    }

    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <Container>
      <ButtonWrapper>
        {isRecording ? (
          <StopButton onClick={stopRecording} colors={colors}>
            <FaStop /> Stop
          </StopButton>
        ) : (
          <RecordButton onClick={startRecording} colors={colors}>
            <FaMicrophone /> Record
          </RecordButton>
        )}
      </ButtonWrapper>
      <RecordingIndicator isRecording={isRecording} colors={colors}>
        {isRecording && <Timer>{formatSecToTime(recordingTime)}</Timer>}
      </RecordingIndicator>
      <ResultsContainer>
        <ResultCard colors={colors}>
          {textWithGuidList.length > 0
            ? textWithGuidList.map((textWithGuid, idx) => (
                <span key={idx}>
                  {console.log("textWithGuid", textWithGuid)}
                  {getRenderableGrapheme(textWithGuid["graphemeArray"][0])}
                </span>
              ))
            : null}
        </ResultCard>
      </ResultsContainer>
    </Container>
  );
};

export default AudioStreamingComponent;
