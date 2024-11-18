/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import useColors from "../../hooks/useColors";

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
}) => {
  const colors = useColors();
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Card colors={colors}>
      <h3 style={{ color: colors.text }}>Playback Controls</h3>
      {audioMetadata.name && (
        <FileInfo colors={colors}>
          <p>
            File: <strong>{audioMetadata.name}</strong>
          </p>
          {audioMetadata.duration > 0 && (
            <p>Duration: {formatDuration(audioMetadata.duration)}</p>
          )}
        </FileInfo>
      )}
      <AudioPlayer>
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => togglePlayback(false)}
          onLoadedMetadata={handleAudioMetadataLoad}
        />
        <ProgressContainer colors={colors} onClick={handleProgressClick}>
          <ProgressBar colors={colors} style={{ width: `${progress}%` }} />
        </ProgressContainer>
        <PlaybackControls>
          <ControlButton colors={colors} onClick={togglePlayback}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </ControlButton>
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
        </PlaybackControls>
      </AudioPlayer>
    </Card>
  );
};

const Card = styled.div`
  background: ${({ colors }) => colors?.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px ${({ colors }) => colors?.shadow};
  margin-bottom: 20px;
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const FileInfo = styled.div`
  margin-bottom: 10px;
  color: ${({ colors }) => colors.text};

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

const ProgressContainer = styled.div`
  height: 8px;
  background: ${({ colors }) => colors?.border};
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ colors }) => colors?.primary};
  border-radius: 5px;
`;

const PlaybackControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ControlButton = styled.button`
  background: ${({ colors }) => colors?.primary};
  color: ${({ colors }) => colors?.text};
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background: ${({ colors }) =>
      colors?.mode === "dark" ? "#7a33cc" : "#0056b3"};
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input {
    width: 100px;
  }
`;

export default PlaybackSection;
