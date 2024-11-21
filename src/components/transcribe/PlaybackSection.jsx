/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
// import { io } from "socket.io-client";
import { chunkAudio } from "../../utils/audioHelpers";
import openSocket from "socket.io-client";

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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins} minutes ${secs} seconds`;
  };

  const socket = openSocket("https://stt.bangla.gov.bd:9394/", {
    transports: ["websocket"],
  });

  socket.on("result", (data) => {
    console.log("Transcription Result:", data);
  });

  socket.on("result_upload", (data) => {
    console.log("Transcription Upload Result:", data);
  });

  const handleTranscribe = async () => {
    if (!audioRef.current) {
      console.error("Audio reference is null or undefined.");
      return;
    }

    try {
      setIsTranscribing(true);
      const audioChunks = await chunkAudio(audioRef.current, 0.5);

      if (audioChunks.length === 0) {
        console.warn("No audio chunks to send.");
        return;
      }

      audioChunks.forEach((chunk) => {
        socket.emit("audio_transmit", chunk);
      });

      console.log("Chunks sent to backend:", audioChunks);
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
    </Card>
  );
};

export default PlaybackSection;
