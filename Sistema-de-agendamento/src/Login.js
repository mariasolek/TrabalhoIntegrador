import React, { useState } from 'react';
import Container from '@mui/material/Container';
import axios from "axios";

function Login(props) {
    const [codigo, setCodigo] = useState(''); 
    const [senha, setSenha] = useState(''); 

    const [openMessage, setOpenMessage] = useState(false);
    const [messageText, setMessageText] = useState("");
    const [messageSeverity, setMessageSeverity] = useState("success");

    async function enviaLogin(event) {
        event.preventDefault();
        try {
            console.log(props.user);
            const response = await axios.post("http://localhost:3001/login", {
                codigo: codigo,
                senha: senha,
            });
           
    
            if (response.status >= 200 && response.status < 300) {
				// Salva o token JWT na sessão
				localStorage.setItem("token", response.data.token);
				// seta o estado do login caso tudo deu certo
				props.handleLogin(true);
				console.log(props.user);
                alert("login realizado com sucesso!")
			} else {
				// falha
				console.error("Falha na autenticação");
			}
        } catch (error) {
			console.log(error);
			setOpenMessage(true);
			setMessageText("Falha ao logar usuário!");
			setMessageSeverity("error");
		}
    }


    return (
        <div>
            <Container fixed>
                <legend>
                    <h1>Login</h1>
                </legend>
                <fieldset>
                    <form onSubmit={enviaLogin}>
                        <label htmlFor="codigo">Código do funcionário</label><br/>
                        <input 
                            type="text" 
                            id="codigo" 
                            placeholder="Digite o código" 
                            className='caixatexto'
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        /><br/>

                        <label htmlFor="senha">Senha</label><br/>
                        <input 
                            type="password" 
                            id="senha" 
                            placeholder="Digite a senha" 
                            className='caixatexto'
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        /><br/><br/>
            
                        <input type="submit" value="Entrar" className='enviar'/><br/>
                    </form>
                </fieldset>
            </Container>

            {/* Mensagem de feedback */}
            {openMessage && (
                <div 
                    style={{
                        marginTop: "20px", 
                        color: messageSeverity === "success" ? "green" : "red",
                        fontWeight: "bold",
                    }}
                >
                    {messageText}
                </div>
            )}
        </div>
    );
}

export default Login;
