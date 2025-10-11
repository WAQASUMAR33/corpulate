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
  Paper,
  Tabs,
  Tab,
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
  StepContent,
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
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
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
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          borderRight: '1px solid #334155',
        },
      },
    },
  },
});

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    name: '',
    phone: '',
    dateOfBirth: '',
    
    // Step 2: Company Type
    companyType: '',
    
    // Step 3: Package Selection
    selectedPackage: '',
    
    // Step 4: State Selection
    selectedState: '',
    
    // Step 5: Shareholder Information
    shareholderNumber: '',
    companyName: '',
    companyTypeDropdown: '',
    documents: {
      companyDocuments: null,
      cnicImage: null,
      passportImage: null,
    }
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

  // Step definitions
  const steps = [
    { label: 'Personal Information', icon: <PersonIcon /> },
    { label: 'Company Type', icon: <BusinessCenterIcon /> },
    { label: 'Plan Selection', icon: <AttachMoneyIcon /> },
    { label: 'State Selection', icon: <LocationCityIcon /> },
    { label: 'Shareholder Details', icon: <GroupIcon /> },
  ];

  // Company types
  const companyTypes = [
    'Limited Liability Company Limited',
    'General Corporation (Corp)',
    'Not Sure which Company to Choose'
  ];

  // States
  const states = [
    'Texas',
    'Florida',
    'Missouri',
    'Ohio',
    'Wyoming'
  ];

  // Packages (mock data)
  const packages = [
    { id: 'basic', name: 'Basic Package', price: '$99', features: ['Basic features', 'Email support'] },
    { id: 'premium', name: 'Premium Package', price: '$199', features: ['All basic features', 'Priority support', 'Advanced tools'] },
    { id: 'enterprise', name: 'Enterprise Package', price: '$399', features: ['All premium features', '24/7 support', 'Custom solutions'] },
  ];

  // Company type dropdown options
  const companyTypeOptions = [
    'Limited Liability Company',
    'L.L.C',
    'LLC'
  ];

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
      companyType: '',
      selectedPackage: '',
      selectedState: '',
      shareholderNumber: '',
      companyName: '',
      companyTypeDropdown: '',
      documents: {
        companyDocuments: null,
        cnicImage: null,
        passportImage: null,
      }
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentUpload = (documentType, file) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: file
      }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Here you would typically send the form data to your API
      console.log('Form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - could redirect or show success message
      alert('Form submitted successfully!');
      handleReset();
    } catch (err) {
      setError('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, active: true },
    { text: 'New Company', icon: <NewCompanyIcon /> },
    { text: 'My Requests', icon: <MyRequestsIcon /> },
    { text: 'Tax Managements', icon: <TaxManagementIcon /> },
    { text: 'My Addresses', icon: <MyAddressesIcon /> },
  ];

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
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
              Corpulate Dashboard
            </Typography>
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>
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
              Create New Company 🏢
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete the following steps to register your company.
            </Typography>
          </Box>

          {/* Multi-Step Form */}
          <Card sx={{ width: '100%', maxWidth: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              {/* Stepper */}
              <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 4 }}>
                {steps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: index <= activeStep 
                              ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' 
                              : '#334155',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                          }}
                        >
                          {index < activeStep ? <CheckCircleIcon /> : step.icon}
                        </Box>
                      )}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {step.label}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Box sx={{ minHeight: 400, pl: 2 }}>
                        {/* Step 1: Personal Information */}
                        {index === 0 && (
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                              Personal Information
                            </Typography>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="Full Name"
                                  value={formData.name}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                  variant="outlined"
                                  sx={{ 
                                    mb: 2,
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
                                    mb: 2,
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
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                  sx={{ 
                                    mb: 2,
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
                        )}

                        {/* Step 2: Company Type */}
                        {index === 1 && (
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                              Select Company Type
                            </Typography>
                            <FormControl component="fieldset" fullWidth>
                              <FormLabel component="legend" sx={{ mb: 2 }}>
                                Choose your company type:
                              </FormLabel>
                              <RadioGroup
                                value={formData.companyType}
                                onChange={(e) => handleInputChange('companyType', e.target.value)}
                              >
                                {companyTypes.map((type) => (
                                  <FormControlLabel
                                    key={type}
                                    value={type}
                                    control={<Radio />}
                                    label={type}
                                    sx={{ mb: 1 }}
                                  />
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </Box>
                        )}

                        {/* Step 3: Package Selection */}
                        {index === 2 && (
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                              Plan Selection
                            </Typography>
                            <Grid container spacing={3}>
                              {packages.map((pkg) => (
                                <Grid item xs={12} md={4} key={pkg.id}>
                                  <Card
                                    sx={{
                                      cursor: 'pointer',
                                      border: formData.selectedPackage === pkg.id 
                                        ? '2px solid #6366f1' 
                                        : '1px solid #334155',
                                      background: formData.selectedPackage === pkg.id 
                                        ? 'rgba(99, 102, 241, 0.1)' 
                                        : 'transparent',
                                    }}
                                    onClick={() => handleInputChange('selectedPackage', pkg.id)}
                                  >
                                    <CardContent>
                                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {pkg.name}
                                      </Typography>
                                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#6366f1' }}>
                                        {pkg.price}
                                      </Typography>
                                      <Box>
                                        {pkg.features.map((feature, featureIndex) => (
                                          <Typography key={featureIndex} variant="body2" sx={{ mb: 0.5 }}>
                                            • {feature}
                                          </Typography>
                                        ))}
                                      </Box>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}

                        {/* Step 4: State Selection */}
                        {index === 3 && (
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                              Select State
                            </Typography>
                            <FormControl fullWidth>
                              <InputLabel sx={{ color: '#cbd5e1' }}>Choose your state</InputLabel>
                              <Select
                                value={formData.selectedState}
                                onChange={(e) => handleInputChange('selectedState', e.target.value)}
                                label="Choose your state"
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
                                }}
                              >
                                {states.map((state) => (
                                  <SelectMenuItem key={state} value={state}>
                                    {state}
                                  </SelectMenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        )}

                        {/* Step 5: Shareholder Details */}
                        {index === 4 && (
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                              Shareholder Details & Documents
                            </Typography>
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Number of Shareholders"
                                  type="number"
                                  value={formData.shareholderNumber}
                                  onChange={(e) => handleInputChange('shareholderNumber', e.target.value)}
                                  variant="outlined"
                                  sx={{ 
                                    mb: 2,
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
                                    mb: 2,
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
                              <Grid item xs={12}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                  <InputLabel sx={{ color: '#cbd5e1' }}>Company Type</InputLabel>
                                  <Select
                                    value={formData.companyTypeDropdown}
                                    onChange={(e) => handleInputChange('companyTypeDropdown', e.target.value)}
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
                                    }}
                                  >
                                    {companyTypeOptions.map((option) => (
                                      <SelectMenuItem key={option} value={option}>
                                        {option}
                                      </SelectMenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                  Upload Documents
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={4}>
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      startIcon={<CloudUploadIcon />}
                                      fullWidth
                                      sx={{
                                        borderRadius: 3,
                                        border: '2px dashed rgba(99, 102, 241, 0.3)',
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        color: '#6366f1',
                                        py: 2,
                                        '&:hover': {
                                          border: '2px dashed #6366f1',
                                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                        },
                                      }}
                                    >
                                      Company Documents
                                      <input
                                        type="file"
                                        hidden
                                        onChange={(e) => handleDocumentUpload('companyDocuments', e.target.files[0])}
                                      />
                                    </Button>
                                    {formData.documents.companyDocuments && (
                                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                        {formData.documents.companyDocuments.name}
                                      </Typography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      startIcon={<CloudUploadIcon />}
                                      fullWidth
                                      sx={{
                                        borderRadius: 3,
                                        border: '2px dashed rgba(99, 102, 241, 0.3)',
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        color: '#6366f1',
                                        py: 2,
                                        '&:hover': {
                                          border: '2px dashed #6366f1',
                                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                        },
                                      }}
                                    >
                                      CNIC Image
                                      <input
                                        type="file"
                                        hidden
                                        onChange={(e) => handleDocumentUpload('cnicImage', e.target.files[0])}
                                      />
                                    </Button>
                                    {formData.documents.cnicImage && (
                                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                        {formData.documents.cnicImage.name}
                                      </Typography>
                                    )}
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      startIcon={<CloudUploadIcon />}
                                      fullWidth
                                      sx={{
                                        borderRadius: 3,
                                        border: '2px dashed rgba(99, 102, 241, 0.3)',
                                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                        color: '#6366f1',
                                        py: 2,
                                        '&:hover': {
                                          border: '2px dashed #6366f1',
                                          backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                        },
                                      }}
                                    >
                                      Passport Image
                                      <input
                                        type="file"
                                        hidden
                                        onChange={(e) => handleDocumentUpload('passportImage', e.target.files[0])}
                                      />
                                    </Button>
                                    {formData.documents.passportImage && (
                                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                                        {formData.documents.passportImage.name}
                                      </Typography>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Box>
                        )}

                        {/* Navigation Buttons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            variant="outlined"
                            sx={{ 
                              mr: 1,
                              borderRadius: 3,
                              px: 4,
                              py: 1.5,
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              color: '#6366f1',
                              '&:hover': {
                                border: '1px solid #6366f1',
                                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                              },
                              '&:disabled': {
                                border: '1px solid #334155',
                                color: '#64748b',
                              },
                            }}
                          >
                            Back
                          </Button>
                          <Box>
                            {activeStep === steps.length - 1 ? (
                              <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : null}
                                sx={{
                                  borderRadius: 3,
                                  px: 4,
                                  py: 1.5,
                                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                                  },
                                  '&:disabled': {
                                    background: '#334155',
                                    color: '#64748b',
                                  },
                                }}
                              >
                                {loading ? 'Submitting...' : 'Submit'}
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
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                                  },
                                }}
                              >
                                Next
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              {/* Error Alert */}
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

