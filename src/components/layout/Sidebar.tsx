import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useGo, useLogout } from "@refinedev/core";
import { useContext, useState } from "react";
import { useLocation } from "react-router";
import { ColorModeContext } from "../../contexts/color-mode";
const drawerWidth = 280;

export const CustomSidebar = () => {
  const go = useGo();
  const location = useLocation();
  const { mode, toggleColorMode } = useContext(ColorModeContext);
  const { mutate: logout } = useLogout();
  const [bankSoalOpen, setBankSoalOpen] = useState(
    location.pathname.startsWith("/banksoal")
  );

  const bankSoalSubmenu = [
    { label: "TWK", path: "/banksoal/twk" },
    { label: "TIU", path: "/banksoal/tiu" },
    { label: "TKP", path: "/banksoal/tkp" },
  ];

  const menuItems = [
    {
      label: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      onClick: () => go({ to: "/" }),
      path: "/",
    },
    {
      label: "Bank Soal",
      icon: <PeopleOutlinedIcon />,
      onClick: () => go({ to: "/banksoal" }),
      path: "/banksoal",
    },
    {
      label: "Member Management",
      icon: <ManageAccountsOutlinedIcon />,
      onClick: () => go({ to: "/member-management" }),
      path: "/member-management",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: mode === "dark" ? "#1e1e1e" : "#f5f5f5",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <HomeOutlinedIcon sx={{ fontSize: 32, color: "primary.main" }} />
        <Typography fontWeight="bold">
          CPNS Bank Soal
        </Typography>
      </Box>

      {/* Theme Toggle */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            borderRadius: 3,
            p: 0.5,
            position: "relative",
            cursor: "pointer",
          }}
          onClick={toggleColorMode}
        >
          <Box
            sx={{
              position: "absolute",
              width: "50%",
              height: "calc(100% - 8px)",
              bgcolor: "primary.main",
              borderRadius: 2.5,
              transition: "transform 0.3s ease",
              transform: mode === "dark" ? "translateX(0)" : "translateX(100%)",
              left: 4,
            }}
          />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              py: 1,
              zIndex: 1,
              color: mode === "dark" ? "white" : "text.secondary",
              transition: "color 0.3s ease",
            }}
          >
            <DarkModeOutlined sx={{ fontSize: 18 }} />
            <Typography variant="caption" fontWeight={600}>
              Dark
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              py: 1,
              zIndex: 1,
              color: mode === "light" ? "white" : "text.secondary",
              transition: "color 0.3s ease",
            }}
          >
            <LightModeOutlined sx={{ fontSize: 18 }} />
            <Typography variant="caption" fontWeight={600}>
              Light
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item, index) => (
          <Box key={index}>
            <ListItemButton
              onClick={() => {
                if (item.path === "/banksoal") {
                  setBankSoalOpen((prev) => !prev);
                  item.onClick();
                  return;
                }
                item.onClick();
              }}
              selected={
                item.path === "/banksoal"
                  ? location.pathname.startsWith("/banksoal")
                  : item.path
                    ? location.pathname === item.path
                    : false
              }
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                },
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              />
              {item.path === "/banksoal" ? bankSoalOpen ? <ExpandLessIcon /> : <ExpandMoreIcon /> : null}
            </ListItemButton>

            {item.path === "/banksoal" ? (
              <Collapse in={bankSoalOpen} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {bankSoalSubmenu.map((subItem) => (
                    <ListItemButton
                      key={subItem.path}
                      onClick={() => go({ to: subItem.path })}
                      selected={location.pathname === subItem.path}
                      sx={{
                        pl: 7,
                        pr: 2,
                        py: 0.8,
                        mx: 1,
                        mb: 0.4,
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
                        },
                        "&.Mui-selected": {
                          bgcolor: "primary.main",
                          "&:hover": {
                            bgcolor: "primary.dark",
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary={subItem.label}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            ) : null}
          </Box>
        ))}
      </List>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          color="error"
          endIcon={<LogoutOutlinedIcon />}
          onClick={() => logout()}
          sx={{
            justifyContent: "flex-end",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};