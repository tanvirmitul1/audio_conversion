import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import useColors from "../../hooks/useColors";
import { FiEdit } from "react-icons/fi";
import SearchBar from "../reusable/SearchBar";
import { useParams } from "react-router-dom";
import { dummyData } from "../../utils/dummydata";

const TranscriptionDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    if (id && dummyData.length > 0)
      setData(dummyData.find((d) => d.id === parseInt(id)));
  }, [id, dummyData]);
  const colors = useColors();
  const [translationChunks, setTranslationChunks] = useState([
    {
      speaker: "Speaker 1",
      translation: [
        {
          time: [0, 15],
          text: "Hello, how are you?",
          bangla: "হ্যালো, কি সঠিক আছে?",
        },
      ],
    },
    {
      speaker: "Speaker 2",
      translation: [
        {
          time: [15, 30],
          text: "I'm good, thanks!",
          bangla: "আমি ভালো, ধন্যবাদ!",
        },
      ],
    },
    {
      speaker: "Speaker 1",
      translation: [
        { time: [30, 45], text: "What's your name?", bangla: "আমার নাম কি?" },
        {
          time: [45, 60],
          text: "Where do you live?",
          bangla: "আমার জীবনের স্থান কি?",
        },
      ],
    },
    {
      speaker: "Speaker 2",
      translation: [
        { time: [60, 75], text: "My name is John.", bangla: "আমার নাম জোন।" },
        {
          time: [60, 75],
          text: "I live in Dhaka.",
          bangla: "আমার জীবনের স্থান ঢাকা।",
        },
        {
          time: [75, 90],
          text: "I'm from Bangladesh.",
          bangla: "আমার জীবনের স্থান বাংলাদেশ।",
        },
      ],
    },
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

  const filteredChunks = translationChunks
    .map((chunk) => ({
      ...chunk,
      translation: chunk.translation.filter((t) =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((chunk) => chunk.translation.length > 0);

  const handleTextChange = (chunkIndex, translationIndex, newText) => {
    const updatedChunks = [...translationChunks];
    updatedChunks[chunkIndex].translation[translationIndex].bangla = newText;
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
    <Container colors={colors}>
      {/* Header */}
      <Header colors={colors}>
        <div className="doc-info">
          <FiEdit size={40} />
          <div>
            <h2>{data?.name}</h2>
            <p>{data?.date}</p>
          </div>
        </div>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search text..."
        />
      </Header>

      {/* Translation Content */}
      <Content>
        <TranslationSection colors={colors}>
          {filteredChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex}>
              <Speaker colors={colors}>{chunk.speaker}</Speaker>
              <Chunk colors={colors}>
                {chunk.translation.map((translation, translationIndex) => (
                  <SingleText key={translationIndex}>
                    {showTimelaps && (
                      <Time colors={colors}>
                        {`(${translation.time[0]}-${translation.time[1]})`}
                      </Time>
                    )}
                    <TextInput
                      colors={colors}
                      value={translation.text}
                      onChange={(e) =>
                        handleTextChange(
                          chunkIndex,
                          translationIndex,
                          e.target.value
                        )
                      }
                      onClick={() => handlePlayChunk(translation.time[0])}
                    />
                  </SingleText>
                ))}
              </Chunk>
            </div>
          ))}
        </TranslationSection>

        {/* Actions */}
        <ActionsCard colors={colors}>
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
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
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
      color: ${({ colors }) => colors?.secondaryText};
      font-size: 14px;
    }
  }

  .search-bar input {
    padding: 8px;
    border: 1px solid ${({ colors }) => colors?.border};
    border-radius: 5px;
    width: 300px;
    background-color: ${({ colors }) => colors?.light};
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
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 5px;
  background-color: ${({ colors }) => colors?.sidebarBg};
`;

const Speaker = styled.div`
  font-weight: bold;
  color: ${({ colors }) => colors?.secondaryText};
  margin-top: 15px;
`;

const Chunk = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
`;

const Time = styled.span`
  display: flex;
  font-size: 12px;
  color: ${({ colors }) => colors?.secondaryText};
`;

const TextInput = styled.input`
  border: none;
  resize: none;

  background: transparent;
  color: ${({ colors }) => colors?.text};
  outline: none;
`;

const ActionsCard = styled.div`
  flex: 1;
  padding: 10px;
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 5px;
  background-color: ${({ colors }) => colors?.light};

  .pdf-button {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px;
    background-color: ${({ colors }) => colors?.primary};
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .checkbox-container {
    margin-bottom: 10px;

    label {
      font-size: 14px;
    }
  }

  .actions button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
  }

  .discard {
    background-color: ${({ colors }) => colors?.danger};
    color: white;
  }

  .save {
    background-color: ${({ colors }) => colors?.success};
    color: white;
  }
`;

const AudioPlayer = styled.div`
  margin-top: 20px;
`;

const SingleText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
