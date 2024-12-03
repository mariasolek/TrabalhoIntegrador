import React from 'react';
import axios from 'axios';
import { Alert, Box, Snackbar, Stack, TextField, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { headerFilteringStateInitializer } from '@mui/x-data-grid/internals';

const colunas = [
    { field: "placa", headerName: "Placa", width: 140 },
    { field: "nome", headerName: "Empresa", width: 180 },
    { field: "volt", headerName: "Volume", width: 100 },
    { field: "dt", headerName: "Data", width: 180 },
    { field: "res", headerName: "Resultado", width: 180},
];

function Aceitas() {

    const[res, setRes] = React.useState("");

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
            const response = await axios.get('https://localhost:3000/ver-aceitas'); 
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
        setLinha(""); 
      };

    return(
        <div>
            <Box>
                {linhaSel ? (
                    <Box>
                        {/*pagina pra colocar o resultado*/}
                    </Box>
                ) : (
            <div>  
            <h1>Solicitações aceitas</h1>
            <p>Clique na verificação para atualizar o seu resultado</p>
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
                <Box style={{ height: "500px" }}>
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

export default Aceitas;