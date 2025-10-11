'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AddBusiness as NewCompanyIcon,
  Assignment as MyRequestsIcon,
  AccountBalance as TaxManagementIcon,
  LocationOn as MyAddressesIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  BusinessCenter as BusinessCenterIcon,
  AttachMoney as AttachMoneyIcon,
  LocationCity as LocationCityIcon,
  Group as GroupIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          border: '1px solid #334155',
        },
      },
    },
  },
});

export default function NewRequestPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    country: '',
    companyType: '',
    selectedPackage: '',
    state: '',
    shareholders: '',
    companyName: '',
    companyDocs: null,
    cnicImage: null,
    passportImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isMobile = useMediaQuery(darkTheme.breakpoints.down('md'));

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      name: '',
      phone: '',
      dateOfBirth: '',
      country: '',
      companyType: '',
      selectedPackage: '',
      state: '',
      shareholders: '',
      companyName: '',
      companyDocs: null,
      cnicImage: null,
      passportImage: null,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentUpload = (field, files) => {
    setFormData(prev => ({
      ...prev,
      [field]: files,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle form submission
      console.log('Form submitted:', formData);
      
      // Reset form
      handleReset();
      
      // Show success message or redirect
      alert('Request submitted successfully!');
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Country Selection', icon: <LocationCityIcon /> },
    { label: 'Personal Information', icon: <PersonIcon /> },
    { label: 'Company Type', icon: <BusinessCenterIcon /> },
    { label: 'Package Selection', icon: <AttachMoneyIcon /> },
    { label: 'State Selection', icon: <LocationCityIcon /> },
    { label: 'Shareholder Details', icon: <GroupIcon /> },
  ];

  const companyTypes = [
    'Limited Liability Company',
    'General Corporation (Corp)',
    'Not Sure which Company to Choose',
  ];

  const countries = ['United Kingdom', 'United States', 'U.A.E'];
  const states = ['Texas', 'Florida', 'Missouri', 'Ohio', 'Wyoming'];

  const packages = [
    {
      id: 1,
      name: 'Basic',
      price: 299,
      description: 'Essential features for small businesses',
      features: ['Basic registration', 'Email support', 'Standard processing'],
    },
    {
      id: 2,
      name: 'Premium',
      price: 599,
      description: 'Advanced features for growing businesses',
      features: ['Premium registration', 'Priority support', 'Fast processing', 'Document review'],
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 999,
      description: 'Complete solution for large enterprises',
      features: ['Enterprise registration', '24/7 support', 'Express processing', 'Full document review', 'Legal consultation'],
    },
  ];

  const companyTypeOptions = [
    {
      value: 'LLC',
      label: 'Limited Liability Company',
      description: 'Most popular choice for small to medium businesses',
    },
    {
      value: 'CORP',
      label: 'General Corporation (Corp)',
      description: 'Ideal for larger businesses and public companies',
    },
    {
      value: 'NOT_SURE',
      label: 'Not Sure which Company to Choose',
      description: 'We&apos;ll help you choose the best option',
    },
  ];

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, active: false, path: '/dashboard' },
    { text: 'New Company', icon: <NewCompanyIcon />, active: true, path: '/new-request' },
    { text: 'My Requests', icon: <MyRequestsIcon />, active: false, path: '/my-requests' },
    { text: 'Tax Managements', icon: <TaxManagementIcon />, active: false, path: '/tax-management' },
    { text: 'My Addresses', icon: <MyAddressesIcon />, active: false, path: '/my-addresses' },
  ];

  if (!user) {
    return (
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            border: '3px solid #334155',
            borderTop: '3px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Box>
    );
  }

  const drawer = (
    <Box>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 60,
            height: 60,
            mx: 'auto',
            mb: 2,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            fontSize: '1.5rem',
            fontWeight: 600,
          }}
        >
          {user.firstName?.[0]}{user.lastName?.[0]}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
        <Chip
          label="Premium User"
          size="small"
          sx={{
            mt: 1,
            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
            color: 'white',
            fontWeight: 500,
          }}
        />
      </Box>
      <Divider sx={{ borderColor: '#334155' }} />
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                backgroundColor: item.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: item.active ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                '&:hover': {
                  backgroundColor: 'rgba(99, 102, 241, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: item.active ? '#6366f1' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: item.active ? 600 : 400,
                    color: item.active ? '#6366f1' : 'text.primary',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* Logout Button */}
        <ListItem disablePadding sx={{ mb: 0.5, mt: 2 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              backgroundColor: 'transparent',
              border: '1px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ef4444' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 400,
                  color: '#ef4444',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            borderBottom: '1px solid #334155',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              Corpulate - New Request
            </Typography>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  fontSize: '0.875rem',
                }}
              >
                {user.firstName?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              PaperProps={{
                sx: {
                  background: '#1e293b',
                  border: '1px solid #334155',
                },
              }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <PersonIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <SettingsIcon sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <Divider sx={{ borderColor: '#334155' }} />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          <Toolbar />
          
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              New Request 📋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Submit a new company registration request.
            </Typography>
          </Box>

          {/* Main Content Row */}
          <Box sx={{ 
            display: 'flex', 
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' }
          }}>
            {/* Left Side - Stepper */}
            <Card sx={{ 
              width: { xs: '100%', md: '30%' }, 
              maxWidth: { xs: 'none', md: 400 }, 
              height: 'fit-content',
              order: { xs: 2, md: 1 }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                  Progress Steps
                </Typography>
                <Stepper 
                  activeStep={activeStep} 
                  orientation="vertical"
                  sx={{
                    '& .MuiStepLabel-root': {
                      padding: '8px 0',
                    }
                  }}
                >
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: index <= activeStep ? '#6366f1' : '#334155',
                              color: 'white',
                              fontSize: '1.2rem',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>

            {/* Right Side - Form Content */}
            <Card sx={{ 
              flex: 1,
              order: { xs: 1, md: 2 }
            }}>
              <CardContent sx={{ p: 4 }}>
              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {/* Step Content */}
              <Box sx={{ minHeight: 400 }}>
                {/* Step 1: Country Selection */}
                {activeStep === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Country Selection
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                      Please select the country where you want to register your business. This will determine the applicable regulations and requirements.
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {countries.map((country) => (
                        <Grid item xs={12} md={4} key={country}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              border: formData.country === country ? '2px solid #6366f1' : '1px solid rgba(99, 102, 241, 0.2)',
                              backgroundColor: formData.country === country ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                border: '2px solid #6366f1',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                              },
                            }}
                            onClick={() => handleInputChange('country', country)}
                          >
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                              <Box sx={{ mb: 2 }}>
                                <Box
                                  sx={{
                                    width: 80,
                                    height: 60,
                                    borderRadius: 2,
                                    mx: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '48px',
                                    fontWeight: 'bold',
                                    border: '3px solid rgba(99, 102, 241, 0.3)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      transform: 'scale(1.05)',
                                      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.2)',
                                    },
                                  }}
                                >
                                  {country === 'United Kingdom' && (
                                    <Box sx={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🇬🇧</Box>
                                  )}
                                  {country === 'United States' && (
                                    <Box sx={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🇺🇸</Box>
                                  )}
                                  {country === 'U.A.E' && (
                                    <Box sx={{ fontSize: '48px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🇦🇪</Box>
                                  )}
                                </Box>
                              </Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {country}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {country === 'United Kingdom' && 'London-based registration'}
                                {country === 'United States' && 'US state registration'}
                                {country === 'U.A.E' && 'Dubai-based registration'}
                              </Typography>
                              {formData.country === country && (
                                <Box sx={{ mt: 2 }}>
                                  <Chip
                                    label="Selected"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#6366f1',
                                      color: 'white',
                                      fontWeight: 500,
                                    }}
                                  />
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Step 2: Personal Information */}
                {activeStep === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Personal Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              backgroundColor: 'rgba(99, 102, 241, 0.05)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              '&:hover': {
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                              },
                              '&.Mui-focused': {
                                border: '2px solid #6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#cbd5e1',
                              '&.Mui-focused': {
                                color: '#6366f1',
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          variant="outlined"
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              backgroundColor: 'rgba(99, 102, 241, 0.05)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              '&:hover': {
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                              },
                              '&.Mui-focused': {
                                border: '2px solid #6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#cbd5e1',
                              '&.Mui-focused': {
                                color: '#6366f1',
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 3,
                              backgroundColor: 'rgba(99, 102, 241, 0.05)',
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              '&:hover': {
                                border: '1px solid rgba(99, 102, 241, 0.4)',
                              },
                              '&.Mui-focused': {
                                border: '2px solid #6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              color: '#cbd5e1',
                              '&.Mui-focused': {
                                color: '#6366f1',
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {/* Empty grid for spacing */}
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Step 3: Company Type */}
                {activeStep === 2 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Company Type
                    </Typography>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ color: '#cbd5e1', mb: 2 }}>
                        Select your company type
                      </FormLabel>
                      <RadioGroup
                        value={formData.companyType}
                        onChange={(e) => handleInputChange('companyType', e.target.value)}
                        sx={{ gap: 2 }}
                      >
                        {companyTypeOptions.map((option) => (
                          <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={
                              <Radio
                                sx={{
                                  color: '#6366f1',
                                  '&.Mui-checked': {
                                    color: '#6366f1',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {option.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Box>
                            }
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              border: '1px solid rgba(99, 102, 241, 0.2)',
                              backgroundColor: 'rgba(99, 102, 241, 0.05)',
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Box>
                )}

                {/* Step 4: Package Selection */}
                {activeStep === 3 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Package Selection
                    </Typography>
                    <Grid container spacing={3}>
                      {packages.map((pkg) => (
                        <Grid item xs={12} md={4} key={pkg.id}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              border: formData.selectedPackage === pkg.id ? '2px solid #6366f1' : '1px solid rgba(99, 102, 241, 0.2)',
                              backgroundColor: formData.selectedPackage === pkg.id ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                border: '2px solid #6366f1',
                              },
                            }}
                            onClick={() => handleInputChange('selectedPackage', pkg.id)}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AttachMoneyIcon sx={{ color: '#6366f1', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                  {pkg.name}
                                </Typography>
                              </Box>
                              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#6366f1' }}>
                                ${pkg.price}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {pkg.description}
                              </Typography>
                              <Box sx={{ mb: 2 }}>
                                {pkg.features.map((feature, index) => (
                                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <CheckCircleIcon sx={{ color: '#10b981', mr: 1, fontSize: '1rem' }} />
                                    <Typography variant="body2">{feature}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Step 5: State Selection */}
                {activeStep === 4 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      State Selection
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                      Choose the state where you want to register your business. Each state has different regulations and requirements.
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {states.map((state) => (
                        <Grid item xs={12} sm={6} md={4} key={state}>
                          <Card
                            sx={{
                              cursor: 'pointer',
                              border: formData.state === state ? '2px solid #6366f1' : '1px solid rgba(99, 102, 241, 0.2)',
                              backgroundColor: formData.state === state ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                border: '2px solid #6366f1',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)',
                              },
                            }}
                            onClick={() => handleInputChange('state', state)}
                          >
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {state}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {state === 'Texas' && 'Business-friendly regulations'}
                                {state === 'Florida' && 'No state income tax'}
                                {state === 'Missouri' && 'Central location advantage'}
                                {state === 'Ohio' && 'Manufacturing hub'}
                                {state === 'Wyoming' && 'Tax advantages'}
                              </Typography>
                              {formData.state === state && (
                                <Box sx={{ mt: 2 }}>
                                  <Chip
                                    label="Selected"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#6366f1',
                                      color: 'white',
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {/* Step 6: Shareholder Details & Documents */}
                {activeStep === 5 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 4 }}>
                      Shareholder Details & Documents
                    </Typography>
                    
                    {/* Shareholder Information Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: '#6366f1' }}>
                        Shareholder Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Number of Shareholders"
                            type="number"
                            value={formData.shareholders}
                            onChange={(e) => handleInputChange('shareholders', e.target.value)}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                '&:hover': {
                                  border: '1px solid rgba(99, 102, 241, 0.4)',
                                },
                                '&.Mui-focused': {
                                  border: '2px solid #6366f1',
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#cbd5e1',
                                '&.Mui-focused': {
                                  color: '#6366f1',
                                },
                              },
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Company Name"
                            value={formData.companyName}
                            onChange={(e) => handleInputChange('companyName', e.target.value)}
                            variant="outlined"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                '&:hover': {
                                  border: '1px solid rgba(99, 102, 241, 0.4)',
                                },
                                '&.Mui-focused': {
                                  border: '2px solid #6366f1',
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                },
                              },
                              '& .MuiInputLabel-root': {
                                color: '#cbd5e1',
                                '&.Mui-focused': {
                                  color: '#6366f1',
                                },
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Company Type Section */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: '#6366f1' }}>
                        Company Type Selection
                      </Typography>
                      <FormControl fullWidth variant="outlined">
                        <InputLabel sx={{ color: '#cbd5e1' }}>Company Type</InputLabel>
                        <Select
                          value={formData.companyType}
                          onChange={(e) => handleInputChange('companyType', e.target.value)}
                          label="Company Type"
                          sx={{
                            borderRadius: 3,
                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                            border: '1px solid rgba(99, 102, 241, 0.2)',
                            '&:hover': {
                              border: '1px solid rgba(99, 102, 241, 0.4)',
                            },
                            '&.Mui-focused': {
                              border: '2px solid #6366f1',
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              border: 'none',
                            },
                            '& .MuiSelect-select': {
                              padding: '14px',
                            },
                          }}
                        >
                          <SelectMenuItem value="LLC">Limited Liability Company</SelectMenuItem>
                          <SelectMenuItem value="LLC_ALT">L.L.C</SelectMenuItem>
                          <SelectMenuItem value="LLC_FULL">LLC</SelectMenuItem>
                        </Select>
                      </FormControl>
                    </Box>

                    {/* Document Upload Section */}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3, color: '#6366f1' }}>
                        Document Uploads
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ 
                            p: 3, 
                            border: '2px dashed rgba(99, 102, 241, 0.3)', 
                            borderRadius: 3,
                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              border: '2px dashed #6366f1',
                            }
                          }}>
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#6366f1', mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Company Documents
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Upload business documents
                            </Typography>
                            <Button
                              variant="outlined"
                              component="label"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                border: '1px solid #6366f1',
                                color: '#6366f1',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                },
                              }}
                            >
                              Choose Files
                              <input
                                type="file"
                                hidden
                                multiple
                                onChange={(e) => handleDocumentUpload('companyDocs', e.target.files)}
                              />
                            </Button>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ 
                            p: 3, 
                            border: '2px dashed rgba(99, 102, 241, 0.3)', 
                            borderRadius: 3,
                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              border: '2px dashed #6366f1',
                            }
                          }}>
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#6366f1', mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              CNIC Image
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Upload CNIC/ID document
                            </Typography>
                            <Button
                              variant="outlined"
                              component="label"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                border: '1px solid #6366f1',
                                color: '#6366f1',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                },
                              }}
                            >
                              Choose File
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleDocumentUpload('cnicImage', e.target.files)}
                              />
                            </Button>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Box sx={{ 
                            p: 3, 
                            border: '2px dashed rgba(99, 102, 241, 0.3)', 
                            borderRadius: 3,
                            backgroundColor: 'rgba(99, 102, 241, 0.05)',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              border: '2px dashed #6366f1',
                            }
                          }}>
                            <CloudUploadIcon sx={{ fontSize: 40, color: '#6366f1', mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                              Passport Image
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Upload passport document
                            </Typography>
                            <Button
                              variant="outlined"
                              component="label"
                              size="small"
                              sx={{
                                borderRadius: 2,
                                border: '1px solid #6366f1',
                                color: '#6366f1',
                                '&:hover': {
                                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                },
                              }}
                            >
                              Choose File
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleDocumentUpload('passportImage', e.target.files)}
                              />
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      border: '2px solid rgba(99, 102, 241, 0.3)',
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                      color: '#6366f1',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                        border: '2px solid #6366f1',
                      },
                    }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5b5bd6 0%, #d946ef 100%)',
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Request'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5b5bd6 0%, #d946ef 100%)',
                        },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}