import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const Button = styled.button`
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

export const ResultsContainer = styled.div`
  margin-top: 20px;
  width: 90%;
`;

export const ResultCard = styled.div`
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  background-color: ${({ colors }) => colors?.background};
`;

export const RecordingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  color: ${({ isRecording, colors }) =>
    isRecording ? colors?.primary : colors?.grey};
  font-size: 18px;
  height: 20px;
`;

export const Timer = styled.div`
  margin-top: 5px;
  font-size: 16px;
  font-weight: bold;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const RecordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background-color: ${({ colors }) => colors?.primary};
  color: ${({ colors }) => colors?.buttonColor};
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ colors }) => colors?.dark};
  }
`;

export const StopButton = styled(RecordButton)`
  background-color: ${({ colors }) => colors?.danger};
`;

export const TextareaWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 10px;
  border: ${({ colors }) => `1px solid ${colors?.border}`};
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  overflow-wrap: break-word;
  word-wrap: break-word;
  white-space: pre-wrap;
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
`;

export const CopyButton = styled.button`
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  &:hover {
    background-color: #218838;
  }
`;
