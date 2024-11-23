export const getRenderableGrapheme = (grapheme) => {
  if (!grapheme) return null;
  console.log({ grapheme });
  return grapheme?.predicted_words?.map((word) => word.word).join(" ");
};
