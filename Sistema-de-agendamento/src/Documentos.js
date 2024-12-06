import React from 'react';

function Documentos() {

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
    document.getElementById("fs1").onchange = checkFileSize;
};


    return(
        <div>
            <legend>
                <h1>Insira os documentos</h1>
                <h2>Todos os documentos devem estar em formato PDF</h2>
            </legend>
            <fieldset>
                <label for="crlv">CRLV</label><br/>
                <input type="file" id='fs' accept=".pdf" className='caixaarquivo'></input><br/>
                {/*document.getElementById("fs").onchange = checkFileSize*/}
                <label for="cert_aval">Certificado da última avaliação</label><br/>
                <input type="file" id='fs1' accept=".pdf" className='caixaarquivo'></input><br/><br/><br/>
                {/*document.getElementById("fs1").onchange = checkFileSize*/}

                <input type='submit' placeholder="enviardocumento" className='enviar enviardoc'></input>
            </fieldset>
        </div>
    )
}

export default Documentos;