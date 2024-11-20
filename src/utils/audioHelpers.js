export const chunkAudio = async (audioElement, chunkDuration = 0.5) => {
  if (!audioElement || !audioElement.src) {
    throw new Error("Audio element is not loaded or invalid.");
  }

  const audioContext = new AudioContext();
  const audioBuffer = await fetch(audioElement.src)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer));

  const sampleRate = audioContext.sampleRate;
  const chunkSize = Math.floor(chunkDuration * sampleRate);
  const { numberOfChannels, length } = audioBuffer;
  const totalChunks = Math.ceil(length / chunkSize);
  const chunks = [];

  for (let i = 0; i < totalChunks; i++) {
    const startSample = i * chunkSize;
    const endSample = Math.min(startSample + chunkSize, length);

    const chunkBuffer = audioContext.createBuffer(
      numberOfChannels,
      endSample - startSample,
      sampleRate
    );

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      chunkBuffer.copyToChannel(
        channelData.subarray(startSample, endSample),
        channel
      );
    }

    const chunkWavBlob = await encodeChunkToWav(chunkBuffer);
    const chunkBase64 = await blobToBase64(chunkWavBlob);

    chunks.push({
      index: i,
      audio: chunkBase64,
      endOfStream: i === totalChunks - 1,
    });
  }

  return chunks;
};

const encodeChunkToWav = async (audioBuffer) => {
  const wavHeader = new Uint8Array(44); // Simplified WAV header
  const audioData = new Float32Array(audioBuffer.getChannelData(0));
  const wavBlob = new Blob([wavHeader, audioData], { type: "audio/wav" });
  return wavBlob;
};

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
