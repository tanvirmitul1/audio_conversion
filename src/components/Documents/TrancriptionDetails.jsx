import { useState, useRef, useEffect } from "react";

import { FiEdit } from "react-icons/fi";
import SearchBar from "../reusable/SearchBar";
import { useParams } from "react-router-dom";
import { dummyData } from "../../utils/dummydata";
import { jsPDF } from "jspdf";
import ReactPlayer from "react-player";
import {
  ActionsCard,
  AudioPlayer,
  Chunk,
  Container,
  Content,
  Header,
  SingleText,
  Speaker,
  TextInput,
  Time,
  TranslationSection,
} from "../../ui/TranscriptionDetailsUI";
import useColors from "../../hooks/useColors";
import { FaRegFilePdf } from "react-icons/fa";

const TranscriptionDetails = () => {
  const colors = useColors();
  const { id } = useParams();
  const [data, setData] = useState([]);
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

  useEffect(() => {
    if (id && dummyData.length > 0)
      setData(dummyData.find((d) => d.id === parseInt(id)));
  }, [id, dummyData]);

  // Handle audio play for the chunk
  const handlePlayChunk = (startTime) => {
    if (audioRef.current) {
      audioRef.current.seekTo(startTime);
      audioRef.current.play();
    }
  };

  // Handle text change
  const handleTextChange = (chunkIndex, translationIndex, newText) => {
    const updatedChunks = [...translationChunks];
    updatedChunks[chunkIndex].translation[translationIndex].text = newText;
    setTranslationChunks(updatedChunks);
  };

  // Handle Save Changes
  const handleSave = () => {
    alert("Changes saved!");
    console.log("Updated Translations:", translationChunks);
  };

  // Handle Discard Changes
  const handleDiscard = () => {
    alert("Changes discarded!");
    // Optionally, reset translationChunks here.
  };

  // Filter translations based on search term
  const filteredChunks = translationChunks
    .map((chunk) => ({
      ...chunk,
      translation: chunk.translation.filter((t) =>
        t.text.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((chunk) => chunk.translation.length > 0);

  // Generate PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    filteredChunks.forEach((chunk, chunkIndex) => {
      doc.text(`${chunk.speaker}:`, 10, 20 + chunkIndex * 10);
      chunk.translation.forEach((translation, translationIndex) => {
        doc.text(
          `${translation.text}`,
          10,
          30 + chunkIndex * 10 + translationIndex * 10
        );
      });
    });
    doc.save("transcription.pdf");
  };

  return (
    <Container colors={colors}>
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

      <Content>
        <TranslationSection colors={colors}>
          {filteredChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex}>
              <Speaker>{chunk.speaker}</Speaker>
              <Chunk colors={colors}>
                {chunk.translation.map((translation, translationIndex) => (
                  <SingleText key={translationIndex}>
                    {showTimelaps && (
                      <Time>
                        {`(${translation.time[0]}-${translation.time[1]})`}
                      </Time>
                    )}
                    <TextInput
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

        <ActionsCard colors={colors}>
          <div className="pdf-container">
            <div onClick={handleGeneratePDF}>
              <FaRegFilePdf size={20} /> Download PDF
            </div>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={showTimelaps}
                  onChange={() => setShowTimelaps(!showTimelaps)}
                />
                <span style={{ marginLeft: "5px" }}>Show Timestamps</span>
              </label>
            </div>
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

      <AudioPlayer>
        <ReactPlayer
          ref={audioRef}
          url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
          controls
          width="100%"
          height="50px"
        />
      </AudioPlayer>
    </Container>
  );
};

export default TranscriptionDetails;
