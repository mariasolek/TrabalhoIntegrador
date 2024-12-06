import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Agenda from './Agenda';

function checkFileSize() {
    const fs = document.getElementById("fs");
    const files = fs.files;

    if (files.length > 0) {
        if (files[0].size > 5 * 1024 * 1024) {
            alert("Arquivo ultrapassa o tamanho máximo aceito (5MB)");
            fs.reportValidity();
            return;
        }
    }
    fs.setCustomValidity("");
}

React.onload = () => {
    document.getElementById("fs").onchange = checkFileSize;
};

function Solicitacao({ linha }) {
    const [dadosSolicitacao, setDadosSolicitacao] = useState(null); 
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
                        <label htmlFor="gru">Enviar GRU</label><br />
                        <input type="file" id='fs' accept=".pdf" className='caixaarquivo'></input><br />
                        <input
                            type='submit'
                            id='enviargru'
                            className='enviar'
                            onClick={() => setCurrentPage("voltar")}
                        ></input>
                    </Grid>
                </Grid>
            )}
            {currentPage === "voltar" && <Agenda />}
        </div>
    );
}

export default Solicitacao;
