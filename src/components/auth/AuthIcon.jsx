/* eslint-disable react/prop-types */
import styled from "styled-components";
import illustration from "../../assets/Illustration.png"; // Adjust the path if needed

const AuthIcon = ({ width = "70%", height = "70%" }) => {
  return (
    <StyledAuthIcon>
      <img
        src={illustration}
        alt="Illustration"
        height={height}
        width={width}
      />
    </StyledAuthIcon>
  );
};

export default AuthIcon;

const StyledAuthIcon = styled.div`
  display: block;
  opacity: 0;
  transform: translateX(-30px);
  animation: fadeInAndSlide 0.8s ease-out forwards;

  @media (max-width: 768px) {
    display: none;
  }

  @keyframes fadeInAndSlide {
    0% {
      opacity: 0;
      transform: translateX(-30px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  img {
    border-radius: 12px;

    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  img:hover {
    transform: scale(1.05);
  }
`;
