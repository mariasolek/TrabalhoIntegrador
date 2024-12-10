import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Agenda from './Agenda';

function Cadastro() {
    const [formData, setFormData] = React.useState({
        cod: '',
        nome: '',
        senha: '',
        telefone: '',
        email: '',
        cargo: ''
    });

    const [currentPage, setCurrentPage] = React.useState("cadastro");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário
        try {
            const response = await fetch('http://localhost:3001/cadastro_func', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Funcionário cadastrado com sucesso!');
                setFormData({
                    cod: '',
                    nome: '',
                    senha: '',
                    telefone: '',
                    email: '',
                    cargo: ''
                });
            } else {
                alert('Erro ao cadastrar funcionário. Verifique os dados e tente novamente.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro no servidor. Tente novamente mais tarde.');
        }
    };

    return (
        <div>
            {currentPage === "cadastro" && ( 
            <Container fixed>
                <Grid container spacing={2}>
                    <Grid>
                        <Button
                            variant="link"
                            startIcon={<ArrowBackIcon/>}
                            onClick={() => setCurrentPage("voltar")}
                            id="botaovoltar2"
                        >
                            Voltar para agenda
                        </Button>
                    </Grid>
                    <Grid>
                    <legend>
                        <h1>Cadastro de funcionário</h1>
                    </legend>
                    <fieldset>
                        <form onSubmit={handleSubmit}>
                            <label for="nome">Nome completo</label><br />
                            <input type="text" id="nome" placeholder="Digite o nome" className="caixatexto"
                            value={formData.nome} onChange={handleChange} required/><br />
                            <label for="senha">Senha</label><br />
                            <input type="password" id="senha" placeholder="Digite a senha" className="caixatexto"
                            value={formData.senha} onChange={handleChange}required/><br />
                            <label for="telefone">Telefone</label><br /> 
                            <input type="text"  id="telefone" placeholder="Digite o telefone"className="caixatexto"
                            value={formData.telefone} onChange={handleChange}required/><br />
                            <label for="email">E-mail</label><br />
                            <input type="email" id="email" placeholder="Digite o e-mail"className="caixatexto"
                            value={formData.email} onChange={handleChange} required /><br />
                            <label for="cod">Código do funcionário</label><br />
                            <input type="text" id="cod" placeholder="Digite o código" className="caixatexto"
                            value={formData.cod} onChange={handleChange} required /><br />
                            <label for="cargo">Cargo</label><br />
                            <select id="cargo" className="cadastro" 
                            value={formData.cargo} onChange={handleChange} required>
                                <option value="" disabled>Selecione o cargo</option>
                                <option value="1">Administrador</option>
                                <option value="2">Fiscal</option>
                                <option value="3">Técnico administrativo</option>
                                <option value="4">Gerente</option>
                            </select><br /><br />
                            <input type="submit" placeholder="Cadastrar" className="enviar" /><br />
                        </form>
                    </fieldset>
                    </Grid>
                </Grid>
            </Container>
            )}
            {currentPage === "voltar" && ( 
                <Agenda/>
            )}
        </div>
    );
}

export default Cadastro;