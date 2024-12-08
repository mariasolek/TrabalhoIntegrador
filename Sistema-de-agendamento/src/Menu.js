import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Menu({ isLoggedIn, controlaClique, cargo }) {
    return (
      <Box>
        <header>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <img src="logo.png" alt="Logo do IMETRO-SC" id="logo" />
            </Grid>
            <Grid item>
              {isLoggedIn ? (
                <Grid container spacing={2} alignItems="center">
                  {/* Renderiza o botão Cadastro apenas se o cargo for Administrador */}
                  {cargo === "Administrador" && (
                    <Button
                      id="Cadastro" // Ajustado para corresponder à lógica de `controlaInterface`
                      variant="contained"
                      onClick={(event) => controlaClique(event.target.id)}
                    >
                      Cadastro
                    </Button>
                  )}
                  <Button
                    id="Logout"
                    variant="link"
                    startIcon={<LogoutIcon color="danger" />}
                    onClick={(event) => {
                      controlaClique(event.target.id);
                    }}
                  >
                    Logout
                  </Button>
                </Grid>
              ) : (
                <Grid>
                  <Button
                    id="Login"
                    variant="link"
                    size="large"
                    startIcon={<AccountCircleIcon color="primary" />}
                    onClick={(event) => {
                      controlaClique(event.target.id);
                    }}
                  >
                    Login
                  </Button>
                </Grid>
              )}
            </Grid>
          </Grid>
        </header>
      </Box>
    );
  }
  

export default Menu;
