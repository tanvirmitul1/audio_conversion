/* eslint-disable react/prop-types */
import styled from "styled-components";

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Spinner = styled.div`
  border-radius: 50%;
  display: inline-block;
  animation: spinner-border 0.75s linear infinite;
  border: ${({ border }) => border};
  border-right-color: ${({ borderRightColor }) => borderRightColor};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  margin-right: 10px;
  @keyframes spinner-border {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loader = ({
  title = "Processing...",
  width = "16px",
  height = "16px",
  border = "0.14em solid rgba(0, 0, 0, 0.25)",
  borderRightColor = "transparent",
}) => {
  return (
    <LoaderContainer>
      <Spinner
        role="status"
        width={width}
        height={height}
        border={border}
        borderRightColor={borderRightColor}
      />
      <span>{title}</span>
    </LoaderContainer>
  );
};

export default Loader;
