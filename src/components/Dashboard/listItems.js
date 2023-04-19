import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <EmailIcon />
      </ListItemIcon>
      <ListItemText primary="Generate Emails" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <CalendarMonthIcon />
      </ListItemIcon>
      <ListItemText primary="Add Events to Calendar" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ListAltIcon />
      </ListItemIcon>
      <ListItemText primary="Create an Itinerary for the Day" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
      <ListItemText primary="Edit Documents" />
    </ListItemButton>
  </React.Fragment>
);
