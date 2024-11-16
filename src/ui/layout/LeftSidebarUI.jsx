import styled from "styled-components";

export const SidebarContainer = styled.aside`
  width: 200px;
  background-color: #f4f4f4;
  padding: 10px;
  height: calc(100vh - 120px);
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
