import React from 'react';
import axios from "axios";
import './App.css';
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
	const [cod, setCod] = React.useState(null);


    React.useEffect(() => {
		const token = localStorage.getItem("token");
		const storedCargo = localStorage.getItem("cargo"); 
		const storedCod = sessionStorage.getItem("cod");
		console.log("Código recuperado do sessionStorage:", storedCod);

		if (token && storedCargo) {
			console.log("Cargo carregado do localStorage:", storedCargo);
		  setIsLoggedIn(true);
		  setCargo(storedCargo);
		  setCod(storedCod);
		} else {
		  handleLogout();
		}
	}, []);
	  

	const handleLogin = (status, codigo) => {
		const storedCargo = localStorage.getItem("cargo"); //precisa ser assim se não não atualiza na hora
		const storedCod = sessionStorage.getItem("cod");
		setIsLoggedIn(status); 
		setCargo(storedCargo);
		setCod(storedCod);
		console.log("cod:", cod);
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


    function controlaInterface(id) { 
		console.log(`Veio ${id}`); 
		switch (id){
			case 'Cadastro':
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
			case 'Login':
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
			case 'Logout':
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
			 case 'Sol-aceitas':
				setExibeAceito(true);
				setExibeAgenda(false);
				setExibeCadastro(false);
				setExibeDashboard(false);
				setExibeDocumentos(false);
				setExibeDocumentosNovo(false);
				setExibeFormulario(false);
				setExibeLogin(false);
				setExibeSolicitacao(false);
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
			{isLoggedIn && exibeCadastro ? (
				<Cadastro />
			): isLoggedIn && exibeceito ? (
				<Aceitas/>			
			):isLoggedIn ? (
				<Agenda codFunc={cod}/>
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