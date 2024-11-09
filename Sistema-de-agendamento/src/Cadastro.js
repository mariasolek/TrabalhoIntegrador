import React from 'react';
import Container from '@mui/material/Container';

function Cadastro() {
    return(
        <div>
        <header>
            <img src="logo.png" alt="Logo do IMETRO-SC" id="logo"></img>
        </header>
        <Container fixed>
            <h1>Cadastro de funcionário</h1>
        <form action='' method='post'>
            <label for="nome">Nome completo</label><br/>
            <input type="text" id="nome" placeholder="Digite o nome"></input><br/>
            <label for="cod">Código do funcionário</label><br/>
            <input type="text" id="cod" placeholder="Digite o código"></input><br/>
            <label for="cargo">Cargo</label><br/>
            <select id="cargo">
                <option value="gerente">Gerente</option>
                <option value="administrador">Administrador</option>
                <option value="tec-administrativo">Técnico administrativo</option>
                <option value="fiscal">Fiscal</option>
            </select><br/><br/>
            <input type="submit" placeholder="Cadastrar"></input><br/>
        </form>
        </Container>
        </div>
    )
}

export default Cadastro;