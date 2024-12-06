import React from 'react';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Agenda from './Agenda';

function checkFileSize() {
    const fs = document.getElementById("fs");
    const files = fs.files;
  
    if (files.length > 0) {
      if (files[0].size >  5 * 1024 * 1024) {
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
  

function Solicitacao() {
    const [nome, setNome] = React.useState("");
    const [placa, setPlaca] = React.useState("");
    const [tel, setTel] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [tp_ver, setVerif] = React.useState("");
    const [dt, setData] = React.useState("");
    const [volt, setVolt] = React.useState("");
    const [n_comp, setNcompartimento] = React.useState("");

    const [currentPage, setCurrentPage] = React.useState("solicit");

    return(
        <div>
            {currentPage === "solicit" && (
            <Grid container spacing={40}>
                <Grid>
                    <h1>Dados da solicitação</h1><br/>
                    <p>
                        Proprietário do veículo:{nome}<br/>
                        Data:{dt}<br/>
                        Telefone:{tel}<br/>
                        E-mail:{email}<br/>
                        Tipo de verificação:{tp_ver}<br/>
                        Placa do veículo:{placa}<br/>
                        Volume total:{volt}<br/>
                        Número de compartimentos:{n_comp}<br/>
                        {/*documentos*/}
                    </p>
                    <Button
                        id='botaovoltar'
                        variant="link"
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => setCurrentPage("voltar")}
                    >
                        Voltar
                    </Button>
                </Grid>
                <Grid>
                    <br/>
                    <label for="gru">Enviar GRU</label><br/>
                    <input type="file" id='fs' accept=".pdf" className='caixaarquivo'></input><br/>

                    <input type='submit' id='enviargru' className='enviar' onClick={() => setCurrentPage("voltar")}></input> 
                    {/*setCurrentPage foi colocado aqui por motivos de TESTE, mais tarde quando pudermos realmente enviar se a solicitação foi aceita ou não
                    isso deve ser mudado seguindo o padrão do componente login !!!!*/}
                </Grid>
            </Grid>
            )}
            {currentPage === "voltar" && (
                <Agenda/>
            )}
        </div>
    )
}

export default Solicitacao;