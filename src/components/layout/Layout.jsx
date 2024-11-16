/* eslint-disable react/prop-types */
import Navbar from "./Navbar";

import LeftSidebar from "./LeftSidebar";

import Footer from "./Footer";
import styled from "styled-components";

const Layout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Navbar />
      <LayoutContent>
        <LeftSidebar />
        <MainContent>{children}</MainContent>
      </LayoutContent>
      <Footer />
    </LayoutWrapper>
  );
};

export default Layout;

export const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Defining overall layout height here */
`;

export const LayoutContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden; /* Ensuring content doesn't overflow */
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto; /* Main content should scroll if needed */
  width: calc(100vw - 200px);
`;
