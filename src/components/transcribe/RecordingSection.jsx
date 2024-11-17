/* eslint-disable react/prop-types */

import styled from "styled-components";
import { FaMicrophone, FaStop } from "react-icons/fa";

const RecordingSection = ({ isRecording, startRecording, stopRecording }) => {
  return (
    <Card>
      <h3>Record Audio</h3>
      <RecordingControls>
        {!isRecording ? (
          <ControlButton onClick={startRecording}>
            <FaMicrophone /> Start Recording
          </ControlButton>
        ) : (
          <ControlButton onClick={stopRecording}>
            <FaStop /> Stop Recording
          </ControlButton>
        )}
      </RecordingControls>
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

const RecordingControls = styled.div`
  text-align: center;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 14px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }
`;

export default RecordingSection;
