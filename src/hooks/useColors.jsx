import { useSelector } from "react-redux";

const useColors = () => {
  const mode = useSelector((state) => state.colorMode?.mode);

  console.log("Current mode:", mode);

  const colors = {
    light: {
      background: "#ffffff",
      text: "#000000",
      primary: "#0e99ff",
      border: "#ddd",
      shadow: "rgba(0, 0, 0, 0.1)",
      sidebarBg: "#F9F9F9",
    },
    dark: {
      background: "#121212",
      text: "#ffffff",
      primary: "#a55cff",
      border: "#333",
      shadow: "rgba(255, 255, 255, 0.1)",
      sidebarBg: "#0E1420",
    },
  };

  console.log("Colors object:", colors[mode]);

  return colors[mode] || colors.light; // Fallback to light mode colors if mode is undefined
};

export default useColors;
