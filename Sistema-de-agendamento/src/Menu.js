import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HowToRegIcon from '@mui/icons-material/HowToReg';

function Menu({ isLoggedIn, controlaClique, cargo }) {
  console.log("Valor do cargo: ", cargo);
  return (
    <div>
      <Box>
        <header>
          <Grid container>
            <Grid>
              <div>
                <img src="logo.png" alt="Logo do IMETRO-SC" id="logo"></img>
              </div>
            </Grid>

            <Grid>
              <br />
              {isLoggedIn ? (
                <Grid>
                  {cargo === "1" && ( //ta controlando pelo cod de cargo agr
                    <Button
                      id="Cadastro"
                      variant="link"
                      startIcon={<HowToRegIcon color="primary" />}
                      onClick={(event) => {
                        controlaClique(event.target.id);
                      }}
                    >
                      Cadastro
                    </Button>
                  )}
                  <Button
                    id="Logout"
                    variant="link"
                    startIcon={<LogoutIcon color="primary" />}
                    onClick={(event) => {
                      controlaClique(event.target.id);
                    }}
                  >
                    Logout
                  </Button>
                  <Button
                    id="Sol-aceitas"
                    variant="link"
                    startIcon={<VisibilityIcon color="primary" />}
                    onClick={(event) => {
                      controlaClique(event.target.id);
                    }}
                  >
                    Ver solicitações aceitas
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
    </div>
  );
}

export default Menu;