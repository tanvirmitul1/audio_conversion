import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  /* Custom Scrollbar Styling */
  ::-webkit-scrollbar {
    width: 8px; /* Thin scrollbar */
  }

  ::-webkit-scrollbar-track {
    background-color: #f1f1f1; /* Light track color */
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888; /* Grey color for the thumb */
    border-radius: 10px;
    transition: background-color 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Darker grey when hovered */
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`;

export default GlobalStyle;

export const Flex = styled.div`
  position: relative;
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || "center"};
  align-items: ${({ alignItems }) => alignItems || "center"};
  flex-direction: ${({ direction }) => direction || "row"};
  flex-wrap: ${({ wrap }) => wrap || "nowrap"};
  gap: ${({ gap }) => gap || "10px"};
  padding: ${({ padding }) => padding || "0"};
  margin: ${({ margin }) => margin || "0"};
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "auto"};
  background-color: ${({ backgroundColor }) =>
    backgroundColor || "transparent"};
  border: ${({ border }) => border || "none"};
  border-radius: ${({ borderRadius }) => borderRadius || "0"};
`;
