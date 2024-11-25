// Helper function to convert milliseconds to MM:SS format
const formatTimestamp = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export const getRenderableGrapheme = (grapheme) => {
  if (
    !grapheme ||
    !grapheme.predicted_words ||
    grapheme.predicted_words.length === 0
  ) {
    return null;
  }

  // Filter out words that are only whitespace and join the rest
  const words = grapheme.predicted_words
    .filter((wordObj) => wordObj.word.trim() !== "") // Remove whitespace words
    .map((wordObj) => wordObj.word)
    .join(" ");

  // Extract the timestamp[0] for the first word and timestamp[1] for the last word
  const firstTimestamp = grapheme.predicted_words[0]?.timestamp[0];
  const lastTimestamp =
    grapheme.predicted_words[grapheme.predicted_words.length - 1]?.timestamp[1];

  // Convert timestamps to MM:SS format
  const formattedStart = formatTimestamp(firstTimestamp);
  const formattedEnd = formatTimestamp(lastTimestamp);

  // Return as a single formatted string
  return `${words} (${formattedStart}, ${formattedEnd})`;
};
