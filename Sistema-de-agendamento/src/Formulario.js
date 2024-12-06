import React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from "axios";
//import Calendario from './Calendario';
import Agenda from './Agenda';
import Calendario from './Calendario';

function Formulario() {

    const [nome, setNome] = useState(''); 
    const [telefone, setTelefone] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [placa, setPlaca] = useState(''); 
    const [volume, setVolume] = useState(''); 
    const [ncompartimento, setNcompartimento] = useState(''); 
    const [setasAdc, setSetasAdc] = useState(''); 
    const [dt, setDt] = useState('');

    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");



    
    const handleSubmit =  async (event) => {
        event.preventDefault();

        if (nome === '' || telefone === '' || email === ''  || placa === '' || volume === '' || ncompartimento === '' || setasAdc === '') {
            alert('Preencha todos os campos');
            return;
        }

        alert("Enviando os dados:" + nome + " - " + telefone + " - " + email + " - " + placa + " - " + volume + " - " + ncompartimento + " - " + setasAdc);

        {/*ISSO TEM QUE ARRUMAR !*/}
        try{ 
            const response = await axios.post('http://localhost:3000/formulario', {
            
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
                <Grid container spacing={2}>
                    <Grid size={6}>
                    <legend>
                        <br/>
                        <h1>Solicite um agendamento!</h1>
                        <h2>Agende a verificação de seu veículo tanque rodoviário.</h2>
                    </legend>
                    <fieldset>
                        <form onSubmit={handleSubmit}> 
                        <Grid container>
                                    <Grid size={6}>
                                        <label for="prop">Proprietário do veículo</label><br/>
                                        <input type="text" id="prop" placeholder="Digite o nome da empresa" className='caixatexto'
                                        onChange={(e) => setNome(e.target.value)}></input><br/>

                                        <label for="email-prop">E-mail</label><br/>
                                        <input type="email" id="email-prop" placeholder="Digite o e-mail" className='caixatexto'
                                        onChange={(e) => setEmail(e.target.value)}></input><br/>

                                        <label for="placa">Placa</label><br/>
                                        <input type="text" id="placa" placeholder="Digite aqui" className='caixatexto'
                                        onChange={(e) => setPlaca(e.target.value)}></input><br/>

                                        <label for="nro-comp">Número de compartimentos</label><br/>
                                        <input type="text" id="tel-prop" placeholder="Digite aqui" className='caixatexto'
                                        onChange={(e) => setNcompartimento(e.target.value)}></input><br/>

                                        <Grid container spacing={3}>
                                            <Grid>
                                                <label for="veiculo">Veículo novo</label><br/>
                                                <select id="veiculo" className='caixatexto'>
                                                    <option value="S">Sim</option>
                                                    <option value="N">Não</option>
                                                </select><br/>'
                                            </Grid>

                                            <Grid>
                                                <label for="dt">Data</label><br/>
                                                <input type="date" id="dt" className='caixatexto'
                                                onChange={(e) => setDt(e.target.value)}></input><br/>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid size={6}>
                                        <label for="tel-prop">Telefone</label><br/>
                                        <input type="text" id="tel-prop" placeholder="Digite o telefone" className='caixatexto'
                                        onChange={(e) => setTelefone(e.target.value)}></input><br/>

                                        <label for="tipo-verif">Tipo de Verificação</label><br/>
                                        <select id="tipo-verif" className='caixatexto'> 
                                            <option value="inicial">Inicial</option>
                                            <option value="periodica">Periódica</option>
                                            <option value="pos-reparo">Pós-reparo</option>
                                        </select><br/>

                                        <label for="volume-tot">Volume total</label><br/>
                                        <input type="text" id="volume-tot" placeholder="Digite aqui" className='caixatexto'
                                        onChange={(e) => setVolume(e.target.value)}></input><br/>

                                        <label for="setas-ad">Setas adicionais</label><br/>
                                        <input type="number" id="setas-ad" placeholder="Digite aqui" className='caixatexto'
                                        onChange={(e) => setSetasAdc(e.target.value)}></input><br/><br/>

                                        <input type="submit" placeholder="enviar" className='enviar' id="enviarform" ></input><br/>
                                    </Grid>
                                    </Grid>
                            </form>
                        </fieldset>
                    </Grid>
            
                    <Grid size={6}>
                        <br/>
                        <h2 id='cor'>Cheque as datas disponíveis para verificação</h2>
                        <p>As verificações podem acontecer de segunda à sexta, das 08:00 até 12:00 e da 13:00 até às 17:00.
                         A data pode ser agendada, mas o horário funciona por ordem de chegada.</p>
                         {/*tem q mudar isso aí*/}
                        <Calendario/>
                    </Grid>
                </Grid>
            </Container>
        </div>
        )
}

export default Formulario;