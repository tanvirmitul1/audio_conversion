/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styled from "styled-components";
import {
  MdAccountCircle,
  MdGTranslate,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdMenu,
} from "react-icons/md";
import { useState } from "react";
import UserPopover from "../auth/UserPopover";
import { useDispatch, useSelector } from "react-redux";
import { toggleColorMode } from "../../redux/features/colorModeSlice";
import useColors from "../../hooks/useColors";
import { AvatarIcon } from "../../ui/GlobalStyle";

const Navbar = ({ toggleSidebar }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.colorMode.mode);
  const colors = useColors();

  const togglePopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  return (
    <NavbarContainer colors={colors}>
      <LeftContainer>
        <MdMenu
          size={30}
          style={{ cursor: "pointer" }}
          onClick={toggleSidebar}
        />
        <NavbarTitle colors={colors}>
          <MdGTranslate size={20} /> বাংলাস্ক্রাইব
        </NavbarTitle>
      </LeftContainer>
      <RightContainer>
        {mode === "light" ? (
          <MdOutlineDarkMode
            size={30}
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(toggleColorMode())}
          />
        ) : (
          <MdOutlineLightMode
            size={30}
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(toggleColorMode())}
          />
        )}
        <AvatarIcon
          src="https://www.w3schools.com/w3images/avatar2.png"
          alt="User Avatar"
          onClick={togglePopover}
        />
        {popoverVisible && <UserPopover />}
      </RightContainer>
    </NavbarContainer>
  );
};

export default Navbar;

// Styled Components
const NavbarContainer = styled.nav`
  padding: 10px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ colors }) => colors?.sidebarBg};
  box-shadow: 0px 4px 8px ${({ colors }) => colors?.shadow};
  border: 1px solid ${({ colors }) => colors?.border};
`;

const NavbarTitle = styled.h1`
  color: ${({ colors }) => colors?.primary};
  font-size: 18px;
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${({ colors }) => colors?.text};
`;
