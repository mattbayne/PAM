import React from 'react';
import { Typography, Box, List, ListItem, ListItemText, Container, Paper } from '@mui/material';
import styled from '@emotion/styled';

const AnimatedTitle = styled(Typography)`
  background-image: linear-gradient(45deg, #f06, #f80, #f06);
  -webkit-background-clip: text;
  color: transparent;
  animation: gradient 5s ease infinite;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;



const CustomListItemText = styled(ListItemText)`
  position: relative;
  padding-left: 1.5em;

  &:before {
    content: '•';
    display: inline-block;
    position: absolute;
    left: 0;
    color: #000;
  }
`;


const Home = () => {
    return (
        <Container maxWidth="md">
            <Box my={4}>

                    <AnimatedTitle variant="h4" component="h1" gutterBottom>
                        Welcome to PAM - Personalized Assistant & Manager
                    </AnimatedTitle>

                    <Typography paragraph>
                        PAM is designed to simplify your life by handling administrative tasks for you. With PAM, you can:
                    </Typography>
                <List>
                    <ListItem>
                        <CustomListItemText primary="Generate emails tailored to your needs" />
                    </ListItem>
                    <ListItem>
                        <CustomListItemText primary="View your calendar events for the week" />
                    </ListItem>
                    <ListItem>
                        <CustomListItemText primary="Create itineraries based on your calendar events" />
                    </ListItem>
                    <ListItem>
                        <CustomListItemText primary="Add new events to your calendar" />
                    </ListItem>
                    <ListItem>
                        <CustomListItemText primary="Proofread text and receive suggestions for improvements" />
                    </ListItem>
                    <ListItem>
                        <CustomListItemText primary="Generate PDFs from various sources" />
                    </ListItem>
                </List>

                <Typography paragraph>
                        To get started, choose a feature from the sidebar and let PAM make your life easier!
                    </Typography>
            </Box>
        </Container>
    );
};

export default Home;
