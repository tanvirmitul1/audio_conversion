/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import styled from "styled-components";
import { FaMicrophone, FaStop } from "react-icons/fa";
import useColors from "../../hooks/useColors";
import { BsSoundwave } from "react-icons/bs";
import { FaRegCirclePause } from "react-icons/fa6";
import { IoPlayCircleOutline } from "react-icons/io5";
import { Flex } from "../../ui/GlobalStyle";

const RecordingSection = ({
  isRecording,
  startRecording,
  stopRecording,
  recordingTime,
}) => {
  const colors = useColors();

  return (
    <Card colors={colors}>
      <h3 style={{ color: colors?.text, marginBottom: "10px" }}>Live Record</h3>
      <RecordingControls colors={colors}>
        <Flex justifyContent={"space-between"} alignItems={"center"}>
          <ControlButton
            colors={colors}
            onClick={startRecording}
            recording={isRecording}
          >
            <Flex direction={"column"} style={{ position: "relative" }}>
              <Flex>
                <FaMicrophone color={isRecording ? "red" : colors?.primary} />
                {isRecording ? "Recording" : "Record"}
              </Flex>

              <div style={{ position: "absolute", top: "10px", left: "40px" }}>
                {isRecording && (
                  <p style={{ marginTop: "10px", color: "red" }}>
                    {recordingTime}
                  </p>
                )}
              </div>
            </Flex>
          </ControlButton>

          <ControlButton colors={colors} onClick={stopRecording}>
            <FaStop color={colors?.primary} />
            {isRecording ? "Stop" : null}
          </ControlButton>
        </Flex>
        <WaveIcon size={100} color={colors?.primary} />
        {isRecording ? (
          <ControlIcon size={30} color={colors?.primary}>
            <FaRegCirclePause />
          </ControlIcon>
        ) : (
          <ControlIcon size={30} color={colors?.primary}>
            <IoPlayCircleOutline />
          </ControlIcon>
        )}
      </RecordingControls>
    </Card>
  );
};

const Card = styled.div`
  background: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px ${({ colors }) => colors?.shadow};
  margin-bottom: 20px;
  width: 50%;
  height: 100%;
  border: 1px solid ${({ colors }) => colors?.border};

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }

  @media (min-width: 1400px) {
    width: 40%;
    height: 100%;
  }
`;

const RecordingControls = styled.div`
  text-align: center;
  width: 100%;
  max-height: 100%;
  border: 1px solid ${({ colors }) => colors?.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;

  @media (min-width: 1400px) {
    padding: 20px;
    max-height: 100%;
  }
`;

const ControlButton = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px;
  }

  @media (min-width: 1200px) {
    font-size: 1rem;
    padding: 12px;
  }
`;

const WaveIcon = styled(BsSoundwave)`
  margin: 20px 0;

  @media (max-width: 768px) {
    margin: 15px 0;
    size: 80;
  }

  @media (min-width: 1200px) {
    margin: 25px 0;
    size: 120;
  }
`;

const ControlIcon = styled.div`
  font-size: ${({ size }) => size}px;

  @media (max-width: 768px) {
    font-size: ${({ size }) => size - 5}px;
  }

  @media (min-width: 1200px) {
    font-size: ${({ size }) => size + 5}px;
  }
`;

export default RecordingSection;
