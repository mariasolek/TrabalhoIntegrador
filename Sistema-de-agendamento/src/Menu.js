import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
                      onClick={(event) => {
                        controlaClique(event.target.id);
                      }}
                    >
                      Cadastro
                    </Button>
                  )}
                  <Button
                    id="logout"
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
                    id="login"
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