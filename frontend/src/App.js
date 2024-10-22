import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, Box,
    Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, TextField,
    Switch, Snackbar, Alert, Fab, Dialog, DialogTitle, DialogContent,
    DialogContentText,
    DialogActions, CircularProgress, LinearProgress, Chip, Avatar, Divider
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Info as InfoIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import { FormControl, InputLabel, MenuItem, Select, FormHelperText } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; // Required for date/time pickers

// Form page component
function Form() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [selectedAirline, setSelectedAirline] = useState('');
    const [loading, setLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [timeError, setTimeError] = useState(false); // New state for time error
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // Function to check form validity
    const checkFormValidity = () => {
        // Form is valid if all fields are filled and no time error
        setFormValid(selectedDate && startTime && endTime && selectedAirline && !timeError);
    };

    const handleFindFlights = () => {
        if (formValid) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setSnackbarOpen(true); // Show success snackbar after loading is complete
            }, 2000);
        }
    };

    // Validation check: Ensure that end time is after start time
    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);

        // Validate that start time is before end time
        if (endTime && newValue >= endTime) {
            setTimeError(true);
        } else {
            setTimeError(false);
        }
    };

    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);

        // Validate that end time is after start time
        if (startTime && newValue <= startTime) {
            setTimeError(true);
        } else {
            setTimeError(false);
        }
    };

    // Update form validity on field change
    useEffect(() => {
        checkFormValidity();
    }, [selectedDate, startTime, endTime, selectedAirline, timeError]);

    return (
        <Container component="main" sx={{ mt: 8, mb: 2 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Find Flights
            </Typography>

            {/* Section 1: Date Picker */}
            <Box sx={{ mb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Pick a day"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        minDate={new Date()} // Starts from today
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Box>

            {/* Section 2: Start Time Picker */}
            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Start Time</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            value={startTime}
                            onChange={handleStartTimeChange} // Updated handler
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                    {timeError && (
                        <FormHelperText error>
                            End time must be after start time
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>

            {/* Section 3: End Time Picker */}
            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>End Time</InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            value={endTime}
                            onChange={handleEndTimeChange} // Updated handler
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                    {timeError && (
                        <FormHelperText error>
                            End time must be after start time
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>

            {/* Section 4: Airline Selector */}
            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Choose an Airline</InputLabel>
                    <Select
                        value={selectedAirline}
                        onChange={(e) => setSelectedAirline(e.target.value)}
                    >
                        <MenuItem value="Jetstar">Jetstar</MenuItem>
                        <MenuItem value="Quantas">Quantas</MenuItem>
                        <MenuItem value="Virgin Australia">Virgin Australia</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Find Flights Button */}
            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFindFlights}
                    disabled={!formValid || loading || timeError} // Disable if form is invalid, loading, or if there's a time error
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Find Flights'}
                </Button>
            </Box>

            {/* Snackbar for success message */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    Flights found successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
}

// About page component
function About() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom>
                About Us
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                We are Team BWB, consisted of three members:
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                + Do Quang Anh - 103801086
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                +  Brian Tran - 104023496
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                +  Wilbert Kruskie - 104323659
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom>
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Our topic for the project is Civil Aviation:
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Investigate and analyze the factors influencing flight prices or flight delays. 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                Use machine learning techniques for prediction, attribution, or classification
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                to better understand and manage flight prices and delays.
            </Typography>
        </Container>
    );
}

// Note page component
function Note() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom>
                Note
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                To control the scope of the project, we have set the following limits:
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                + Every flight is from Melbourne to Sydney
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                + Each flight is managed by Jetstar, Quantas or Virgin Australia Airline
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                + The prices listed are of one adult travelling, only the cost for the flight seat 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                is covered with no other costs such as luggage or meal cost and assuming the seat class is Economy.
            </Typography>
        </Container>
    );
}

// PriceFactor page component
function PriceFactor() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom>
                Price Factor
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            The price of flights can be influenced by the following factors: 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Seasonality: Prices tend to be higher during peak travel seasons like holidays and summer vacations due to increased demand.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Oil Prices: Since fuel is a major expense for airlines, fluctuations in oil prices can impact ticket costs.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Demand and Supply: Higher demand for flights can lead to higher prices, while more competition among airlines can drive prices down.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Distance: Longer flights generally cost more than shorter ones.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Time of Booking: Booking flights well in advance or last-minute can affect prices, with last-minute bookings often being more expensive.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Business vs. Leisure Travelers: Business travelers are often willing to pay more for flexibility, which can influence pricing strategies.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Type of Airline: Low-cost carriers usually offer cheaper tickets compared to full-service airlines.
            </Typography>
        </Container>
    );
}

// DelayFactor page component
function DelayFactor() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom>
                Delay Factor
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            The delay of flights can be influenced by the following factors: 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Weather Conditions: Adverse weather such as thunderstorms, snowstorms, and dense fog can create hazardous flying conditions and disrupt schedules.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Air Traffic Congestion: Increased air travel leads to crowded skies and busy airports, which can cause delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Mechanical Issues: Technical problems with the aircraft can lead to delays while repairs are made.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Operational Challenges: Issues like late-arriving aircraft, crew scheduling problems, and airport operations can contribute to delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Security Concerns: Enhanced security measures can sometimes slow down the boarding process.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Runway Incidents: Accidents or incidents on the runway can cause temporary closures and delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
            + Seasonal Variations: Certain times of the year, like holiday seasons, can see increased traffic and potential delays.
            </Typography>
        </Container>
    );
}

