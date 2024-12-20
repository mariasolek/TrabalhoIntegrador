import React from 'react';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Calendario from './Calendario';
import axios from "axios";

function Formulario() {

    const [nome, setNome] = useState(''); 
    const [telefone, setTelefone] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [placa, setPlaca] = useState(''); 
    const [volume, setVolume] = useState(''); 
    const [ncompartimento, setNcompartimento] = useState(''); 
    const [setasAdc, setSetasAdc] = useState(''); 
    const [tipoVerificacao, settipoVerificacao] = useState(''); 
    const [dt, setDt] = React.useState(null);

    const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");

    const today = new Date().toISOString().split('T')[0];

    const handleSubmit =  async (event) => {
        event.preventDefault();

        if (!nome || !telefone || !email || !placa || !volume || !ncompartimento || !setasAdc || !dt) {
            alert('Preencha todos os campos!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/formulario', {
                nome,
                telefone,
                email,
                placa,
                volume,
                ncompartimento,
                setasAdc,
                tipoVerificacao,
                dt,
            });
            setMessageText(response.data.message || 'Solicitação realizada com sucesso!');
            setMessageSeverity('success');
            setOpenMessage(true);

        } catch (error) {
            console.error(error);
            alert('Erro ao processar a solicitação!');
        }
    };

    return(
        <div>
            <Container fixed>
                <Grid container spacing={2}>
                    <Grid size={6}>
                    <legend>
                        <h1>Solicite um agendamento!</h1>
                        <h3>Agende a verificação de seu veículo tanque rodoviário.</h3>
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
                                                <label for="dt">Data</label><br/>
                                                <input type="date" value={dt || ""} min={today} className='caixatexto'
                                                onChange={(e) => setDt(e.target.value)}></input><br/>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid size={6}>
                                        <label for="tel-prop">Telefone</label><br/>
                                        <input type="text" id="tel-prop" placeholder="Digite o telefone" className='caixatexto'
                                        onChange={(e) => setTelefone(e.target.value)}></input><br/>

                                        <label for="tipo-verif">Tipo de Verificação</label><br/>
                                        <select id="tipo-verif" className='caixatexto'
                                        onChange={(e) => settipoVerificacao(e.target.value)}> 
                                            <option value="1">Inicial</option>
                                            <option value="2">Periódica</option>
                                            <option value="3">Pós-reparo</option>
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
                        <h2 id='cor'>Cheque as datas disponíveis para verificação</h2>
                        <p>As verificações podem acontecer de segunda à sexta, das 08:00 até 12:00 e da 13:00 até às 17:00.
                         A data pode ser agendada, mas o horário funciona por ordem de chegada.</p>
                        <Calendario/>
                    </Grid>
                </Grid>
            </Container>
        </div>
        )
}

export default Formulario;