import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const MainListItems = (props) => (
    <React.Fragment>
        <ListItemButton onClick={() => props.onSelect('generateEmails')}>
            <ListItemIcon>
                <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Generate Emails" />
        </ListItemButton>
        <ListItemButton onClick={() => props.onSelect('calendar')}>
            <ListItemIcon>
                <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Add Events to Calendar" />
        </ListItemButton>
        <ListItemButton onClick={() => props.onSelect('calendarTest')}>
            <ListItemIcon>
                <CalendarMonthIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar Test" />
        </ListItemButton>
        <ListItemButton onClick={() => props.onSelect('itinerary')}>
            <ListItemIcon>
                <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Create an Itinerary for the Day" />
        </ListItemButton>
        <ListItemButton onClick={() => props.onSelect('editDocs')}>
            <ListItemIcon>
                <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Edit Documents" />
        </ListItemButton>
        <ListItemButton onClick={() => props.onSelect('htmlToPdf')}>
            <PictureAsPdfIcon>
                <ListAltIcon />
            </PictureAsPdfIcon>
            <ListItemText primary="HTML to PDF" />
        </ListItemButton>
    </React.Fragment>
);

export default MainListItems;


