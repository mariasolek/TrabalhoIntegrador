import React from 'react';
import axios from 'axios';
import { Alert, Box, Snackbar, Stack, TextField, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid2';
import Agenda from './Agenda';

const colunas = [
    { field: "placa", headerName: "Placa", width: 140 },
    { field: "empresa", headerName: "Empresa", width: 180 },
    { field: "volume", headerName: "Volume", width: 100 },
    { field: "data", headerName: "Data", width: 180 },
];

function Aceitas() {
    const [res, setRes] = React.useState("");
    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [linhas, setLinhas] = React.useState([]); // Estado para armazenar os dados das linhas
    const [filteredLinhas, setFilteredLinhas] = React.useState([]); // Estado para armazenar as linhas filtradas
    const [loading, setLoading] = React.useState(true); // Estado para controle de carregamento
    const [error, setError] = React.useState(); // Estado para erros
    const [currentPage, setCurrentPage] = React.useState(true);
    const [filterDate, setFilterDate] = React.useState(""); // Estado para a data de filtro

    React.useEffect(() => {
        const getDados = async () => {
            try {
                // Corrigido o protocolo para http e ajustada a URL da API
                const response = await axios.get('http://localhost:3001/solicitacoes_aceitas');
                // Ajuste para tratar os dados retornados e exibir corretamente
                const solicitacoesFormatadas = response.data.map(item => ({
                    id: item.cod, // Definir um id para as linhas do DataGrid
                    placa: item.placa,
                    empresa: item.empresa,
                    volume: item.volume,
                    data: item.data,
                }));
                setLinhas(solicitacoesFormatadas);
                setFilteredLinhas(solicitacoesFormatadas); // Inicializa com todos os dados
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getDados();
    }, []);

    React.useEffect(() => {
        // Filtra as linhas quando a data for alterada
        if (filterDate) {
            const dataFiltrada = linhas.filter(item =>
                item.data.includes(filterDate)
            );
            setFilteredLinhas(dataFiltrada);
        } else {
            setFilteredLinhas(linhas); // Se não houver filtro, exibe todas as linhas
        }
    }, [filterDate, linhas]);


    return (
        <div>
            <Box>
                { currentPage ? (
                    <div>
                        <Grid container spacing={3}>
                            <Grid size={2}>
                                <Button
                                    id="botaovoltar3"
                                    variant="link"
                                    startIcon={<ArrowBackIcon />}
                                    onClick={() => setCurrentPage(false)}
                                >
                                    Voltar
                                </Button>
                            </Grid>
                            <Grid size={10}>
                                <h1>Solicitações aceitas</h1> <br></br>
                                <Stack spacing={2}>
                                    <Snackbar open={openMessage} autoHideDuration={6000}>
                                        <Alert severity={messageSeverity}>
                                            {messageText}
                                        </Alert>
                                    </Snackbar>
                                    <TextField
                                        label="Filtrar por Data"
                                        type="date"
                                        value={filterDate}
                                        onChange={(e) => setFilterDate(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Box style={{ height: "500px" }}>
                                        <DataGrid
                                            rows={filteredLinhas}
                                            columns={colunas}
                                            loading={loading}
                                            disableSelectionOnClick
                                        />
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    </div>
                ) : (
                    <Agenda />
                )}
            </Box>
        </div>
    );
}

export default Aceitas;
