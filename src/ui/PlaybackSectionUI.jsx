import styled from "styled-components";

export const Card = styled.div`
  background: ${({ colors }) => colors?.background};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px ${({ colors }) => colors?.shadow};
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
export const FileInfo = styled.div`
  color: ${({ colors }) => colors.text};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    font-size: 14px;

    strong {
      color: ${({ colors }) => colors.primary};
    }
  }
`;

export const AudioPlayer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProgressContainer = styled.span`
  height: 5px;
  background: ${({ colors }) => colors?.border};
  border-radius: 5px;
  position: relative;
  cursor: pointer;
  width: 100%;
`;

export const ProgressBar = styled.div`
  height: 100%;
  background: ${({ colors }) => colors?.primary};
  border-radius: 5px;
`;

export const ControlButton = styled.span`
  cursor: pointer;
  padding: 10px;
`;

export const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  input {
    width: 100px;
    height: 5px;
  }
`;

export const TranscribeButton = styled.div`
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:hover {
    background-color: ${({ colors }) => colors?.primary};
    color: #fff;
  }
`;
