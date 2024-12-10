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
    { field: "gru", headerName: "GRU", width: 150 }, 
    { field: "funcionario", headerName: "Funcionario", width: 180 }, 
];

function Aceitas() {
    const [res, setRes] = React.useState("");
    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [linhas, setLinhas] = React.useState([]); 
    const [filteredLinhas, setFilteredLinhas] = React.useState([]); 
    const [loading, setLoading] = React.useState(true); 
    const [error, setError] = React.useState(); 
    const [currentPage, setCurrentPage] = React.useState(true);
    const [filterDate, setFilterDate] = React.useState(""); 

    React.useEffect(() => {
        const getDados = async () => {
            try {
                const response = await axios.get('http://localhost:3001/solicitacoes_aceitas');
                const solicitacoesFormatadas = response.data.map(item => ({
                    id: item.cod, 
                    placa: item.placa,
                    empresa: item.empresa,
                    volume: item.volume,
                    data: item.data,
                    gru: item.val_gru, 
                    funcionario: item.func, 
                }));
                setLinhas(solicitacoesFormatadas);
                setFilteredLinhas(solicitacoesFormatadas); 
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getDados();
    }, []);

    React.useEffect(() => {
        if (filterDate) {
            const dataFiltrada = linhas.filter(item =>
                item.data.includes(filterDate)
            );
            setFilteredLinhas(dataFiltrada);
        } else {
            setFilteredLinhas(linhas); 
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
