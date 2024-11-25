/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { FaVolumeUp } from "react-icons/fa";
import useColors from "../../hooks/useColors";
import { Flex, Text } from "../../ui/GlobalStyle";
import { FaRegCirclePause } from "react-icons/fa6";
import { IoPlayCircleOutline } from "react-icons/io5";
import { LuFileAudio2 } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  AudioPlayer,
  Card,
  ControlButton,
  FileInfo,
  ProgressBar,
  ProgressContainer,
  TranscribeButton,
  VolumeControl,
} from "../../ui/PlaybackSectionUI";
import { chunkAudio } from "../../utils/audioHelpers";

import io from "socket.io-client";
import { formatDuration } from "../../utils/formatDuration";
import { float2wavPlayback } from "../../utils/float2wavPlayback";
import Loader from "../reusable/Loader";

const PlaybackSection = ({
  audioRef,
  audioURL,
  isPlaying,
  togglePlayback,
  progress,
  handleProgressClick,
  volume,
  handleVolumeChange,
  handleTimeUpdate,
  audioMetadata,
  handleAudioMetadataLoad,
  handleDeleteAudio,
}) => {
  const colors = useColors();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResults, setTranscriptionResults] = useState("");

  let [textWithGuidList, setTextWithGuidList] = useState([]);
  const socketRef = useRef(null);
  const currentStreamIndex = useRef(0);

  const initializeWebSockets = () => {
    setTextWithGuidList([]);
    if (!socketRef.current) {
      const socket = io("https://voice.bangla.gov.bd:9394/", {
        transports: ["websocket"],
      });

      // socket.on("result", (data) => {
      //   console.log({ data });
      //   if (data.chunk === "large_chunk") {
      //     const words =
      //       data.output?.predicted_words?.map((wordObj) =>
      //         wordObj.word.trim()
      //       ) || [];
      //     setTranscriptionResults((prev) => prev + " " + words.join(" "));
      //   }
      // });
      socket.on("result", (message) => {
        console.log({ message });
        if (message.chunk === "small_chunk") {
          let textArray = [message.output];
          let textWithGuidObj = {
            guid: message.guid,
            graphemeArray: textArray,
            phonemeArray: [],
            audio: undefined,
            index: message.output === "" ? null : message.index,
            alternatives: undefined,
            type: "large_chunk",
          };
          setTextWithGuidList((prevTextWithGuidList) => {
            let joinedList = [...prevTextWithGuidList, textWithGuidObj];
            return joinedList.sort(
              (a, b) =>
                parseInt(a.index.split(":")[0]) -
                parseInt(b.index.split(":")[0])
            );
          });
        } else {
          let textArray = [message.output];
          let textWithGuidObj = {
            guid: message.guid,
            graphemeArray: textArray,
            phonemeArray: [],
            audio: undefined,
            index: message.output === "" ? null : message.index,
            alternatives: undefined,
            type: "large_chunk",
          };
          let replacingIndices = message.index;
          let startIndex = parseInt(replacingIndices.split(":")[0]);
          let endIndex = parseInt(replacingIndices.split(":")[1]);
          setTextWithGuidList((prevTextWithGuidList) => {
            const newList = [...prevTextWithGuidList];

            let indicesToReplace = [];
            newList.forEach((item, index) => {
              if (
                parseInt(item.index.split(":")[0]) >= startIndex &&
                parseInt(item.index.split(":")[0]) <= endIndex
              ) {
                indicesToReplace.push(index);
              }
              if (index !== -1) {
                newList.splice(indicesToReplace[0], indicesToReplace.length);
              }
            });

            newList.push(textWithGuidObj);

            return newList.sort(
              (a, b) =>
                parseInt(a.index.split(":")[0]) -
                parseInt(b.index.split(":")[0])
            );
          });
        }
      });

      socket.on("last_result", (data) => {
        console.log("last_result", { data });
        if (data.chunk === "large_chunk") {
          const words =
            data.output?.predicted_words?.map((wordObj) =>
              wordObj.word.trim()
            ) || [];
          setTranscriptionResults((prev) => prev + " " + words.join(" "));
        }
      });

      socket.on("disconnected_from_server", ({ message }) => {
        console.warn("Disconnected from server:", message);
      });

      socket.on("connect", () => {
        console.log("WebSocket connected");
      });

      socket.on("disconnect", (reason) => {
        console.warn("WebSocket disconnected:", reason);
      });

      socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });

      socket.on("last_result", (message) => {
        console.log("last_result", message);
      });

      socketRef.current = socket;
    }
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleTranscribe = async () => {
    setTextWithGuidList([]);
    if (!audioRef.current) {
      console.error("Audio reference is null or undefined.");
      return;
    }

    try {
      setIsTranscribing(true);
      initializeWebSockets();

      const audioChunks = await chunkAudio(audioRef.current, 0.5);

      if (audioChunks.length === 0) {
        console.warn("No audio chunks to send.");
        return;
      }

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      for (let index = 0; index < audioChunks.length; index++) {
        const chunk = audioChunks[index];
        const audioBlob = float2wavPlayback(chunk);
        const reader = new FileReader();

        reader.onload = async (e) => {
          const base64String = e.target.result.split(",")[1];
          if (socketRef.current) {
            socketRef.current.emit("audio_transmit", {
              audio: base64String,
              index: index,
              endOfStream: index === audioChunks.length - 1, // Mark the last chunk
            });

            // console.log({
            //   audio: base64String,
            //   index: index,
            //   endOfStream: index === audioChunks.length - 1,
            // });
          }
        };

        reader.readAsDataURL(audioBlob);
        await delay(100);
      }
    } catch (error) {
      console.error("Error chunking or sending audio:", error.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTogglePlayback = () => {
    if (!audioURL) {
      console.error("No audio loaded to play.");
      return;
    }
    togglePlayback(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Card colors={colors}>
      <h3 style={{ color: colors.text }}>Recorded/Uploaded Audio</h3>

      <AudioPlayer>
        <audio
          ref={audioRef}
          src={audioURL}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => togglePlayback(false)}
          onLoadedMetadata={handleAudioMetadataLoad}
        />

        <Flex justifyContent={"flex-start"} alignItems={"center"}>
          <LuFileAudio2 size={60} color={colors?.primary} />

          <Flex direction={"column"} justifyContent={"flex-start"} gap={"5px"}>
            <FileInfo colors={colors}>
              <strong>{audioMetadata?.name || "Unnamed Audio"}</strong>

              {audioMetadata?.size > 0 && (
                <Text color={colors?.secondaryText}>
                  {audioMetadata?.size.toFixed(2)} MB
                </Text>
              )}
              {audioMetadata?.duration > 0 && (
                <Text color={colors?.secondaryText}>
                  {formatDuration(audioMetadata?.duration)}
                </Text>
              )}
            </FileInfo>
            <ProgressContainer colors={colors} onClick={handleProgressClick}>
              <ProgressBar colors={colors} style={{ width: `${progress}%` }} />
            </ProgressContainer>
          </Flex>
          {audioURL && (
            <ControlButton onClick={handleTogglePlayback} colors={colors}>
              {isPlaying ? (
                <FaRegCirclePause size={25} color={colors?.primary} />
              ) : (
                <IoPlayCircleOutline size={25} color={colors?.primary} />
              )}
            </ControlButton>
          )}
          {audioURL && (
            <ControlButton colors={colors} onClick={handleDeleteAudio}>
              <RiDeleteBin6Line size={20} />
            </ControlButton>
          )}
        </Flex>

        <VolumeControl colors={colors}>
          <FaVolumeUp style={{ color: colors.text }} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
      </AudioPlayer>

      <TranscribeButton
        colors={colors}
        onClick={handleTranscribe}
        disabled={isTranscribing}
      >
        {isTranscribing ? <Loader /> : "Transcribe"}
      </TranscribeButton>

      <div>
        <h4>Transcription Results:</h4>
        <p>{transcriptionResults}</p>
        {textWithGuidList.length > 0
          ? textWithGuidList.map((textWithGuid, idx) => (
              <span key={idx}>
                {getRenderableGrapheme(textWithGuid["graphemeArray"][0])}
              </span>
            ))
          : null}
      </div>
    </Card>
  );
};

export default PlaybackSection;

const getRenderableGrapheme = (grapheme) => {
  if (!grapheme) return null;

  return grapheme?.predicted_words?.map((word) => word.word).join(" ");
};
