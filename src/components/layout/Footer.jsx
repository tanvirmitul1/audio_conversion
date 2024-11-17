import styled from "styled-components";

import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; // Example social media icons
import useColors from "../../hooks/useColors"; // Assuming this is where your useColors hook is located

const Footer = () => {
  const colors = useColors(); // Fetch colors based on the current mode

  return (
    <FooterContainer colors={colors}>
      <SocialIcons>
        <Icon href="https://github.com" target="_blank">
          <FaGithub size={20} />
        </Icon>
        <Icon href="https://linkedin.com" target="_blank">
          <FaLinkedin size={20} />
        </Icon>
        <Icon href="https://twitter.com" target="_blank">
          <FaTwitter size={20} />
        </Icon>
      </SocialIcons>
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
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 10px;
`;

const Icon = styled.a`
  color: ${({ colors }) => colors?.text};
  &:hover {
    color: ${({ colors }) => colors?.primary};
  }
`;
