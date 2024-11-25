import React from 'react';
import Container from '@mui/material/Container';

function Login() {
    return(
        <div>
 
        <Container fixed>
            <legend>
                <h1>Login</h1>
            </legend>
            <fieldset>
                <form action='' method='get'>
                    <label for="senha">Senha</label><br/>
                    <input type="password" id="senha" placeholder="Digite a senha" className='caixatexto'></input><br/>

                    <label for="cod">Código do funcionário</label><br/>
                    <input type="text" id="cod" placeholder="Digite o código" className='caixatexto'></input><br/><br/>
        
                    <input type="submit" placeholder="Cadastrar" className='enviar'></input><br/>
            
                </form>
            </fieldset>

        </Container>
 
        </div>
    )
}

export default Login;