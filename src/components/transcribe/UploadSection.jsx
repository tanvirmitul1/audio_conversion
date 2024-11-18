/* eslint-disable react/prop-types */
import { useState } from "react";
import styled from "styled-components";
import { FaUpload } from "react-icons/fa";
import useColors from "../../hooks/useColors";

const UploadSection = ({ handleFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const colors = useColors();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0]; // Access the first dropped file
    if (file) {
      handleFileUpload({ target: { files: [file] } }); // Mimic the input event structure
    }
  };

  return (
    <Card colors={colors}>
      <h3 style={{ color: colors?.text, marginBottom: "10px" }}>
        Upload Audio File
      </h3>
      <UploadArea
        colors={colors}
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label htmlFor="file-upload">
          <FaUpload size={30} color={colors?.primary} />
          <p>
            {isDragging
              ? "Release to upload"
              : "Drag and drop or click to upload an audio file"}
          </p>
        </label>
        <input
          id="file-upload"
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
        />
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
  border: 1px solid ${({ colors }) => colors?.border};

  @media (max-width: 768px) {
    width: 90%;
    padding: 15px;
  }

  @media (min-width: 1400px) {
    width: 40%;
  }
`;

const UploadArea = styled.div`
  text-align: center;
  width: 100%;
  border: 2px dashed
    ${({ colors, isDragging }) =>
      isDragging ? colors?.primary : colors?.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${({ isDragging }) =>
    isDragging ? "rgba(0, 123, 255, 0.1)" : "transparent"};

  label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  input {
    display: none;
  }

  p {
    font-size: 14px;
    color: ${({ colors }) => colors?.secondaryText};
  }
`;

export default UploadSection;
