import React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import axios from "axios";

function Login() {
    const [senha, setSenha] = useState(''); 
    const [codigo, setCodigo] = useState(''); 

    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

    
    const handleSubmit =  async (event) => {
        event.preventDefault();

        if (senha === '' || codigo === '') {
            alert('Preencha todos os campos');
            return;
        }

        alert("Enviando os dados:" + senha + " - " + codigo);

        try{
            const response = await axios.post('http://localhost:3000/login', {
                id: codigo,
                senha: senha
        });
        if (response.data) {
            alert(response.data);
        }
    } catch (error) {
        console.log(error);
			setOpenMessage(true);
			setMessageText("Falha ao logar usuário!");
			setMessageSeverity("error");
    }

    };


    return(
        <div>
            
        <Container fixed>
            <legend>
                <h1>Login</h1>
            </legend>
            <fieldset>
                <form onSubmit={handleSubmit}> 
                    <label for="cod">Código do funcionário</label><br/>
                    <input type="text" id="cod" placeholder="Digite o código" className='caixatexto'
                    onChange={(e) => setCodigo(e.target.value)}></input><br/>

                    <label for="senha">Senha</label><br/>
                    <input type="password" id="senha" placeholder="Digite a senha" className='caixatexto' 
                    onChange={(e) => setSenha(e.target.value)}></input><br/><br/>
        
                    <input type="submit" placeholder="Cadastrar" className='enviar'></input><br/>
            
                </form>
            </fieldset>

        </Container>
 
        </div>
    )
}

export default Login;