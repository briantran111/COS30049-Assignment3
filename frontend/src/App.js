import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
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
import { FormControl, InputLabel, MenuItem, Select, FormHelperText, useMediaQuery } from '@mui/material';
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
    const [timeError, setTimeError] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const checkFormValidity = () => {
        setFormValid(selectedDate && startTime && endTime && selectedAirline && !timeError);
    };

    const handleFindFlights = async () => {
        if (formValid) {
            setLoading(true);
            try {
                const combinedStartDate = new Date(selectedDate);
                combinedStartDate.setHours(startTime.getHours(), startTime.getMinutes());

                const combinedEndDate = new Date(selectedDate);
                combinedEndDate.setHours(endTime.getHours(), endTime.getMinutes());

                const startTimeUTC = combinedStartDate.toISOString();
                const endTimeUTC = combinedEndDate.toISOString();

                const response = await fetch('http://localhost:8000/api/findFlights', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        selectedDate: selectedDate.toISOString(),
                        startTime: startTimeUTC,
                        endTime: endTimeUTC,
                        selectedAirline,
                    }),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log("Flights found:", data);
                    setSnackbarOpen(true);
                } else {
                    console.error("Error finding flights:", data);
                }
            } catch (error) {
                console.error("Error in request:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStartTimeChange = (newValue) => {
        setStartTime(newValue);
        if (endTime && newValue >= endTime) {
            setTimeError(true);
        } else {
            setTimeError(false);
        }
    };

    const handleEndTimeChange = (newValue) => {
        setEndTime(newValue);
        if (startTime && newValue <= startTime) {
            setTimeError(true);
        } else {
            setTimeError(false);
        }
    };

    useEffect(() => {
        checkFormValidity();
    }, [selectedDate, startTime, endTime, selectedAirline, timeError]);

    return (
        <Container component="main" sx={{ mt: 8, mb: 2, bgcolor: (theme) => theme.palette.background.default, color: (theme) => theme.palette.text.primary, borderRadius: 1, p: 3 }}>
            <Typography variant="h2" component="h1" sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3rem' } }}>
                Find Flights
            </Typography>

            <Box sx={{ mb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Pick a day"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(newValue)}
                        minDate={new Date()}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Box>

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    InputProps={{ shrink: true }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                            label="End Time"
                            value={endTime}
                            onChange={handleEndTimeChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    InputProps={{ shrink: true }}
                                />
                            )}
                        />
                    </LocalizationProvider>
                    {timeError && (
                        <FormHelperText error>
                            End time must be after start time
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
                <FormControl fullWidth>
                    <TextField
                        select
                        label="Choose an Airline"
                        value={selectedAirline}
                        onChange={(e) => setSelectedAirline(e.target.value)}
                        variant="outlined"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="Jetstar">Jetstar</MenuItem>
                        <MenuItem value="Quantas">Quantas</MenuItem>
                        <MenuItem value="Virgin Australia">Virgin Australia</MenuItem>
                    </TextField>
                </FormControl>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFindFlights}
                    disabled={!formValid || loading || timeError}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Find Flights'}
                </Button>
            </Box>

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
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                About Us
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                We are Team BWB, consisted of three members:
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                + Do Quang Anh - 103801086
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                + Brian Tran - 104023496
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                + Wilbert Kruskie - 104323659
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                Our topic for the project is Civil Aviation:
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                Investigate and analyze the factors influencing flight prices or flight delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                Use machine learning techniques for prediction, attribution, or classification
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                to better understand and manage flight prices and delays.
            </Typography>
        </Container>
    );
}

// Note page component
function Note() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Note
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                To control the scope of the project, we have set the following limits:
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                + Every flight is from Melbourne to Sydney
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                + Each flight is managed by Jetstar, Quantas or Virgin Australia Airline
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                + The prices listed are of one adult travelling, only the cost for the flight seat 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                is covered with no other costs such as luggage or meal cost and assuming the seat class is Economy.
            </Typography>
        </Container>
    );
}

// PriceFactor page component
function PriceFactor() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Price Factor
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            The price of flights can be influenced by the following factors: 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Seasonality: Prices tend to be higher during peak travel seasons like holidays and summer vacations due to increased demand.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Oil Prices: Since fuel is a major expense for airlines, fluctuations in oil prices can impact ticket costs.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Demand and Supply: Higher demand for flights can lead to higher prices, while more competition among airlines can drive prices down.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Distance: Longer flights generally cost more than shorter ones.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Time of Booking: Booking flights well in advance or last-minute can affect prices, with last-minute bookings often being more expensive.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Business vs. Leisure Travelers: Business travelers are often willing to pay more for flexibility, which can influence pricing strategies.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Type of Airline: Low-cost carriers usually offer cheaper tickets compared to full-service airlines.
            </Typography>
        </Container>
    );
}

