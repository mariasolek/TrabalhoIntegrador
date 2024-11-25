import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';



function Menu({controlaClique}) {
    return(
        <div>
            <Box>
                <header>
                    <img src="logo.png" alt="Logo do IMETRO-SC" id="logo"></img>
                    <Button 
                            id='cadastro'
                            variant="link"
                            onClick={(event) => {  controlaClique(event.target.id); }}
                        >
                            Cadastro
                        </Button>
                        <Button
                            id='login'
                            variant="link"
                            onClick={(event) => {  controlaClique(event.target.id); }}
                        >
                            Login
                        </Button>
                </header>
            </Box>
        </div>
    )
}

export default Menu;