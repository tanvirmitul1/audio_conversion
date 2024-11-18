/* eslint-disable react/prop-types */

import Footer from "./Footer";
import styled from "styled-components";
import { useState, useEffect } from "react";
import LeftSideBar from "./LeftSideBar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  // Determine the initial visibility of the sidebar based on screen width
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth >= 768 // Sidebar is visible on larger screens (>=768px)
  );

  const sidebarWidth = "200px"; // Define the sidebar width

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  // Handle window resize to update sidebar visibility dynamically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarVisible) {
        setIsSidebarVisible(false); // Hide sidebar on smaller screens
      } else if (window.innerWidth >= 768 && !isSidebarVisible) {
        setIsSidebarVisible(true); // Show sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarVisible]);

  return (
    <LayoutWrapper>
      <NavbarWrapper>
        <Navbar toggleSidebar={toggleSidebar} />
      </NavbarWrapper>
      <LayoutContent>
        <LeftSideBar
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
  overflow-y: auto;
  width: ${({ sidebarVisible, sidebarWidth }) =>
    sidebarVisible ? `calc(100vw - ${sidebarWidth})` : "100vw"};
  transition: margin-left 0.3s ease, width 0.3s ease;
  margin-left: ${({ sidebarVisible, sidebarWidth }) =>
    sidebarVisible ? sidebarWidth : "0"};
`;
