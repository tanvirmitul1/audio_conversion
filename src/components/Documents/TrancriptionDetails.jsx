import { useState, useRef } from "react";
import styled from "styled-components";
import { MdEdit, MdOutlinePictureAsPdf } from "react-icons/md";

const TranscriptionDetails = () => {
  const [translationChunks, setTranslationChunks] = useState([
    { speaker: "Speaker 1", time: [0, 15], text: "Hello, how are you?" },
    { speaker: "Speaker 2", time: [15, 30], text: "I'm fine, thank you." },
    { speaker: "Speaker 1", time: [30, 45], text: "Great to hear that." },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showTimelaps, setShowTimelaps] = useState(true);
  const audioRef = useRef(null);

  const handlePlayChunk = (startTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredChunks = translationChunks.filter((chunk) =>
    chunk.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTextChange = (index, newText) => {
    const updatedChunks = [...translationChunks];
    updatedChunks[index].text = newText;
    setTranslationChunks(updatedChunks);
  };

  const handleSave = () => {
    alert("Changes saved!");
    console.log("Updated Translations:", translationChunks);
  };

  const handleDiscard = () => {
    alert("Changes discarded!");
    // Optionally, reset translationChunks here.
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <div className="doc-info">
          <MdEdit size={24} />
          <div>
            <h2>Document Name</h2>
            <p>2024-11-19 10:00 AM</p>
          </div>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search in this document..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </Header>

      {/* Translation Content */}
      <Content>
        <TranslationSection>
          {filteredChunks.map((chunk, index) => (
            <div key={index}>
              {/* Render speaker only if it changes */}
              {index === 0 ||
              filteredChunks[index - 1].speaker !== chunk.speaker ? (
                <Speaker>{chunk.speaker}</Speaker>
              ) : null}
              <Chunk>
                {showTimelaps && (
                  <Time>{`${chunk.time[0]}-${chunk.time[1]}`}</Time>
                )}
                <TextInput
                  value={chunk.text}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  onClick={() => handlePlayChunk(chunk.time[0])}
                />
              </Chunk>
            </div>
          ))}
        </TranslationSection>

        {/* Actions */}
        <ActionsCard>
          <button
            className="pdf-button"
            onClick={() => console.log("Show PDF")}
          >
            <MdOutlinePictureAsPdf size={20} /> Show PDF
          </button>
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={showTimelaps}
                onChange={() => setShowTimelaps(!showTimelaps)}
              />
              Show Timelaps
            </label>
          </div>
          <div className="actions">
            <button className="discard" onClick={handleDiscard}>
              Discard Changes
            </button>
            <button className="save" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </ActionsCard>
      </Content>

      {/* Audio Player */}
      <AudioPlayer>
        <audio ref={audioRef} controls>
          <source src="https://example.com/audio.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </AudioPlayer>
    </Container>
  );
};

export default TranscriptionDetails;

/* Styled Components */
const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .doc-info {
    display: flex;
    align-items: center;
    gap: 10px;

    h2 {
      margin: 0;
      font-size: 20px;
    }

    p {
      margin: 0;
      color: #888;
      font-size: 14px;
    }
  }

  .search-bar input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    width: 300px;
  }
`;

const Content = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const TranslationSection = styled.div`
  flex: 3;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
`;

const Speaker = styled.div`
  font-weight: bold;
  color: #555;
  margin-top: 15px;
`;

const Chunk = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px dashed #bbb;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Time = styled.span`
  display: block;
  font-size: 12px;
  color: #888;
`;

const TextInput = styled.textarea`
  width: 100%;
  border: none;
  resize: none;
  background: transparent;
  font-size: 14px;
  color: #333;
  outline: none;
`;

const ActionsCard = styled.div`
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;

  .pdf-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
      background-color: #0056b3;
    }
  }

  .checkbox-container {
    margin-bottom: 10px;

    label {
      display: flex;
      align-items: center;
      gap: 5px;

      input {
        cursor: pointer;
      }
    }
  }

  .actions {
    display: flex;
    gap: 10px;

    button {
      flex: 1;
      padding: 8px;
      border-radius: 5px;
      cursor: pointer;

      &.discard {
        background-color: #dc3545;
        color: white;
        border: none;

        &:hover {
          background-color: #b52a37;
        }
      }

      &.save {
        background-color: #28a745;
        color: white;
        border: none;

        &:hover {
          background-color: #1c6c2d;
        }
      }
    }
  }
`;

const AudioPlayer = styled.div`
  audio {
    width: 100%;
  }
`;
