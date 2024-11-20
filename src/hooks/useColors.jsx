import { useSelector } from "react-redux";

const useColors = () => {
  const mode = useSelector((state) => state.colorMode?.mode);

  const colors = {
    light: {
      background: "#ffffff",
      text: "#000000",
      primary: "#0e99ff",
      border: "#ddd",
      shadow: "rgba(0, 0, 0, 0.1)",
      sidebarBg: "#F9F9F9",
      secondaryText: "#6c757d",
      danger: "#dc3545",
      light: "#F1F8FE",
      buttonColor: "#ffffff",
      success: "#28a745",
    },
    dark: {
      background: "#13111C",
      text: "#faf8f8",
      primary: "#a55cff",
      border: "#333",
      shadow: "rgba(255, 255, 255, 0.1)",
      sidebarBg: "#13111C",
      secondaryText: "#a6a6a6",
      danger: "#dc3545",
      light: "#060107",
      buttonColor: "#13111C",
      success: "#28a745",
    },
  };

  return colors[mode] || colors.light; // Fallback to light mode colors if mode is undefined
};

export default useColors;