function App() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };
    const handleDarkModeToggle = () => {
        setDarkMode(!darkMode);
        setSnackbarOpen(true);
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            handleDialogClose();
            setSnackbarOpen(true);
        }, 2000);
    };
    const drawerContent = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}>
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/form">
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="Form" />
                </ListItem>
                <ListItem button component={Link} to="/about">
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem button component={Link} to="/note">
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Note" />
                </ListItem>
                <ListItem button component={Link} to="/pricefactor">
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Price Factor" />
                </ListItem>
                <ListItem button component={Link} to="/delayfactor">
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Delay Factor" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem>
                    <ListItemText primary="Dark Mode" />
                    <Switch checked={darkMode} onChange={handleDarkModeToggle} />
                </ListItem>
            </List>
        </Box>
    );
    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', minHeight: '100vh',
            bgcolor: darkMode ? 'grey.900' : 'background.default', color: darkMode ?
                'common.white' : 'common.black'
        }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu"
                        onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        BWB Flight Service
                    </Typography>
                    {/* Add About Button in the AppBar */}
                    <Button color="inherit" component={Link} to="/form">Form</Button>
                    <Button color="inherit" component={Link} to="/about">About</Button>
                    <Button color="inherit" component={Link} to="/note">Note</Button>
                    <Button color="inherit" component={Link} to="/pricefactor">Price Factor</Button>
                    <Button color="inherit" component={Link} to="/delayfactor">Delay Factor</Button>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
            <Routes>
                <Route path="/" element={
                    <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>
                        <Typography variant="h2" component="h1" gutterBottom>
                          Introduction
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                        Air travel has become an essential mode of transportation for millions of people globally,
                        yet it is often disrupted by unpredictable delays and fluctuating prices that can
                        significantly impact travellers’ plans and budgets. 
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                        Understanding the causes behind
                        these disruptions is a common challenge faced by passengers, airline operators, and
                        even regulatory bodies.
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                        Our project, BWB Flight Service, is motivated by the need to
                        demystify these complexities by analysing the factors that influence flight prices and
                        delays using machine learning techniques. 
                        </Typography>
                        <Typography variant="h2" component="h1" gutterBottom>
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom>
                        Click on the Form page to find flights.
                        </Typography>
                    </Container>
                } />
                <Route path="/form" element={<Form />} />
                <Route path="/about" element={<About />} />
                <Route path="/note" element={<Note />} />
                <Route path="/pricefactor" element={<PriceFactor />} />
                <Route path="/delayfactor" element={<DelayFactor />} />
            </Routes>
            <Box component="footer" sx={{
                bgcolor: darkMode ? 'grey.800' :
                    'background.paper', py: 6, mt: 'auto'
            }}>
                <Container maxWidth="lg">
                    <Typography variant="body1">
                        BWB Flight Service
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {'Copyright � '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Container>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000}
                onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{
                    width: '100%'
                }}>
                    {darkMode ? 'Dark mode enabled!' : 'Light mode enabled!'}
                </Alert>
            </Snackbar>
        </Box>
    );
}
export default App;
