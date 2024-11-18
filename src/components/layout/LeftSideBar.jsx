/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { MdGTranslate } from "react-icons/md";
import useColors from "../../hooks/useColors";
import { LiaArrowsAltHSolid } from "react-icons/lia";
import { IoMdSettings } from "react-icons/io";
import { FaClipboardList } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";

const LeftSideBar = ({ visible, width, toggleSidebar }) => {
  const colors = useColors();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <SidebarContainer visible={visible} width={width} colors={colors}>
      <Header>
        <MdGTranslate size={20} color={colors?.primary} />
        <SidebarTitle>বাংলাস্ক্রাইব</SidebarTitle>
        <ToggleButton onClick={toggleSidebar}>
          {visible && <LiaArrowsAltHSolid size={20} color={colors?.border} />}
        </ToggleButton>
      </Header>
      <Nav>
        <SidebarItem>
          <StyledLink
            to="/"
            colors={colors}
            className={isActive("/") ? "active" : ""}
          >
            <FaMicrophone /> Transcribe
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink
            to="/admin"
            colors={colors}
            className={isActive("/admin") ? "active" : ""}
          >
            <FaClipboardList /> Documents
          </StyledLink>
        </SidebarItem>
        <SidebarItem>
          <StyledLink
            to="/settings"
            colors={colors}
            className={isActive("/settings") ? "active" : ""}
          >
            <IoMdSettings /> Settings
          </StyledLink>
        </SidebarItem>
      </Nav>
    </SidebarContainer>
  );
};

export default LeftSideBar;

// Styled Components
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: ${({ visible, width }) => (visible ? "0" : `-${width}`)};
  height: calc(100vh - 30px);
  width: ${({ width }) => width || "200px"};
  background-color: ${({ colors }) => colors?.sidebarBg};
  border-right: 1px solid ${({ colors }) => colors?.border};
  color: ${({ colors }) => colors?.text};
  transition: left 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
`;

const SidebarTitle = styled.h1`
  font-size: 14px;
  color: ${({ colors }) => colors?.primary};
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 10px;
  right: -10px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ colors }) => colors?.border};
  background-color: ${({ colors }) => colors?.sidebarBg};
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SidebarItem = styled.div`
  margin: 5px 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ colors }) => colors?.text};
  font-size: 14px;
  padding: 8px 15px;
  border-radius: 5px;
  display: block;

  &:hover {
    color: ${({ colors }) => colors?.primary};
    background-color: ${({ colors }) => colors?.hoverBackground};
  }

  &.active {
    background-color: ${({ colors }) => colors?.primary};
    color: ${({ colors }) => colors?.background};
    font-weight: bold;
    box-shadow: 0px 2px 4px ${({ colors }) => colors?.shadow};
  }
`;
