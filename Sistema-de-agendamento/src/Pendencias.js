import React from 'react';
import axios from 'axios';
import Solicitacao from './Solicitacao';
import { Alert, Box, Snackbar, Stack } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const colunas = [
    { field: "placa", headerName: "Placa", width: 100 },
    { field: "nome", headerName: "Empresa", width: 120 },
    { field: "volt", headerName: "Volume", width: 80 },
    { field: "dt", headerName: "Data", width: 90 },
];

function Pendencias() {
    const [placa, setPlaca] = React.useState("");
    const [nome, setNome] = React.useState("");
    const [dt, setData] = React.useState("");
    const [volt, setVolt] = React.useState("");

    const [openMessage, setOpenMessage] = React.useState(false);
    const [messageText, setMessageText] = React.useState("");
    const [messageSeverity, setMessageSeverity] = React.useState("success");
    const [linhas, setLinhas] = React.useState([]); // Estado para armazenar os dados das linhas
    const [loading, setLoading] = React.useState(true); // Estado para controle de carregamento
    const [error, setError] = React.useState(); // Estado para erros
    
    const[linhaSel, setLinha] = React.useState(null);

    React.useEffect(() => {
        const getDados = async () => {
          try {
            const response = await axios.get('https://localhost:3000/solicitacoes'); 
            setLinhas(response.data);
          } catch (err) {
            setError(err.message); 
          } finally {
            setLoading(false); 
          }
        };
    
        getDados();
      }, []);

    function handleRowClick(params) {
        setLinha(params.row);
    }

    function handleBack () {
        setLinha(null); 
      };

    return(
        <div>
            <Box>
                {linhaSel ? (
                    <Box>
                        <Solicitacao/>
                    </Box>
                ) : (
            <div>
            <h2>Solicitações pendentes</h2>
            <Stack spacing={2}>
                <Snackbar
                    open={openMessage}
                    autoHideDuration={6000}
                >
                    <Alert
                        severity={messageSeverity}
                                            >
                        {messageText}
                    </Alert>
                </Snackbar>
                <Box style={{ height: "500px", width: "400px"}}>
                    <DataGrid 
                    rows={linhas}
                    columns={colunas} 
                    onRowClick={handleRowClick}
                    />
                </Box>
            </Stack>
            </div>
            )}
            </Box>
        </div> 
    )
}


export default Pendencias;