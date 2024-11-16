import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

export const LayoutContent = styled.div`
  display: flex;
`;

export const MainContent = styled.main`
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  width: calc(100vw - 200px);
`;
