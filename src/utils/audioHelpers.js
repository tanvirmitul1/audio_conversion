export const chunkAudio = async (audioElement, chunkDuration) => {
  const audioContext = new AudioContext();
  const audioBuffer = await fetch(audioElement.src)
    .then((response) => response.arrayBuffer())
    .then((buffer) => audioContext.decodeAudioData(buffer));

  const chunks = [];
  const chunkSize = Math.floor(chunkDuration * audioBuffer.sampleRate); // Number of samples per chunk
  for (let start = 0; start < audioBuffer.length; start += chunkSize) {
    const end = Math.min(start + chunkSize, audioBuffer.length);
    const chunk = audioBuffer.getChannelData(0).slice(start, end); // Get chunk from the buffer
    chunks.push(chunk);
  }

  return chunks;
};
