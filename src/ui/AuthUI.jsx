// ui/login/LoginUI.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Background = styled.div`
  background: #ffffff;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AuthContainer = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: ${({ width }) => (width ? width : "800px")};
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.5s ease-out;
  height: ${({ height }) => (height ? height : "auto")};
  justify-content: center;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 20px);

  border: 1px solid #e1e1e1;

  &:hover {
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(-20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media (max-width: 768px) {
    height: 100vh;
    padding: 20px;
    box-shadow: none;
    max-height: 100vh;
    gap: 5px;
  }
`;

export const Title = styled.p`
  text-align: ${({ align }) => (align ? align : "center")};
  color: ${({ color }) => (color ? color : "#333")};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "24px")};
  font-weight: 600;
`;

export const InputWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;

  /* Mobile view: Change to column layout */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px; /* Adjust the gap for mobile if needed */
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 45px 10px 30px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s ease-in-out;
  margin-top: 5px;

  &:focus {
    border-color: #7bb9ff;
    box-shadow: 0 0 8px 2px rgba(74, 144, 226, 0.3),
      0 0 15px 5px rgba(74, 144, 226, 0.2);
  }

  &::placeholder {
    color: #aaa;
  }
`;

export const EyeButton = styled.button`
  position: absolute;
  bottom: 30px;
  right: 20px;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 20px;
  transition: color 0.3s;
  z-index: 999;

  &:hover {
    color: #6e7f80;
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 13px;
  height: 10px;

  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  opacity: ${({ show }) => (show ? "1" : "0")};
  transition: opacity 0.3s ease;
  margin-bottom: 5px;
`;
export const AuthLink = styled(Link)`
  text-align: center;
  font-size: 14px;
  color: #6e7f80;
  text-decoration: none;

  font-weight: 500;

  &:hover {
    color: #4d5a54;
  }
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  animation: fadeIn 0.5s ease-out;
`;
