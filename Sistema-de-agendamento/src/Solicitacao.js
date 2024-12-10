import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Agenda from './Agenda';

function Solicitacao({ linha, codFunc }) {
    const [dadosSolicitacao, setDadosSolicitacao] = useState(null);
    const [gruValue, setGruValue] = useState(""); 
    const [currentPage, setCurrentPage] = useState("solicit");

    React.useEffect(() => {
        const fetchSolicitacao = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/solicitacao?cod=${linha.cod}`);
                setDadosSolicitacao(response.data);
            } catch (error) {
                console.error("Erro ao buscar os dados da solicitação:", error);
            }
        };

        if (linha && linha.cod) {
            fetchSolicitacao();
        }
    }, [linha]);

    const handleEnviar = async () => {
        if (!gruValue) {
            alert("Por favor, insira o valor da GRU.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/atualizar-solicitacao', {
                cod: linha.cod,
                val_gru: gruValue,
                func: codFunc, 
            });

            alert(response.data.message); 
            setCurrentPage("voltar");
        } catch (error) {
            console.error("Erro ao enviar a solicitação:", error);
            alert("Erro ao enviar a solicitação.");
        }
    };

    const handleRejeitar = async () => {
        try {
            const response = await axios.post('http://localhost:3001/rejeitar-solicitacao', {
                func: codFunc,
                cod: linha.cod
            });
            alert(response.data.message); 
            setCurrentPage("voltar");
        } catch (error) {
            console.error("Erro ao rejeitar a solicitação:", error);
            alert("Erro ao rejeitar a solicitação.");
        }
    };

    if (!dadosSolicitacao) {
        return <div>Carregando dados da solicitação...</div>;
    }

    return (
        <div>
            {currentPage === "solicit" && (
                <Grid container spacing={40}>
                    <Grid>
                        <h1>Dados da solicitação</h1><br />
                        <p>
                            Proprietário do veículo: {dadosSolicitacao.proprietario}<br />
                            Data: {dadosSolicitacao.data}<br />
                            Telefone: {dadosSolicitacao.tel}<br />
                            E-mail: {dadosSolicitacao.email}<br />
                            Tipo de verificação: {dadosSolicitacao.tipo}<br />
                            Placa do veículo: {dadosSolicitacao.placa}<br />
                            Volume total: {dadosSolicitacao.vol_total}<br />
                            Número de compartimentos: {dadosSolicitacao.num_comp}<br />
                        </p>
                        <Button
                            id='botaovoltar'
                            variant="link"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => setCurrentPage("voltar")}
                        >
                            Voltar
                        </Button>
                    </Grid>
                    <Grid>
                        <br />
                        <label htmlFor="gru">Valor da GRU</label><br />
                        <input
                            type="text"
                            id="fs"
                            className="caixaarquivo"
                            value={gruValue}
                            onChange={(e) => setGruValue(e.target.value)} 
                        /><br />
                        <Grid container>
                            <Grid>
                                <input
                                    type="submit"
                                    id="enviargru"
                                    className="enviar"
                                    onClick={handleEnviar} 
                                />
                            </Grid>
                            <Grid>
                                <Button
                                    type="link"
                                    variant= "contained"
                                    sx={{backgroundColor:'#BF0411', marginTop: '300px', marginLeft: '10px', paddingRight:'25px', paddingLeft: '25px', paddingTop: '15px', paddingBottom: '15px'}}
                                    onClick={handleRejeitar} 
                                >
                                    Rejeitar
                                </Button>
                            </Grid>
                    </Grid>
                </Grid>
            </Grid>
            )}
            {currentPage === "voltar" && <Agenda codFunc={codFunc}/>}
        </div>
    );
}

export default Solicitacao;