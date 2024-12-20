/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client"; // Ensure you have socket.io-client installed
import {
  ButtonWrapper,
  Container,
  CopyButton,
  RecordButton,
  RecordingIndicator,
  ResultCard,
  ResultsContainer,
  StopButton,
  Textarea,
  TextareaWrapper,
  Timer,
} from "../../ui/AudioStreamUI";
import { float32ToWav } from "../../utils/float32ToWav";
import { FaCopy, FaFileWord, FaMicrophone, FaStop } from "react-icons/fa";
import useColors from "../../hooks/useColors";
import { getRenderableGrapheme } from "../../utils/getRenderableGrapheme";
import { formatSecToTime } from "../../utils/formatSecToTime";
import { toast } from "react-toastify";
import Button from "../reusable/Button";

import Swal from "sweetalert2";
import { IoRemoveCircle } from "react-icons/io5";

const AudioStreamingComponent = () => {
  const colors = useColors();
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState(""); // Initialize as an empty string
  const [textWithGuidList, setTextWithGuidList] = useState([]);
  // console.log({ textWithGuidList });
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
      console.log({ message });
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

        let replacingIndices = message.index;
        let startIndex = parseInt(replacingIndices.split(":")[0]);
        let endIndex = parseInt(replacingIndices.split(":")[1]);

        setTextWithGuidList((prevTextWithGuidList) => {
          const filteredList = prevTextWithGuidList.filter(
            (item) =>
              parseInt(item.index.split(":")[0]) < startIndex ||
              parseInt(item.index.split(":")[0]) > endIndex
          );
          return [...filteredList, textWithGuidObj].sort(
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
              // console.log("initial", {
              //   audio: base64String,
              //   index: currentStreamIndex.current,
              //   endOfStream: false, // Mark the final transmission
              // });
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

  const stopRecording = async () => {
    if (results.length !== 0) {
      toast.success("Recording stopped");
    }

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Stop periodic audio sending
    if (sendingInterval.current) {
      clearInterval(sendingInterval.current);
      sendingInterval.current = null;
    }

    // Send the remaining audio buffer with endOfStream: true
    if (
      audioBuffer.current &&
      audioBuffer.current.length > 0 &&
      scktio.current
    ) {
      const audioBlob = float32ToWav(audioBuffer.current);

      // Read the audio blob and emit it with endOfStream: true
      await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64String = e.target.result.split(",")[1];
          scktio.current.emit("audio_transmit", {
            audio: base64String,
            index: currentStreamIndex.current,
            endOfStream: true, // Final chunk
          });
          // console.log("final", {
          //   audio: base64String,
          //   index: currentStreamIndex.current,
          //   endOfStream: true, // Mark the final transmission
          // });

          resolve(); // Ensure we wait for this operation to complete
        };
        reader.readAsDataURL(audioBlob);
      });
    } else if (scktio.current) {
      // No audio left in the buffer, explicitly send endOfStream
      scktio.current.emit("audio_transmit", {
        audio: null,
        index: currentStreamIndex.current,
        endOfStream: true, // Explicitly notify endOfStream
      });
      // console.log("final else", {
      //   audio: null,
      //   index: currentStreamIndex.current,
      //   endOfStream: true, // Mark the final transmission
      // });
    }

    // Cleanup: Disconnect all audio processing components
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      await audioContextRef.current.close();
    }

    // Disconnect the socket
    if (scktio.current) {
      scktio.current.disconnect();
      scktio.current = null;
    }

    // Reset recording state
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  useEffect(() => {
    const uniqueTextArray = textWithGuidList.map((textWithGuid) =>
      getRenderableGrapheme(textWithGuid["graphemeArray"][0])
    );

    setResults(uniqueTextArray.join(" "));
  }, [textWithGuidList]);

  const handleCopy = () => {
    const textToCopy = results;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  const handleClear = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Cleared!", "Your text has been cleared.", "success");
        if (scktio.current) {
          scktio.current.emit("clear", { message: "clear" });
        }
        setResults("");
        setTextWithGuidList([]);
      }
    });
  };

  const downloadAsWord = () => {
    const blob = new Blob([results], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "results.doc";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <TextareaWrapper colors={colors}>
            <Textarea
              colors={colors}
              value={results}
              onChange={(e) => setResults(e.target.value)}
              placeholder="Your text will appear here..."
            />
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="success"
                disabled={!results}
                onClick={handleCopy}
              >
                <FaCopy style={{ marginRight: "5px" }} /> Copy
              </Button>

              <Button disabled={!results} onClick={downloadAsWord}>
                <FaFileWord /> Download
              </Button>
              <Button
                disabled={!results}
                variant="danger"
                onClick={handleClear}
              >
                <IoRemoveCircle />
                Clear
              </Button>
            </div>
          </TextareaWrapper>
        </ResultCard>
      </ResultsContainer>
    </Container>
  );
};

export default AudioStreamingComponent;
