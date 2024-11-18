import styled from "styled-components";

import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; // Example social media icons
import useColors from "../../hooks/useColors"; // Assuming this is where your useColors hook is located

const Footer = () => {
  const colors = useColors(); // Fetch colors based on the current mode

  return (
    <FooterContainer colors={colors}>
      <Icon href="https://github.com" target="_blank">
        <FaGithub size={15} />
      </Icon>
      <Icon href="https://linkedin.com" target="_blank">
        <FaLinkedin size={15} />
      </Icon>
      <Icon href="https://twitter.com" target="_blank">
        <FaTwitter size={15} />
      </Icon>
      <span>© 2024 Tanvir Mitul</span>
    </FooterContainer>
  );
};

export default Footer;

// Styled Components
const FooterContainer = styled.footer`
  background-color: ${({ colors }) => colors?.sidebarBg};
  color: ${({ colors }) => colors?.text};
  text-align: center;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid ${({ colors }) => colors?.border};
  font-size: 10px;
`;

const Icon = styled.a`
  color: ${({ colors }) => colors?.text};
  &:hover {
    color: ${({ colors }) => colors?.primary};
  }
`;
