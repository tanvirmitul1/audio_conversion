/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../../ui/GlobalStyle";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { toggleColorMode } from "../../redux/features/colorModeSlice";
import { RxAvatar } from "react-icons/rx";
import { PiSignOutBold } from "react-icons/pi";
import { logout } from "../../redux/features/authSlice";
import { IoMdSettings } from "react-icons/io";
import useColors from "../../hooks/useColors"; // Adjust path as necessary

const UserPopover = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.colorMode.mode);
  const colors = useColors();

  return (
    <PopoverContainer colors={colors}>
      <UserInfo>
        <AvatarIcon
          src="https://avatars.githubusercontent.com/u/155339584?v=4"
          alt="User Avatar"
        />
        <UserName colors={colors}>Tanvir Mitul</UserName>
      </UserInfo>
      <OptionButton colors={colors}>
        <RxAvatar size={25} />
        My Profile
      </OptionButton>
      <OptionButton colors={colors}>
        <Link to="/settings">
          {" "}
          <Flex>
            {" "}
            <IoMdSettings size={25} /> <span>Account Settings</span>
          </Flex>
        </Link>
      </OptionButton>
      <Flex justifyContent="space-between" alignItems="center">
        <OptionButton colors={colors} onClick={() => dispatch(logout())}>
          <PiSignOutBold size={25} />
          <span>Logout</span>
        </OptionButton>
        <OptionButton colors={colors}>
          {mode === "light" ? (
            <Flex onClick={() => dispatch(toggleColorMode())}>
              <MdOutlineDarkMode size={25} /> <span>Light Mode</span>
            </Flex>
          ) : (
            <Flex onClick={() => dispatch(toggleColorMode())}>
              <MdOutlineLightMode size={25} /> <span>Dark Mode</span>
            </Flex>
          )}
        </OptionButton>
      </Flex>
    </PopoverContainer>
  );
};

export default UserPopover;

const PopoverContainer = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
  border-radius: 8px;
  width: 300px;
  box-shadow: 0px 10px 20px ${({ colors }) => colors?.shadow};
  padding: 15px;
  z-index: 10;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border: 1px solid ${({ colors }) => colors?.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`;

const AvatarIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${({ colors }) => colors?.text};
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 8px;
  margin: 5px 0;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border 0.3s ease;
  color: ${({ colors }) => colors?.text};
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background-color: ${({ colors }) => colors?.sidebarBg};
    color: ${({ colors }) => colors?.primary};
    border-color: ${({ colors }) => colors?.primary};
  }
`;
