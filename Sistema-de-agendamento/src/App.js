import React from 'react';
import axios from "axios";
import './App.css';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import Formulario from './Formulario';
import Menu from './Menu';
import Cadastro from './Cadastro';
import Login from './Login';
//import Button from '@mui/material/Button';

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
	"application/json;charset=utf-8";

function App() {
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	const [exibeCadastro, setExibeCadastro] = React.useState(false);
	const [exibeLogin, setExibeLogin] = React.useState(false);
	const [exibeFormulario, setExibeFormulario] = React.useState(false);

    React.useEffect(() => {
		// verifica se já está logado
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

	/*const handleLogout = () => {
		// Clear the token from localStorage
		localStorage.removeItem("token");
		setIsLoggedIn(false);
	};*/


    function controlaInterface(id) { //teste
		console.log(`Veio ${id}`); 
		switch (id){
			case 'cadastro':
				setExibeCadastro(true);
				setExibeLogin(false);
				setExibeFormulario(false);
				break;
			case 'login':
				setExibeCadastro(false);
				setExibeLogin(true);
				setExibeFormulario(false);
				break;
			default:
			setExibeCadastro(false);
			setExibeLogin(false);
			setExibeFormulario(true);
		}
	}

    return(
        <div>
			<CssBaseline />
			<Menu controlaClique={controlaInterface} />
			<Grid container justifyContent="center" spacing={2}>
				<Formulario/>
				<Grid>
					{exibeLogin ? (
						<Login/>
					) : (
						<div> </div>
					)}
				</Grid>
			</Grid>
        </div>
    )
}

export default App;