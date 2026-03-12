import { createTheme } from "@mui/material/styles";

const primary = "#e5ff00"

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: primary,
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

