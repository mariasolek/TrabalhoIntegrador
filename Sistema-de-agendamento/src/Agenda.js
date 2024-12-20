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

function Agenda({codFunc}) {
    console.log("codFunc recebido no Agenda:", codFunc);
    const [linhas, setLinhas] = React.useState([]);
    const [linhaSel, setLinhaSel] = React.useState(null); 
    const [diasAgendados, setDiasAgendados] = React.useState([]); 
    const [currentPage, setCurrentPage] = React.useState("agenda"); 

   
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

        const fetchDiasAgendados = async () => {
            try {
                const response = await axios.get('http://localhost:3001/dias-agendados');
                setDiasAgendados(response.data.map((date) => dayjs(date).date()));
            } catch (error) {
                console.error('Erro ao buscar dias agendados:', error);
            }
        };

        getDados();
        fetchDiasAgendados();
    }, []);

    const handleRowClick = (params) => {
        setLinhaSel(params.row);
        setCurrentPage("solicitacao"); 
    };

    const handleBack = () => {
        setLinhaSel(null);
        setCurrentPage("agenda"); 
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
                                                    sx={{
                                                        margin: '5px',
                                                        paddingTop: '20px',
                                                        paddingBottom: '10px',
                                                        backgroundColor: diasAgendados.includes(day.day) ? '#003366' : 'transparent', 
                                                        color: diasAgendados.includes(day.day) ? 'white' : 'text.primary', 
                                                        '&:hover': {
                                                            backgroundColor: diasAgendados.includes(day.day) ? '#002244' : 'transparent', 
                                                        },
                                                    }}
                                                    disabled={!diasAgendados.includes(day.day)} 
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
                <Box>
                    <Solicitacao linha={linhaSel} codFunc={codFunc}/>
                </Box>
            )}
        </div>
    );
}

export default Agenda;
