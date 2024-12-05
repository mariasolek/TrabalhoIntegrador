import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br'; 
import axios from 'axios';
import Pendencias from './Pendencias';
dayjs.locale('pt-br');

function Agenda() {
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
                const response = await axios.get('http://localhost:3000/dias-indisponiveis'); // Verifique a URL
                setDiasIndisponiveis(response.data.map((date) => dayjs(date).date())); // Ajuste o formato conforme necessário
                console.log('Resposta do backend:', response.data);
                console.log('Dias indisponíveis:', diasIndisponiveis);

            } catch (error) {
                console.error('Erro ao buscar dias indisponíveis:', error);
                {/*alert('Não foi possível carregar os dias indisponíveis.');*/}
            }
        };
    
        // Chamada inicial para buscar os dias indisponíveis
        React.useEffect(() => {
            fetchDiasIndisponiveis();
        }, []);
    

    return (
        <div>
            <Grid container>
                <Grid>
                    <h1>Agenda - {currentDate.format('MMMM YYYY')}</h1>
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
                                                sx={{margin:'5px', paddingTop:'20px', paddingBottom:'10px'}}
                                                color={diasIndisponiveis.includes(day.day) ? 'error' : 'primary'}
                                                disabled
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
                <Grid sx={{paddingLeft:'100px'}}>
                    <Pendencias/>
                </Grid>
            
            </Grid>
        </div>
    );
}

export default Agenda;