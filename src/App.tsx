import {
  Refine,
} from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { RefineSnackbarProvider, useNotificationProvider } from '@refinedev/mui';

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Box, Typography } from "@mui/material";
import routerProvider, { DocumentTitleHandler, UnsavedChangesNotifier } from "@refinedev/react-router";
import { BrowserRouter, Route, Routes } from "react-router";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { dataProvider } from "./providers/data";
import { CustomSidebar } from "./components/layout/Sidebar";
import { TIUPage } from "./pages/banksoal/tiu";
import { TWKPage } from "./pages/banksoal/twk";

const Screen = ({ title }: { title: string }) => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" fontWeight={700} mb={1}>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Halaman {title}
    </Typography>
  </Box>
);

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine dataProvider={dataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "baB6Zh-ZCiWV0-aWjATw",
                }}>

                <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
                  <CustomSidebar />
                  <Box sx={{ flex: 1 }}>
                    <Routes>
                      <Route index element={<Screen title="Dashboard" />} />
                      <Route path="/banksoal" element={<Screen title="Bank Soal" />} />
                      <Route path="/banksoal/tkp" element={<Screen title="TKP" />} />
                      <Route path="/banksoal/tiu" element={<TIUPage />} />
                      <Route path="/banksoal/twk" element={<TWKPage />} />
                      <Route path="/member-management" element={<Screen title="Member Management" />} />
                    </Routes>
                  </Box>
                </Box>
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </RefineSnackbarProvider>

        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
};

export default App;
