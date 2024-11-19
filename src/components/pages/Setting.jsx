/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import styled from "styled-components";
import useColors from "../../hooks/useColors";
import RegistrationModal from "../auth/RegistrationModal";
import UsersList from "../auth/UsersList";
import { useState } from "react";
import { FaUserPlus } from "react-icons/fa"; // Icon for Add User button

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = useColors();

  // Function to handle opening the RegistrationModal
  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <Container colors={colors}>
      <AddButton colors={colors} onClick={handleOpenModal}>
        <FaUserPlus color="white" size={24} />
        <span>Add User</span>
      </AddButton>
      <Content>
        <RegistrationModal
          isOpen={isOpen}
          onRequestClose={() => setIsOpen(false)}
        />
        <UsersList colors={colors} />
      </Content>
    </Container>
  );
};

export default Setting;

// Styled Components
const Container = styled.div`
  padding: 20px;
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
`;

const Content = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${({ colors }) => colors?.primary};
  color: ${({ colors }) => colors?.text};
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 20px;

  span {
    margin-left: 10px;
    color: white;
  }

  &:hover {
    background-color: ${({ colors }) => colors?.hover};
  }
`;
