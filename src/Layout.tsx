import React from 'react';
import {AppBar, Toolbar, Container, IconButton, Menu, MenuItem, Button, Divider} from '@mui/material';
import {Outlet, useNavigate} from 'react-router-dom';
import {AccountCircle, Add} from "@mui/icons-material";

const Layout: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();
    const emailUser= (localStorage.getItem('emailUser'));

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
        <>
            <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none' }}>
                <Toolbar>
                    <img
                        src="/images/logo.png"
                        alt="OutWork Logo"
                        className="cursor-pointer"
                        onClick={() => navigate("/home")}
                        style={{height: 40, width: 'auto'}}
                    />
                    <div className={'flex-1'}/>
                    {
                        roleUser === 'owner' &&
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => navigate("/create-place")}
                            sx={{ mr: 2 }}
                        >
                            Ajouter mon espace sur outwork
                        </Button>
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
        </>
    );
};

export default Layout;