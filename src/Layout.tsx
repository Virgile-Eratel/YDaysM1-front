import React from 'react';
import {AppBar, Toolbar, Typography, Container, IconButton, Menu, MenuItem} from '@mui/material';
import {Outlet, useNavigate} from 'react-router-dom';
import {AccountCircle} from "@mui/icons-material";

const Layout: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAnchorEl(null);
        navigate("/login");
    }
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" className={'cursor-pointer'} onClick={() => navigate("/home")}>
                        OutWork
                    </Typography>
                    <div className={'flex-1'}/>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
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
                        <MenuItem onClick={handleLogout}>déconnexion</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Container style={{marginTop: '1rem'}}>
                <Outlet/>
            </Container>
        </>
    );
};

export default Layout;