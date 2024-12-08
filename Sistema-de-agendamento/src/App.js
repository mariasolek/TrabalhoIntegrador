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
import Agenda from './Agenda';
import Calendario from './Calendario';
import Solicitacao from './Solicitacao';
import Aceitas from './Aceito';
//import Button from '@mui/material/Button';

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
	"application/json;charset=utf-8";

function App() {
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	const [exibeCadastro, setExibeCadastro] = React.useState(false);
	const [exibeLogin, setExibeLogin] = React.useState(false);
	const [exibeceito, setExibeAceito] = React.useState(false);
	const [exibeAgenda, setExibeAgenda] = React.useState(false);
	const [exibeDocumentos, setExibeDocumentos] = React.useState(false);
	const [exibeDocumentosNovo, setExibeDocumentosNovo] = React.useState(false);
	const [exibeDashboard, setExibeDashboard] = React.useState(false);
	const [exibeFormulario, setExibeFormulario] = React.useState(false);
	const [exibeSolicitacao, setExibeSolicitacao] = React.useState(false);
	const [cargo, setCargo] = React.useState(null);


    React.useEffect(() => {
		const token = localStorage.getItem("token");
		const storedCargo = localStorage.getItem("cargo"); //atualizei Login pra enviar o cargo da pessoa que logou
		if (token && storedCargo) {
			console.log("Cargo carregado do localStorage:", storedCargo);
		  setIsLoggedIn(true);
		  setCargo(storedCargo);
		} else {
		  handleLogout();
		}
	}, []);
	  

	const handleLogin = (status) => {
		const storedCargo = localStorage.getItem("cargo"); //precisa ser assim se não não atualiza na hora
		setIsLoggedIn(status); 
		setCargo(storedCargo);
	};
	
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("cargo");
		setCargo(null);
		setIsLoggedIn(false);
		setExibeAceito(false);
		setExibeAgenda(false);
		setExibeCadastro(false);
		setExibeDashboard(false);
		setExibeDocumentos(false);
		setExibeDocumentosNovo(false);
		setExibeFormulario(true);
		setExibeLogin(false);
		setExibeSolicitacao(false);
	};


    function controlaInterface(id) { //teste
		console.log(`Veio ${id}`); 
		switch (id){
			case 'cadastro':
				setExibeAceito(false);
				setExibeAgenda(false);
				setExibeCadastro(true);
				setExibeDashboard(false);
				setExibeDocumentos(false);
				setExibeDocumentosNovo(false);
				setExibeFormulario(false);
				setExibeLogin(false);
				setExibeSolicitacao(false);
				break;
			case 'login':
				setExibeAceito(false);
				setExibeAgenda(false);
				setExibeCadastro(false);
				setExibeDashboard(false);
				setExibeDocumentos(false);
				setExibeDocumentosNovo(false);
				setExibeFormulario(false);
				setExibeLogin(true);
				setExibeSolicitacao(false);
				break;
			case 'logout':
				handleLogout();
				setExibeAceito(false);
				setExibeAgenda(false);
				setExibeCadastro(false);
				setExibeDashboard(false);
				setExibeDocumentos(false);
				setExibeDocumentosNovo(false);
				setExibeFormulario(true);
				setExibeLogin(false);
				setExibeSolicitacao(false);
				break;
			 case 'solicitacao':
				setExibeAceito(false);
				setExibeAgenda(false);
				setExibeCadastro(false);
				setExibeDashboard(false);
				setExibeDocumentos(false);
				setExibeDocumentosNovo(false);
				setExibeFormulario(false);
				setExibeLogin(false);
				setExibeSolicitacao(true);
				break;
			default:
				setExibeAceito(false);
				setExibeAgenda(false);
				setExibeCadastro(false);
				setExibeDashboard(false);
				setExibeDocumentos(false);
				setExibeDocumentosNovo(false);
				setExibeFormulario(false);
				setExibeLogin(false);
				setExibeSolicitacao(false);
				break;
		}
	}

	return (
		<div>
		  <CssBaseline />
		  <Menu controlaClique={controlaInterface} isLoggedIn={isLoggedIn} cargo={cargo} />
		  <Grid container justifyContent="center" spacing={2}>
			{isLoggedIn ? (
			  <Agenda />
			) : exibeLogin ? (
			  <Login handleLogin={handleLogin}/>
			) : (
			  <Formulario />
			)}
		  </Grid>
		</div>
	  );
	  
}

export default App;