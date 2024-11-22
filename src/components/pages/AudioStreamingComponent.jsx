/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client"; // Ensure you have socket.io-client installed
import {
  Button,
  Container,
  ResultCard,
  ResultsContainer,
} from "../../ui/AudioStreamUI";
import { float32ToWav } from "../../utils/float32ToWav";

const AudioStreamingComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState(""); // Initialize as an empty string

  const [light, setLight] = useState("red");
  const scktio = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const currentStreamIndex = useRef(0);
  const audioBuffer = useRef(null); // Buffer to accumulate audio
  const sendingInterval = useRef(null); // Interval for sending data

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
      if (message.chunk === "large_chunk") {
        console.log("Large chunk result:", message);

        // Extract and clean words
        const words =
          message.output?.predicted_words?.map((wordObj) =>
            wordObj.word.trim()
          ) || [];
        setResults((prev) => prev + " " + words.join(" "));
      }
    });

    socket.on("last_result", (message) => {
      if (message.chunk === "large_chunk") {
        console.log("Final large chunk result:", message);

        // Extract and clean words
        const words =
          message.output?.predicted_words?.map((wordObj) =>
            wordObj.word.trim()
          ) || [];
        setResults((prev) => prev + " " + words.join(" "));
      }
    });

    scktio.current = socket;
  };

  const startRecording = async () => {
    setResults([]);
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

    audioContextRef.current = audioContext;
    mediaStreamRef.current = mediaStream;
    scriptProcessorRef.current = scriptProcessor;

    setIsRecording(true);
  };

  const stopRecording = () => {
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
      <Button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </Button>
      <Button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </Button>
      <h3>Light Status: {light}</h3>
      <ResultsContainer>
        <ResultCard>
          <p>{results}</p>
        </ResultCard>
      </ResultsContainer>
    </Container>
  );
};

export default AudioStreamingComponent;
