/* eslint-disable react/prop-types */
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: ${({ colors }) => colors?.background};
   
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

export const Flex = ({
  justifyContent,
  alignItems,
  direction,
  wrap,
  gap,
  padding,
  margin,
  width,
  height,
  backgroundColor,
  border,
  borderRadius,
  ...rest
}) => {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: justifyContent || "center",
        alignItems: alignItems || "center",
        flexDirection: direction || "row",
        flexWrap: wrap || "nowrap",
        gap: gap || "10px",
        padding: padding || "0",
        margin: margin || "0",
        width: width || "100%",
        height: height || "auto",
        backgroundColor: backgroundColor || "transparent",
        border: border || "none",
        borderRadius: borderRadius || "0",
      }}
      {...rest} // Pass remaining props to the DOM
    >
      {/* Child components */}
    </div>
  );
};

export const AvatarIcon = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
`;

export const Text = styled.p`
  font-size: ${({ fontSize }) => fontSize || "14px"};
  color: ${({ color }) => color || "#333"};
`;
