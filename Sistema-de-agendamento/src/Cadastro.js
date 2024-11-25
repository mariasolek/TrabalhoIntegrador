import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
//import Grid from '@mui/material/Grid2';

function Cadastro() {
    return(
        <div>
            <Box>
            <Container fixed>
                <legend>
                    <h1>Cadastro de funcionário</h1>
                </legend>
                <fieldset>
                    <form action='' method='get'>
                        <label for="nome">Nome completo</label><br/>
                        <input type="text" id="nome" placeholder="Digite o nome" className='caixatexto'></input><br/>
                        <label for="senha">Senha</label><br/>
                        <input type="password" id="senha" placeholder="Digite a senha" className='caixatexto'></input><br/>
                        <label for="nome">Telefone</label><br/>
                        <input type='text' id="telefone" placeholder="Digite o telefone" className='caixatexto'></input><br/>
                        <label for="nome">E-mail</label><br/>
                        <input type="email" id="email" placeholder="Digite o e-mail" className='caixatexto'></input><br/>
                        <label for="cod">Código do funcionário</label><br/>
                        <input type="text" id="cod" placeholder="Digite o código" className='caixatexto'></input><br/>
                        <label for="cargo">Cargo</label><br/>
                        <select id="cargo" className='cadastro'>
                            <option value="gerente">Gerente</option>
                            <option value="administrador">Administrador</option>
                            <option value="tec-administrativo">Técnico administrativo</option>
                            <option value="fiscal">Fiscal</option>
                        </select><br/><br/>

                        <input type="submit" placeholder="Cadastrar" className='enviar'></input><br/>
                
                    </form>
                </fieldset>
            </Container>
            </Box>
        </div>
    )
}

export default Cadastro;