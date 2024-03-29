import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {ChevronRight} from "@mui/icons-material";
import MainListItems from "./listItems";
import GenerateEmails from "../Features/GenerateEmails";
import Calendar from "../Features/Calendar";
import Itinerary from "../Features/Itinerary";
import EditDocs from "../Features/EditDocs";
import ConvertHtmlToPdf from "../wkhtmltopdf";
import Tooltip from "@mui/material/Tooltip";
import Home from "./Home";
import DashboardContext from "./DashboardContext";
import {useContext, useEffect} from "react";


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: 'auto',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      height: '100vh',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent() {
  const [open, setOpen] = React.useState(true);
  const { selectedFunctionality, setSelectedFunctionality} = useContext(DashboardContext);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    console.log(selectedFunctionality);
  }, [selectedFunctionality])

  const handleFunctionalitySelect = (functionality) => {
    setSelectedFunctionality(functionality);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <Tooltip title="Expand/Collapse">
              <IconButton onClick={toggleDrawer}>
                {open ? <ChevronLeftIcon /> : <ChevronRight />}
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Divider />
          <List component="nav">
            <MainListItems onSelect={handleFunctionalitySelect} />
            {/*<Divider sx={{ my: 1 }} />*/}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {selectedFunctionality === 'home' && <Home/>}
          {selectedFunctionality === 'generateEmails' && <GenerateEmails />}
          {selectedFunctionality === 'calendar' && <Calendar />}
          {selectedFunctionality === 'itinerary' && <Itinerary />}
          {selectedFunctionality === 'editDocs' && <EditDocs />}
          {selectedFunctionality === 'htmlToPdf' && <ConvertHtmlToPdf />}
          {/* Add other functionalities here */}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
