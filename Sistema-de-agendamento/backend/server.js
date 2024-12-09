const express = require("express");
const cors = require("cors");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const pgp = require("pg-promise")({});

const usuario = "maria";
const senha = "1234";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/trabintegrador`);

const app = express();
app.use(
	cors({
	  origin: "http://localhost:3000", // Substitua pela origem do seu frontend
	  methods: ["POST", "GET", "OPTIONS"],
	  allowedHeaders: ["Content-Type", "Authorization"],
	})
  );
  
app.use(express.json());

app.use(
	session({
		secret: 'alguma_frase_muito_doida_pra_servir_de_SECRET',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(
        {
            usernameField: "codigo",
            passwordField: "senha",
        },
        async (codigo, senha, done) => {
            try {
                // Busca o usuário no banco de dados
                const user = await db.oneOrNone(
                    "SELECT cod, senha FROM funcionario WHERE cod = $1;",
                    [codigo]
                );

                // Se o usuário não foi encontrado, retorna erro
                if (!user) {
                    return done(null, false, { message: "Usuário inválido." });
                }

                // Verifica a senha criptografada
                const isMatch = await bcrypt.compare(senha, user.senha);
                if (isMatch) {
                    console.log("Usuário autenticado!");
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Usuário inválido." });
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "your-secret-key",
		},
		async (payload, done) => {
			try {
				const user = await db.oneOrNone(
					"SELECT * FROM funcionario WHERE cod = $1;",
					[payload.codigo],
				);

				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			} catch (error) {
				done(error, false);
			}
		},
	),
);

passport.serializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, {
			user_id: user.cod,
			codigo: user.cod,
		});
	});
});

passport.deserializeUser(function (user, cb) {
	process.nextTick(function () {
		return cb(null, user);
	});
});

const requireJWTAuth = passport.authenticate("jwt", { session: false });

app.listen(3001, () => console.log("Servidor rodando na porta 3001."));

app.post(
    "/login",
    passport.authenticate("local", { session: false }),
    async (req, res) => {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ message: "Usuário não autenticado" });
        }

        try {
            //procura o cargo no banco
            const resultCargo = await db.one('SELECT cargo FROM funcionario WHERE cod = $1;', [user.cod]);
            if (!resultCargo) {
                return res.status(404).json({ message: "Usuário não encontrado no banco de dados" });
            }
            const cargo = resultCargo.cargo;
            console.log("Cargo:", cargo); //pra teste

            // Gera o token JWT com o código do usuário e o cargo
            const token = jwt.sign({ codigo: user.cod, cargo: cargo, cod: user.cod }, "your-secret-key", {
                expiresIn: "1h",
            });

            console.log("Token gerado:", token); //pra teste
            //retorna o token e o cargo na resposta
            return res.json({ message: "Login bem-sucedido", token: token, cargo: cargo, cod: user.cod});
        } catch (error) {
            console.error("Erro ao consultar banco:", error);
            return res.status(500).json({ message: "Erro ao processar o login" });
        }
    }
);


app.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

app.get("/", (req, res) => {
	res.send("Hello, world!");
});


app.post("/cadastro_func", async (req, res) => {
    const saltRounds = 10;
    try {
        const { cod, nome, email, tel, cargo, senha } = req.body;
        console.log("Dados recebidos no backend:", req.body);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedSenha = bcrypt.hashSync(senha, salt);

        await db.none("INSERT INTO funcionario (cod, nome, email, tel, cargo, senha) VALUES ($1, $2, $3, $4, $5, $6);", [
            cod,
            nome,
            email,
            tel,
            cargo,
            hashedSenha,
        ]);
        console.log("Usuário inserido com sucesso!"); 
        res.sendStatus(200);
    } catch (error) {
        console.log("Erro ao inserir no banco:", error); 
        res.sendStatus(400);
    }
});

app.get("/solicitacoes_pendentes", async (req, res) => {
    try {
        const solicitacoes = await db.any(`
            SELECT s.cod, s.placa, v.vol_total AS volume, p.nome AS empresa, r.dt AS data
            FROM solicitacao s
            JOIN veiculo v ON s.placa = v.placa
            JOIN proprietario p ON v.prop = p.email
            JOIN reservas r ON s.dt = r.cod
            WHERE s.status = 'Pendente';
        `);
        console.log("Retornando todas as  solicitações pendentes");
        res.json(solicitacoes).status(200);
    } catch (error) {
        console.error("Erro ao buscar solicitações pendentes:", error);
        res.sendStatus(400);
    }
});

app.get("/solicitacoes_aceitas", async (req, res) => {
    try {
        const solicitacoes = await db.any(`
            SELECT s.cod, s.placa, v.vol_total AS volume, p.nome AS empresa, r.dt AS data, 
                   s.val_gru, s.func
            FROM solicitacao s
            JOIN veiculo v ON s.placa = v.placa
            JOIN proprietario p ON v.prop = p.email
            JOIN reservas r ON s.dt = r.cod
            WHERE s.status = 'Aceita';
        `);
        console.log("Retornando todas as solicitações aceitas");
        res.json(solicitacoes).status(200);
    } catch (error) {
        console.error("Erro ao buscar solicitações aceitas:", error);
        res.sendStatus(400);
    }
});



app.get("/solicitacao", async (req, res) => {
	try {
		const solicod = parseInt(req.query.cod);
		if (isNaN(solicod)) {
			return res.status(400).json({ error: "Código inválido ou ausente." });
		}
		console.log(`Retornando solicitacao: ${solicod}.`);
		const solicitacao = await db.one(`
            SELECT p.nome as proprietario, r.dt as data, p.tel, p.email, vr.nome as tipo, s.placa, v.vol_total, v.num_comp 
			FROM solicitacao as s JOIN reservas as r ON s.dt = r.cod
			JOIN verificacao as vr ON vr.cod = s.tipo
			JOIN veiculo as v ON s.placa = v.placa
			JOIN proprietario as p ON v.prop = p.email
			WHERE s.cod = $1;`, 
			[solicod]
		);
		res.status(200).json(solicitacao);
	} catch (error) {
		console.error(error);
		if (error.message.includes("No data returned")) {
			return res.status(404).json({ error: "Solicitação não encontrada." });
		}
		res.status(500).json({ error: "Erro interno do servidor." });
	}
});

app.post('/formulario', async (req, res) => {
    const { nome, telefone, email, placa, volume, ncompartimento, setasAdc, tipoVerificacao, dt } = req.body;

    try {
        //se a data já aparece 6 vezes em reservas
        const countReservas = await db.one('SELECT COUNT(*) FROM reservas WHERE dt = $1', [dt]);
        if (parseInt(countReservas.count, 10) >= 6) {
            return res.status(400).json({ message: 'A data selecionada já atingiu o limite de reservas!' });
        }
        //proprietário
        const proprietario = await db.oneOrNone('SELECT * FROM proprietario WHERE email = $1', [email]);
        if (!proprietario) {
            await db.none('INSERT INTO proprietario(email, nome, tel) VALUES($1, $2, $3)', 
                [email, nome, telefone]);
        }

        //veículo
        const veiculo = await db.oneOrNone('SELECT * FROM veiculo WHERE placa = $1', [placa]);
        if (!veiculo) {
            const insertVeiculoQuery = 'INSERT INTO veiculo(placa, vol_total, num_comp, set_ad, prop) VALUES($1, $2, $3, $4, $5)';
            await db.none(insertVeiculoQuery, [placa, volume, ncompartimento, setasAdc, email]);
        }

        //inserir a data em reservas e obter o ID
        const reserva = await db.one('INSERT INTO reservas(cod, dt, status) VALUES(default, $1, $2) RETURNING cod', 
                                     [dt, 'reservado']);
        const reservaId = reserva.cod;

        //solicitação
        await db.none(`
            INSERT INTO solicitacao(cod, status, tipo, placa, dt) 
            VALUES(default, $1, $2, $3, $4)`, 
            ['Pendente', tipoVerificacao, placa, reservaId]);
        res.json({ message: 'Solicitação realizada com sucesso!' });

    } catch (error) {
        console.error('Erro no processamento:', error);
        res.status(500).json({ message: 'Erro ao inserir a solicitação no banco' });
    }
});

app.get('/dias-indisponiveis', async (req, res) => {
    try {
        const diasIndisponiveis = await db.any( `SELECT dt FROM reservas GROUP BY dt HAVING COUNT(*) >= 6;`);
        const datasIndisponiveis = diasIndisponiveis.map((row) => row.dt);
        res.json(datasIndisponiveis); 
    } catch (error) {
        console.error('Erro ao buscar dias indisponíveis:', error);
        res.status(500).json({ error: 'Erro ao buscar dias indisponíveis.' });
    }
});

app.get('/dias-agendados', async (req, res) => {
    try {
        const diasAgendados = await db.any(`SELECT DISTINCT dt FROM reservas;`);
        const datasAgendadas = diasAgendados.map((row) => row.dt);

        res.json(datasAgendadas); 
    } catch (error) {
        console.error('Erro ao buscar dias agendados:', error);
        res.status(500).json({ error: 'Erro ao buscar dias agendados.' });
    }
});

app.post('/atualizar-solicitacao', async (req, res) => {
    const { cod, val_gru, func } = req.body;
    console.log("Dados recebidos no backend:", { cod, val_gru, func });

    if (!cod || !val_gru) {
        return res.status(400).json({ message: "Código e valor da GRU são obrigatórios." });
    }

    try {
        await db.none(`UPDATE solicitacao SET val_gru = $1, status = 'Aceita', func = $2 
            WHERE cod = $3;`,
            [val_gru, func, cod]);
        res.status(200).json({ message: "Solicitação aceita!" });
    } catch (error) {
        console.error("Erro ao atualizar solicitação:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});

app.post('/rejeitar-solicitacao', async (req, res) => {
    const {cod, func} = req.body;
    try {
        await db.none(`UPDATE solicitacao SET status = 'Rejeitada', func = $1  WHERE cod = $2;`,
            [func, cod]);
        res.status(200).json({ message: "Solicitação Rejeitada" });
    } catch (error) {
        console.error("Erro ao atualizar solicitação:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
    }
});