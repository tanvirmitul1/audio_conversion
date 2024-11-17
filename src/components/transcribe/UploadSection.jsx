/* eslint-disable react/prop-types */

import styled from "styled-components";
import { FaUpload } from "react-icons/fa";

const UploadSection = ({ handleFileUpload }) => {
  return (
    <Card>
      <h3>Upload Audio File</h3>
      <UploadArea>
        <FaUpload size={30} color="#007bff" />
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
        <p>Drag and drop or click to upload an audio file</p>
      </UploadArea>
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

const UploadArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 2px dashed #ccc;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  input {
    display: none;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;

export default UploadSection;
