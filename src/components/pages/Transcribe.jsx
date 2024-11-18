/* eslint-disable react/no-unescaped-entities */
import { useState, useRef } from "react";
import styled from "styled-components";
import RecordingSection from "../transcribe/RecordingSection";
import UploadSection from "../transcribe/UploadSection";
import PlaybackSection from "../transcribe/PlaybackSection";

import useColors from "../../hooks/useColors";
import { useSelector } from "react-redux";
import WaveIcon from "../../assets/wave.png";
const Transcribe = () => {
  const { user } = useSelector((state) => state.auth);

  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [audioMetadata, setAudioMetadata] = useState({ name: "", duration: 0 });

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef(null);

  const colors = useColors();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Reset and start the recording timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop the recording timer
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;

      // Save the recording as a Blob and generate metadata
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url); // Set the audio URL

        const fileName = `Recording-${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", "_")}.mp3`;
        setAudioMetadata({ name: fileName, duration: 0 }); // Set recording name and initialize duration

        audioChunksRef.current = [];
      };
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0]; // Access the first file
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setAudioMetadata({ name: file.name, duration: 0 }); // Set file name
    }
  };
  const handleAudioMetadataLoad = () => {
    const audio = audioRef.current;
    if (audio && !isNaN(audio.duration) && audio.duration !== Infinity) {
      setAudioMetadata((prev) => ({
        ...prev,
        duration: audio.duration, // Set audio duration in seconds
      }));
    } else {
      // Fallback: wait until metadata is fully loaded
      audio.addEventListener("durationchange", () => {
        if (!isNaN(audio.duration) && audio.duration !== Infinity) {
          setAudioMetadata((prev) => ({
            ...prev,
            duration: audio.duration,
          }));
        }
      });
    }
  };

  console.log({ audioURL });

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const progressBar = e.target.getBoundingClientRect();
    const clickPosition = e.clientX - progressBar.left;
    const clickPercentage = clickPosition / progressBar.width;
    if (audio) {
      audio.currentTime = clickPercentage * audio.duration;
      setProgress(clickPercentage * 100);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <Container colors={colors}>
      <Header colors={colors}>
        <h1>
          Hello {user?.first_name} <img src={WaveIcon} alt="wave" width={30} />
        </h1>
        <p>Let's transcribe something today! </p>
      </Header>
      <RecordContainer>
        <RecordingSection
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          recordingTime={formatTime(recordingTime)}
        />
        <UploadSection handleFileUpload={handleFileUpload} />
      </RecordContainer>

      <PlaybackSection
        audioRef={audioRef}
        audioURL={audioURL}
        isPlaying={isPlaying}
        togglePlayback={togglePlayback}
        progress={progress}
        handleProgressClick={handleProgressClick}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        handleTimeUpdate={handleTimeUpdate}
        audioMetadata={audioMetadata}
        handleAudioMetadataLoad={handleAudioMetadataLoad}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const RecordContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 60%;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
  @media (min-width: 1400px) {
    width: 50%;
  }
`;

const Header = styled.header`
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
  }
  p {
    font-size: 16px;
    color: ${({ colors }) => colors?.secondaryText};
  }
`;

export default Transcribe;
