import { Link } from "react-router-dom";
import styled from "styled-components";

const UserPopover = () => {
  return (
    <PopoverContainer>
      <UserInfo>
        <AvatarIcon
          src="https://www.w3schools.com/w3images/avatar2.png"
          alt="User Avatar"
        />
        <UserName>John Doe</UserName>
      </UserInfo>
      <OptionButton>My Profile</OptionButton>
      <OptionButton>Settings</OptionButton>
      <OptionButton>
        <Link to="/login">Logout</Link>
      </OptionButton>
    </PopoverContainer>
  );
};

export default UserPopover;

const PopoverContainer = styled.div`
  position: absolute;
  top: 55px;
  right: 20px;
  background-color: #ffffff;
  color: #333;
  border-radius: 8px;
  width: 250px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  padding: 15px;
  z-index: 10;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border: 1px solid #e1e1e1;
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
  color: #110d0d;
`;

const OptionButton = styled.button`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 5px 0;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border 0.3s ease;
  color: #555;

  &:hover {
    background-color: #f0f0f0;
    color: #333;
    border-color: #b8b8b8;
  }
`;
