/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

const WordRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
`;

const AudioStreamingComponent = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [results, setResults] = useState([]); // To store backend results
  const [audioBlob, setAudioBlob] = useState(null); // To store the recorded audio blob
  const [audioURL, setAudioURL] = useState(null); // To store audio URL for playback
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Cleanup WebSocket on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const startStreaming = async () => {
    try {
      // Initialize WebSocket
      wsRef.current = new WebSocket("https://stt.bangla.gov.bd:9394/");

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsStreaming(true);
        indexRef.current = 0; // Reset index when streaming starts
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.output?.predicted_words) {
            setResults((prevResults) => [...prevResults, data]);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      };

      wsRef.current.onerror = (error) =>
        console.error("WebSocket error:", error);

      wsRef.current.onclose = () => {
        console.log("WebSocket closed");
        setIsStreaming(false);
      };

      // Access the user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Listen for audio data
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioBase64 = reader.result.split(",")[1]; // Get base64 string
            wsRef.current.send(
              JSON.stringify({
                index: indexRef.current,
                audio: audioBase64,
                endOfStream: false,
              })
            );
            indexRef.current += 1; // Increment the index
          };
          reader.readAsDataURL(event.data); // Convert blob to base64
        }
      };

      // Start recording
      mediaRecorderRef.current.start(500); // Send data in 500ms chunks
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopStreaming = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          index: indexRef.current,
          audio: "",
          endOfStream: true,
        }) // Final message
      );
      wsRef.current.close();
    }
    setIsStreaming(false);
  };

  const handleSaveAudio = (audioData) => {
    const blob = new Blob([audioData], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    setAudioBlob(blob); // Store the blob for potential download
    setAudioURL(url); // Set the URL for playback
  };

  return (
    <Container>
      {!isStreaming && (
        <Button onClick={startStreaming} disabled={isStreaming}>
          Start Streaming
        </Button>
      )}
      {isStreaming && (
        <>
          <Button onClick={stopStreaming} disabled={!isStreaming}>
            Stop Streaming
          </Button>
          <h4>Recording...</h4>
        </>
      )}

      {audioURL && (
        <ResultsContainer>
          <h3>Recorded Audio:</h3>
          <audio controls>
            <source src={audioURL} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </ResultsContainer>
      )}

      <ResultsContainer>
        {results.map((result, idx) => (
          <ResultCard key={idx}>
            <h3>Chunk: {result.chunk}</h3>
            {result.output.predicted_words.map((word, wordIdx) => (
              <WordRow key={wordIdx}>
                <span>
                  Word: <strong>{word.word}</strong>
                </span>
                <span>
                  Confidence:{" "}
                  <strong>{word.is_confident ? "High" : "Low"}</strong>
                </span>
                <span>
                  Timestamp: {`[${word.timestamp[0]} - ${word.timestamp[1]}]`}
                </span>
              </WordRow>
            ))}
          </ResultCard>
        ))}
      </ResultsContainer>
    </Container>
  );
};

export default AudioStreamingComponent;
