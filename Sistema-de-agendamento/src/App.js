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
import Aceitas from './Aceito';
//import Button from '@mui/material/Button';

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
	"application/json;charset=utf-8";

function App() {
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	const [exibeCadastro, setExibeCadastro] = React.useState(false);
	const [exibeLogin, setExibeLogin] = React.useState(false);
	const [exibeAceito, setExibeAceito] = React.useState(false);
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
		setExibeLogin(false);
	};

	const [activePage, setActivePage] = React.useState("Login"); 

    function controlaInterface(id) { //teste
		console.log(`Veio ${id}`); 
		switch (id){
			case 'Cadastro':
				setExibeAceito(false);
				setExibeCadastro(true);
				setExibeLogin(false);
				break;
			case 'Login':
				setExibeAceito(false);
				setExibeCadastro(false);
				setExibeLogin(true);
				break;
			case 'Logout':
				handleLogout();
				setExibeAceito(false);
				setExibeCadastro(false);
				setExibeLogin(false);
				break;
			 case 'Sol-aceitas':
				setExibeAceito(true);
				setExibeCadastro(false);
				setExibeLogin(false);
				setActivePage(true);
				break;
			default:
				setExibeAceito(false);
				setExibeCadastro(false);
				setExibeLogin(false);
				break;
		}
	}


	return (
		<div>
		  <CssBaseline />
		  <Menu controlaClique={controlaInterface} isLoggedIn={isLoggedIn} cargo={cargo} activePage={activePage}/>
		  <Grid container justifyContent="center" spacing={2}>
			{isLoggedIn && exibeCadastro ? (
				<Cadastro />
			): isLoggedIn && exibeAceito ? (
				<Aceitas/>			
			):isLoggedIn ? (
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