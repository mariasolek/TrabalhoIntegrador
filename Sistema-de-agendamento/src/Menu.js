import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Menu({isLoggedIn, controlaClique}) {
    return(
        <div>
            <Box>
                <header>
                    <Grid container>
                        <Grid size={10}>
                            <img src="logo.png" alt="Logo do IMETRO-SC" id="logo"></img>
                        </Grid>

                        <Grid size={2}>
                                <br/>
                                {isLoggedIn ? (
                                    <Grid>
                                        <Grid>
                                        <Button
                                            id='Cadastro'
                                            variant="link"
                                            onClick={(event) => {   controlaClique(event.target.id); }}
                                        >
                                        Cadastro
                                        </Button>
                                        </Grid>
                                        <Button
                                            id='Logout'
                                            variant="link"
                                            onClick={(event) => {   controlaClique(event.target.id); }}
                                        >
                                            Logout
                                        </Button>
                                    </Grid>
                                ):(
                                    <Grid>
                                        <Grid>
                                        <Button
                                            id='login'
                                            variant="link"
                                            size="large"
                                            startIcon ={<AccountCircleIcon color='primary'/>}
                                            onClick={(event) => {  controlaClique(event.target.id); }} 
                                        >
                                            Login
                                        </Button>
                                        </Grid>
                                    </Grid>
                                )}

                        </Grid>
                    </Grid>
                </header>
            </Box>
        </div>
    )
}

export default Menu;