import styled from "styled-components";

export const SidebarContainer = styled.aside`
  position: absolute;
  top: 0;
  left: ${({ visible }) => (visible ? "0" : "-200px")};
  height: 100vh;
  width: ${({ width }) => width};
  transition: left 0.3s ease;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

export const SidebarItem = styled.a`
  display: block;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 4px;
  color: #333;
  text-align: center;
  &:hover {
    background-color: #ddd;
  }
`;
