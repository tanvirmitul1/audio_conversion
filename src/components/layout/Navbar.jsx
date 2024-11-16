import styled from "styled-components";
import { MdAccountCircle } from "react-icons/md";
import { useState } from "react";
import UserPopover from "../auth/UserPopover";
import { MdGTranslate } from "react-icons/md";
const Navbar = () => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const togglePopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  return (
    <NavbarContainer>
      <NavbarTitle>
        {" "}
        <MdGTranslate size={30} /> বাংলাস্ক্রাইব
      </NavbarTitle>
      <RightContainer>
        <MdAccountCircle
          onClick={togglePopover}
          size={30}
          style={{ cursor: "pointer" }}
        />
        {popoverVisible && <UserPopover />}
      </RightContainer>
    </NavbarContainer>
  );
};

export default Navbar;

const NavbarContainer = styled.nav`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
`;

const NavbarTitle = styled.h1`
  color: #0e99ff;
  font-size: 26px;
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;
