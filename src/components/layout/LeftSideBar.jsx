import { SidebarContainer, SidebarItem } from "../../ui/layout/LeftSidebarUI";

const LeftSidebar = () => {
  return (
    <SidebarContainer>
      <SidebarItem href="/">Dashboard</SidebarItem>
      <SidebarItem href="/admin">Admin</SidebarItem>
    </SidebarContainer>
  );
};

export default LeftSidebar;
