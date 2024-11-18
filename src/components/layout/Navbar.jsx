/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import styled from "styled-components";
import { MdGTranslate, MdMenu } from "react-icons/md";
import { useState } from "react";
import UserPopover from "../auth/UserPopover";
import useColors from "../../hooks/useColors";
import { AvatarIcon } from "../../ui/GlobalStyle";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Navbar = ({ toggleSidebar }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);
  const colors = useColors();

  const togglePopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  return (
    <NavbarContainer colors={colors}>
      <LeftContainer>
        <IoIosArrowDroprightCircle
          color={colors?.primary}
          size={18}
          style={{ cursor: "pointer" }}
          onClick={toggleSidebar}
        />

        <NavbarTitle colors={colors}>
          <MdGTranslate size={15} /> বাংলাস্ক্রাইব
        </NavbarTitle>
      </LeftContainer>
      <RightContainer>
        <AvatarIcon
          src="https://avatars.githubusercontent.com/u/155339584?v=4"
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
  background-color: ${({ colors }) => colors?.background};
  box-shadow: 0px 4px 8px ${({ colors }) => colors?.shadow};
  border: 1px solid ${({ colors }) => colors?.border};
`;

const NavbarTitle = styled.h1`
  color: ${({ colors }) => colors?.primary};
  font-size: 14px;
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
