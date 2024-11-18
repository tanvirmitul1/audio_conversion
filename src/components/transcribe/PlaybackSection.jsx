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
}) => {
  const colors = useColors();

  return (
    <Card colors={colors}>
      <h3 style={{ color: colors.text }}>Playback Controls</h3>
      <AudioPlayer>
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => togglePlayback(false)}
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