// DelayFactor page component
function DelayFactor() {
    return (
        <Container>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
            </Typography>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                Delay Factor
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            The delay of flights can be influenced by the following factors: 
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Weather Conditions: Adverse weather such as thunderstorms, snowstorms, and dense fog can create hazardous flying conditions and disrupt schedules.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Air Traffic Congestion: Increased air travel leads to crowded skies and busy airports, which can cause delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Mechanical Issues: Technical problems with the aircraft can lead to delays while repairs are made.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Operational Challenges: Issues like late-arriving aircraft, crew scheduling problems, and airport operations can contribute to delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Security Concerns: Enhanced security measures can sometimes slow down the boarding process.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
            + Runway Incidents: Accidents or incidents on the runway can cause temporary closures and delays.
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
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
    const location = useLocation(); // Get current location
    const isLargeScreen = useMediaQuery('(min-width:600px)'); // Check if screen is large enough

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
    const getActiveStyle = (path) => ({
        color: location.pathname === path ? 'secondary.main' : 'inherit',
        fontWeight: location.pathname === path ? 'bold' : 'normal',
    });
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
                <ListItem button component={Link} to="/" sx={getActiveStyle('/')}>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button component={Link} to="/form" sx={getActiveStyle('/form')}>
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    <ListItemText primary="Form" />
                </ListItem>
                <ListItem button component={Link} to="/about" sx={getActiveStyle('/about')}>
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem button component={Link} to="/note" sx={getActiveStyle('/note')}>
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Note" />
                </ListItem>
                <ListItem button component={Link} to="/pricefactor" sx={getActiveStyle('/pricefactor')}>
                    <ListItemIcon><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Price Factor" />
                </ListItem>
                <ListItem button component={Link} to="/delayfactor" sx={getActiveStyle('/delayfactor')}>
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
                    {isLargeScreen && (
                        <>
                            <Button color="inherit" component={Link} to="/form" sx={getActiveStyle('/form')}>Form</Button>
                            <Button color="inherit" component={Link} to="/about" sx={getActiveStyle('/about')}>About</Button>
                            <Button color="inherit" component={Link} to="/note" sx={getActiveStyle('/note')}>Note</Button>
                            <Button color="inherit" component={Link} to="/pricefactor" sx={getActiveStyle('/pricefactor')}>Price Factor</Button>
                            <Button color="inherit" component={Link} to="/delayfactor" sx={getActiveStyle('/delayfactor')}>Delay Factor</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
            <Routes>
                <Route path="/" element={
                    <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
                          Introduction
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                        Air travel has become an essential mode of transportation for millions of people globally,
                        yet it is often disrupted by unpredictable delays and fluctuating prices that can
                        significantly impact travellers’ plans and budgets. 
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                        Understanding the causes behind
                        these disruptions is a common challenge faced by passengers, airline operators, and
                        even regulatory bodies.
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                        Our project, BWB Flight Service, is motivated by the need to
                        demystify these complexities by analysing the factors that influence flight prices and
                        delays using machine learning techniques. 
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
                        </Typography>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' } }}>
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
