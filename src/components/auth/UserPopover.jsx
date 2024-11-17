import { useDispatch } from "react-redux";
import styled from "styled-components";
import { logout } from "../../redux/features/authSlice";
import useColors from "../../hooks/useColors"; // Make sure to import your useColors hook
import { AvatarIcon } from "../../ui/GlobalStyle";

const UserPopover = () => {
  const dispatch = useDispatch();
  const colors = useColors(); // Get the dynamic colors based on the current mode

  return (
    <PopoverContainer $colors={colors}>
      <UserInfo>
        <AvatarIcon
          src="https://www.w3schools.com/w3images/avatar2.png"
          alt="User Avatar"
        />
        <UserName $colors={colors}>John Doe</UserName>
      </UserInfo>
      <OptionButton $colors={colors}>My Profile</OptionButton>
      <OptionButton $colors={colors}>Settings</OptionButton>
      <OptionButton $colors={colors} onClick={() => dispatch(logout())}>
        Logout
      </OptionButton>
    </PopoverContainer>
  );
};

export default UserPopover;

const PopoverContainer = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  background-color: ${({ $colors }) => $colors.background};
  color: ${({ $colors }) => $colors.text};
  border-radius: 8px;
  width: 250px;
  box-shadow: 0px 10px 20px ${({ $colors }) => $colors.shadow};
  padding: 15px;
  z-index: 10;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border: 1px solid ${({ $colors }) => $colors.border};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 18px;
  color: ${({ $colors }) => $colors.text};
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 12px 15px;
  background: transparent;
  border: 1px solid ${({ $colors }) => $colors.border};
  border-radius: 8px;
  margin: 5px 0;
  text-align: left;
  font-size: 14px;
  color: ${({ $colors }) => $colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background-color: ${({ $colors }) => $colors.primary};
    color: ${({ $colors }) => $colors.background};
    border-color: ${({ $colors }) => $colors.primary};
  }

  &:active {
    transform: scale(0.98);
  }
`;
