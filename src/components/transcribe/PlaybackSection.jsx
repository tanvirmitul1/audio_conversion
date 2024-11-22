/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { FaVolumeUp } from "react-icons/fa";
import useColors from "../../hooks/useColors";
import { Flex, Text } from "../../ui/GlobalStyle";
import { FaRegCirclePause } from "react-icons/fa6";
import { IoPlayCircleOutline } from "react-icons/io5";
import { LuFileAudio2 } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  AudioPlayer,
  Card,
  ControlButton,
  FileInfo,
  ProgressBar,
  ProgressContainer,
  TranscribeButton,
  VolumeControl,
} from "../../ui/PlaybackSectionUI";
import { chunkAudio } from "../../utils/audioHelpers";

import io from "socket.io-client";
import { formatDuration } from "../../utils/formatDuration";
import { float2wavPlayback } from "../../utils/float2wavPlayback";

const PlaybackSection = ({
  audioRef,
  audioURL,
  isPlaying,
  togglePlayback,
  progress,
  handleProgressClick,
  volume,
  handleVolumeChange,
  handleTimeUpdate,
  audioMetadata,
  handleAudioMetadataLoad,
  handleDeleteAudio,
}) => {
  const colors = useColors();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResults, setTranscriptionResults] = useState("");
  const socketRef = useRef(null);
  const currentStreamIndex = useRef(0);

  const initializeWebSockets = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io("https://stt.bangla.gov.bd:9394/", {
      transports: ["websocket"],
    });

    socket.on("result", (data) => {
      if (data.chunk === "large_chunk") {
        const words =
          data.output?.predicted_words?.map((wordObj) => wordObj.word.trim()) ||
          [];
        setTranscriptionResults((prev) => prev + " " + words.join(" "));
      }
    });

    socket.on("last_result", (data) => {
      if (data.chunk === "large_chunk") {
        const words =
          data.output?.predicted_words?.map((wordObj) => wordObj.word.trim()) ||
          [];
        setTranscriptionResults((prev) => prev + " " + words.join(" "));
      }
    });

    socket.on("disconnected_from_server", ({ message }) => {
      console.warn("Disconnected from server:", message);
    });

    socketRef.current = socket;
  };

  const handleTranscribe = async () => {
    if (!audioRef.current) {
      console.error("Audio reference is null or undefined.");
      return;
    }

    try {
      setIsTranscribing(true);
      initializeWebSockets();

      const audioChunks = await chunkAudio(audioRef.current, 0.5);

      if (audioChunks.length === 0) {
        console.warn("No audio chunks to send.");
        return;
      }

      audioChunks.forEach((chunk, index) => {
        const audioBlob = float2wavPlayback(chunk);
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64String = e.target.result.split(",")[1];
          if (socketRef.current) {
            socketRef.current.emit("audio_transmit", {
              audio: base64String,
              index: index,
              endOfStream: index === audioChunks.length - 1, // Mark the last chunk
            });
          }
        };

        reader.readAsDataURL(audioBlob);
      });
    } catch (error) {
      console.error("Error chunking or sending audio:", error.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTogglePlayback = () => {
    if (!audioURL) {
      console.error("No audio loaded to play.");
      return;
    }
    togglePlayback(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Card colors={colors}>
      <h3 style={{ color: colors.text }}>Recorded/Uploaded Audio</h3>

      <AudioPlayer>
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => togglePlayback(false)}
          onLoadedMetadata={handleAudioMetadataLoad}
        />

        <Flex justifyContent={"flex-start"} alignItems={"center"}>
          <LuFileAudio2 size={60} color={colors?.primary} />

          <Flex direction={"column"} justifyContent={"flex-start"} gap={"5px"}>
            <FileInfo colors={colors}>
              <strong>{audioMetadata?.name || "Unnamed Audio"}</strong>

              {audioMetadata?.size > 0 && (
                <Text color={colors?.secondaryText}>
                  {audioMetadata?.size.toFixed(2)} MB
                </Text>
              )}
              {audioMetadata?.duration > 0 && (
                <Text color={colors?.secondaryText}>
                  {formatDuration(audioMetadata?.duration)}
                </Text>
              )}
            </FileInfo>
            <ProgressContainer colors={colors} onClick={handleProgressClick}>
              <ProgressBar colors={colors} style={{ width: `${progress}%` }} />
            </ProgressContainer>
          </Flex>
          {audioURL && (
            <ControlButton onClick={handleTogglePlayback} colors={colors}>
              {isPlaying ? (
                <FaRegCirclePause size={25} color={colors?.primary} />
              ) : (
                <IoPlayCircleOutline size={25} color={colors?.primary} />
              )}
            </ControlButton>
          )}
          {audioURL && (
            <ControlButton colors={colors} onClick={handleDeleteAudio}>
              <RiDeleteBin6Line size={20} />
            </ControlButton>
          )}
        </Flex>

        <VolumeControl colors={colors}>
          <FaVolumeUp style={{ color: colors.text }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
      </AudioPlayer>

      <TranscribeButton
        colors={colors}
        onClick={handleTranscribe}
        disabled={isTranscribing}
      >
        {isTranscribing ? "Transcribing..." : "Transcribe"}
      </TranscribeButton>

      <div>
        <h4>Transcription Results:</h4>
        <p>{transcriptionResults}</p>
      </div>
    </Card>
  );
};

export default PlaybackSection;
