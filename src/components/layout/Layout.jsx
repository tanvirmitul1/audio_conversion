/* eslint-disable react/prop-types */
import Navbar from "./Navbar";
import Footer from "./Footer";
import styled from "styled-components";
import { useState } from "react";
import LeftSidebar from "./LeftSidebar";

const Layout = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const sidebarWidth = "200px"; // Define the sidebar width

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  return (
    <LayoutWrapper>
      <NavbarWrapper>
        <Navbar toggleSidebar={toggleSidebar} />
      </NavbarWrapper>
      <LayoutContent>
        <LeftSidebar
          visible={isSidebarVisible}
          width={sidebarWidth}
          toggleSidebar={toggleSidebar}
        />
        <MainContent
          sidebarVisible={isSidebarVisible}
          sidebarWidth={sidebarWidth}
        >
          {children}
        </MainContent>
      </LayoutContent>
      <Footer />
    </LayoutWrapper>
  );
};

export default Layout;

// Styled Components
const LayoutWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const NavbarWrapper = styled.div``;

const LayoutContent = styled.div`
  display: flex;
  flex: 1;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: auto;
  width: ${({ sidebarVisible, sidebarWidth }) =>
    sidebarVisible ? `calc(100vw - ${sidebarWidth})` : "100vw"};
  transition: margin-left 0.3s ease, width 0.3s ease;
  margin-left: ${({ sidebarVisible, sidebarWidth }) =>
    sidebarVisible ? sidebarWidth : "0"};
`;
