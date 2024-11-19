/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaVolumeUp, FaFileAudio } from "react-icons/fa";
import useColors from "../../hooks/useColors";
import { Flex, Text } from "../../ui/GlobalStyle";
import { FaRegCirclePause } from "react-icons/fa6";
import { IoPlayCircleOutline } from "react-icons/io5";
import { LuFileAudio2 } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

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
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins} minutes ${secs} seconds`;
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
              <strong>{audioMetadata?.name}</strong>

              {audioMetadata?.size > 0 && (
                <Text color={colors?.secondaryText}>
                  {" "}
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
            <ControlButton onClick={togglePlayback} colors={colors}>
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

      <TranscribeButton colors={colors}>Transcribe</TranscribeButton>
    </Card>
  );
};

const Card = styled.div`
  background: ${({ colors }) => colors?.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px ${({ colors }) => colors?.shadow};
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const FileInfo = styled.div`
  color: ${({ colors }) => colors.text};
  display: flex;
  justify-content: flex-start;

  p {
    margin: 0;
    font-size: 14px;

    strong {
      color: ${({ colors }) => colors.primary};
    }
  }
`;

const AudioPlayer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProgressContainer = styled.span`
  height: 5px;
  background: ${({ colors }) => colors?.border};
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  width: 100%;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ colors }) => colors?.primary};
  border-radius: 5px;
`;

const ControlButton = styled.span`
  cursor: pointer;
  padding: 10px;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  input {
    width: 100px;
    height: 5px;
  }
`;

const TranscribeButton = styled.div`
  background-color: ${({ colors }) => colors?.light};
  color: ${({ colors }) => colors?.primary};
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
  text-align: center;
  width: 80%;
  margin: 10px auto;

  &:hover {
    background-color: ${({ colors }) => colors?.primary};
    color: #fff;
  }
`;
export default PlaybackSection;
