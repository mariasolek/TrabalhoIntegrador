import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import axios from 'axios';

import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

function Calendario() {
    const currentDate = dayjs();
    const daysInMonth = currentDate.daysInMonth();
    const firstDayOfMonth = currentDate.startOf('month').day(); // dia da semana do primeiro dia (0=domingo, 6=sábado)

    const daysArray = Array.from({ length: daysInMonth }, (_, index) => {
        return {
            date: currentDate.startOf('month').add(index, 'day'),
            day: index + 1,
        };
    });

    
    const emptyDays = Array.from({ length: firstDayOfMonth }, () => null);

    
    const allDays = [...emptyDays, ...daysArray];

    const weeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
        weeks.push(allDays.slice(i, i + 7));
    }

        // Estado para dias indisponíveis
        const [diasIndisponiveis, setDiasIndisponiveis] = React.useState([]);

    const fetchDiasIndisponiveis = async () => {
        try {
            const response = await axios.get('http://localhost:3001/dias-indisponiveis'); // Verifique a URL
            const dias = response.data.map((date) => dayjs(date).date()); // Extrair o dia do mês
            setDiasIndisponiveis(dias);
            console.log('Dias indisponíveis:', dias);
        } catch (error) {
            console.error('Erro ao buscar dias indisponíveis:', error);
        }
    };

    // Chamada inicial para buscar os dias indisponíveis
    React.useEffect(() => {
        fetchDiasIndisponiveis();
    }, []);


    return (
        <div>
            <Grid container fixed>
                <Grid>
                    <h2 id='txtcalend'>Calendário - {currentDate.format('MMMM YYYY')}</h2>
                    <Box sx={{ width: "520px" }}>
                        <Grid container spacing={5.3} className="headeragenda">
                            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'].map((day) => (
                                <Grid item xs={1.71} key={day}>
                                    <Box textAlign="center">{day}</Box>
                                </Grid>
                            ))}
                        </Grid>

                        {weeks.map((week, index) => (
                            <Grid container key={index}>
                                {week.map((day, idx) => (
                                    <Grid item xs={1.71} key={idx}>
                                        <Box textAlign="center">
                                            {day ? (
                                                <Button
                                                    sx={{
                                                        margin: '5px',
                                                        paddingTop: '10px',
                                                        paddingBottom: '10px',
                                                        color: diasIndisponiveis.includes(day.day) || day.date.day() === 0 || day.date.day() === 6 ? 'lightgray' : 'inherit', // Alterando a cor do número
                                                    }}
                                                >
                                                    {day.day}
                                                </Button>
                                            ) : (
                                                <div></div> // Espaço vazio para os dias anteriores ao mês
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
}

export default Calendario;