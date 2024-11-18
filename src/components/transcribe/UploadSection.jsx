/* eslint-disable react/prop-types */

import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import useColors from "../../hooks/useColors";

const UploadSection = ({ handleFileUpload }) => {
  const colors = useColors();
  return (
    <Card colors={colors}>
      <h3 style={{ color: colors?.text, marginBottom: "10px" }}>
        Upload Audio File
      </h3>
      <UploadArea colors={colors}>
        <FaUpload size={30} color="#007bff" />
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        <p>Drag and drop or click to upload an audio file</p>
      </UploadArea>
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

const UploadArea = styled.div`
  text-align: center;
  width: 100%;
  max-height: 100%;
  border: 1px solid ${({ colors }) => colors?.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  input {
    display: none;
  }

  p {
    font-size: 14px;
    color: #666;
  }

  @media (min-width: 1400px) {
    padding: 20px;
    max-height: 100%;
  }
`;

export default UploadSection;
