import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import axios from 'axios';
import { Box, Stack } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import Solicitacao from './Solicitacao';

import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

const colunas = [
    { field: "placa", headerName: "Placa", width: 100 },
    { field: "empresa", headerName: "Empresa", width: 120 },
    { field: "volume", headerName: "Volume", width: 80 },
    { field: "data", headerName: "Data", width: 100 },
];

function Agenda() {
    const [linhas, setLinhas] = React.useState([]);
    const [linhaSel, setLinhaSel] = React.useState(null); // Linha selecionada
    const [diasIndisponiveis, setDiasIndisponiveis] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState("agenda"); // Controle de exibição

    React.useEffect(() => {
        const getDados = async () => {
            try {
                const response = await axios.get('http://localhost:3001/solicitacoes_pendentes');
                const linhasComId = response.data.map((linha, index) => ({
                    id: index,
                    ...linha,
                    volume: `${linha.volume}`,
                    data: new Date(linha.data).toLocaleDateString('pt-BR'),
                }));
                setLinhas(linhasComId);
            } catch (err) {
                console.error("Erro ao carregar solicitações:", err);
            }
        };

        const fetchDiasIndisponiveis = async () => {
            try {
                const response = await axios.get('http://localhost:3000/dias-indisponiveis');
                setDiasIndisponiveis(response.data.map((date) => dayjs(date).date()));
            } catch (error) {
                console.error('Erro ao buscar dias indisponíveis:', error);
            }
        };

        getDados();
        fetchDiasIndisponiveis();
    }, []);

    const handleRowClick = (params) => {
        setLinhaSel(params.row);
        setCurrentPage("solicitacao"); // Alterna para o componente Solicitacao
    };

    const handleBack = () => {
        setLinhaSel(null);
        setCurrentPage("agenda"); // Volta para o componente Agenda
    };

    const currentDate = dayjs();
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day();

    const daysArray = Array.from({ length: daysInMonth }, (_, index) => ({
        date: currentDate.startOf('month').add(index, 'day'),
        day: index + 1,
    }));
    const emptyDays = Array.from({ length: firstDayOfMonth }, () => null);
    const allDays = [...emptyDays, ...daysArray];

    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

    return (
        <div>
            {currentPage === "agenda" ? (
                // Componente Agenda
                <Grid container spacing={20}>
                    {/* Agenda */}
                    <Grid item xs={8}>
                        <h1>Agenda - {currentDate.format('MMMM YYYY')}</h1><br/>
                        <Box>
                            <Grid container spacing={8} className="headeragenda">
                                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day) => (
                                    <Grid item xs={1.71} key={day}>
                                        <Box textAlign="center">{day}</Box>
                                    </Grid>
                                ))}
                            </Grid>
                            {weeks.map((week, index) => (
                                <Grid container spacing={2.6} key={index}>
                                    {week.map((day, idx) => (
                                        <Grid item xs={1.71} key={idx}>
                                            <Box textAlign="center">
                                                {day ? (
                                                    <Button
                                                        sx={{ margin: '5px', paddingTop: '20px', paddingBottom: '10px' }}
                                                        color={diasIndisponiveis.includes(day.day) ? 'error' : 'primary'}
                                                        disabled
                                                    >
                                                        {day.day}
                                                    </Button>
                                                ) : (
                                                    <div></div>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}
                        </Box>
                    </Grid>

                    {/* Tabela de Solicitações Pendentes */}
                    <Grid item xs={4}>
                        <h2>Solicitações Pendentes</h2>
                        <Stack spacing={2}>
                            <Box style={{ height: "500px", width: "100%" }}>
                                <DataGrid
                                    rows={linhas}
                                    columns={colunas}
                                    onRowClick={handleRowClick}
                                />
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            ) : (
                // Componente Solicitacao
                <Box>
                    <Solicitacao linha={linhaSel} />
                </Box>
            )}
        </div>
    );
}

export default Agenda;
