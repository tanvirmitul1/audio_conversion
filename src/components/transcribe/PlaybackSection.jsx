/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

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
  return (
    <Card>
      <h3>Playback Controls</h3>
      <AudioPlayer>
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => togglePlayback(false)}
        />
        <ProgressContainer onClick={handleProgressClick}>
          <ProgressBar style={{ width: `${progress}%` }} />
        </ProgressContainer>
        <PlaybackControls>
          <ControlButton onClick={togglePlayback}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </ControlButton>
          <VolumeControl>
            <FaVolumeUp />
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
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const AudioPlayer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProgressContainer = styled.div`
  height: 8px;
  background: #ddd;
  border-radius: 5px;
  position: relative;
  cursor: pointer;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #007bff;
  border-radius: 5px;
`;

const PlaybackControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ControlButton = styled.button`
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
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
