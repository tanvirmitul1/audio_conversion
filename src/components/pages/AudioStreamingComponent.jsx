/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client"; // Ensure you have socket.io-client installed

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.disabled ? "#ddd" : "#4CAF50")};
  color: ${(props) => (props.disabled ? "#999" : "#fff")};
  border: none;
  border-radius: 5px;
  &:hover {
    background-color: ${(props) => (!props.disabled ? "#45a049" : "#ddd")};
  }
`;

const ResultsContainer = styled.div`
  margin-top: 20px;
  width: 90%;
`;

const ResultCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
`;

const AudioStreamingComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [results, setResults] = useState([]);
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
      console.log("Partial result:", message);
      setResults((prev) => [...prev, message]);
    });

    socket.on("last_result", (message) => {
      console.log("Final result:", message);
      setResults((prev) => [...prev, message]);
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
    if (sendingInterval.current) {
      clearInterval(sendingInterval.current);
      sendingInterval.current = null;
    }

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (scktio.current) {
      scktio.current.disconnect();
      scktio.current = null;
    }

    setIsRecording(false);
  };

  const float32ToWav = (float32Array) => {
    const buffer = new ArrayBuffer(44 + float32Array.length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    const sampleRate = 44100;
    const numChannels = 1;
    const bitDepth = 16;

    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + float32Array.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, float32Array.length * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
      const sample = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
    }

    return new Blob([view], { type: "audio/wav" });
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
        {results.map((result, idx) => (
          <ResultCard key={idx}>
            <p>{JSON.stringify(result)}</p>
          </ResultCard>
        ))}
      </ResultsContainer>
    </Container>
  );
};

export default AudioStreamingComponent;
