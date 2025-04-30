import React from 'react';
import {AppBar, Toolbar, Container, IconButton, Menu, MenuItem, Button, Divider} from '@mui/material';
import {Outlet, useNavigate} from 'react-router-dom';
import {AccountCircle, Add} from "@mui/icons-material";
import { ThemeProvider } from '@mui/material/styles';
import { useUserTheme } from './hooks/useUserTheme';

const Layout: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const emailUser = localStorage.getItem('emailUser');
    const theme = useUserTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('roleUser');
        localStorage.removeItem('emailUser');
        localStorage.removeItem('userId');
        setAnchorEl(null);
        navigate("/login");
    }
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const roleUser= (localStorage.getItem('roleUser'));

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Toolbar>
                    <img
                        src={roleUser === 'owner' ? "/images/outwork_logo_orange.png" : "/images/logo.png"}
                        alt="OutWork Logo"
                        className="cursor-pointer"
                        onClick={() => navigate("/home")}
                        style={{height: 40, width: 'auto', objectFit: 'contain'}}
                    />
                    <div className={'flex-1'}/>
                    {
                        roleUser === 'owner' && (
                            <>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    startIcon={<Add />}
                                    onClick={() => navigate("/create-place-home")}
                                    sx={{
                                        mr: 2,
                                        display: { xs: 'none', sm: 'none', md: 'flex' }
                                    }}
                                >
                                    Ajouter mon espace sur outwork
                                </Button>

                                <IconButton
                                    color="primary"
                                    onClick={() => navigate("/create-place-home")}
                                    sx={{
                                        mr: 1,
                                        display: { xs: 'flex', sm: 'flex', md: 'none' },
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                        }
                                    }}
                                >
                                    <Add />
                                </IconButton>
                            </>
                        )
                    }
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle color={'primary'}/>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        { emailUser &&
                            <MenuItem>{`Connecté en tant que ${emailUser}`}</MenuItem>
                        }
                        <MenuItem onClick={() => { handleClose(); navigate('/reservations'); }}>Mes réservations</MenuItem>

                        {localStorage.getItem('roleUser') === 'owner' && (
                            <MenuItem onClick={() => { handleClose(); navigate('/owner/reservations'); }}>Gestion des réservations</MenuItem>
                        )}

                        <Divider />
                        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Container style={{marginTop: '1rem'}} className={'text-black'}>
                <Outlet/>
            </Container>
        </ThemeProvider>
    );
};

export default Layout;