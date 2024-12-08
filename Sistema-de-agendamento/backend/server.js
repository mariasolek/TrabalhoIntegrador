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
            const result = await db.one('SELECT cargo FROM funcionario WHERE cod = $1;', [user.cod]);
            if (!result) {
                return res.status(404).json({ message: "Usuário não encontrado no banco de dados" });
            }
            const cargo = result.cargo;
            console.log("Cargo:", cargo); //pra teste

            // Gera o token JWT com o código do usuário e o cargo
            const token = jwt.sign({ codigo: user.cod, cargo: cargo }, "your-secret-key", {
                expiresIn: "1h",
            });

            console.log("Token gerado:", token); //pra teste

            //retorna o token e o cargo na resposta
            return res.json({ message: "Login bem-sucedido", token: token, cargo: cargo });
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

app.get("/funcionarios", async (req, res) => {
	try {
		const funcionarios = await db.any("SELECT * FROM funcionario;");
		console.log("Retornando todos os funcionários.");
		res.json(funcionarios).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

app.get("/funcionario", async (req, res) => {
	try {
		const funcionarioCod = parseInt(req.query.cod);
		console.log(`Retornando funcionário: ${funcionarioCod}.`);
		const funcionario = await db.one(
			"SELECT cod, nome, email, tel, cargo FROM funcionario WHERE cod = $1;",
			[funcionarioCod],
		);
		res.json(funcionario).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
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


app.post("/cadastro_veiculo", async (req, res) => {
    try {
        const {placa, vol_total, num_comp, ste_ad, proprietario} = req.body;
        console.log("Dados recebidos no backend:", req.body);

        await db.none("INSERT INTO veiculo (placa, vol_total, num_comp, ste_ad, proprietario) VALUES ($1, $2, $3, $4, $5);", [
            placa, 
			vol_total, 
			num_comp, 
			ste_ad,
			proprietario
        ]);
        console.log("Veículo inserido com sucesso!"); 
        res.sendStatus(200);
    } catch (error) {
        console.log("Erro ao inserir no banco:", error); 
        res.sendStatus(400);
    }
});

app.post("/cadastro_doc", async (req, res) => {
    try {
        const {placa, crlv, comp_ver} = req.body;
        console.log("Dados recebidos no backend:", req.body);

        await db.none("INSERT INTO veiculo (crlv, comp_ver) VALUES ($1, $2) WHERE placa = $3;", [
            crlv, 
			comp_ver,
			placa
        ]);
        console.log("Documentos inseridos com sucesso!"); 
        res.sendStatus(200);
    } catch (error) {
        console.log("Erro ao inserir no banco:", error); 
        res.sendStatus(400);
    }
});

app.post("/cadastro_docnovo", async (req, res) => {
    try {
        const {placa, notaf, dcl_fabr} = req.body;
        console.log("Dados recebidos no backend:", req.body);

        await db.none("INSERT INTO veiculo (notaf, dcl_conf) VALUES ($1, $2) WHERE placa = $3;", [
            notaf, 
			dcl_fabr,
			placa
        ]);
        console.log("Documentos inseridos com sucesso!"); 
        res.sendStatus(200);
    } catch (error) {
        console.log("Erro ao inserir no banco:", error); 
        res.sendStatus(400);
    }
});

app.post("/cadastro_proprietario", async (req, res) => {
    const saltRounds = 10;
    try {
        const {email, nome, tel} = req.body;
        console.log("Dados recebidos no backend:", req.body);
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedSenha = bcrypt.hashSync(senha, salt);

        await db.none("INSERT INTO proprietario(email, nome, tel) VALUES ($1, $2, $3);", [
            email, 
			nome, 
			tel
        ]);
        console.log("Proprietário cadastrado com sucesso!"); 
        res.sendStatus(200);
    } catch (error) {
        console.log("Erro ao inserir no banco:", error); 
        res.sendStatus(400);
    }
});

app.post('/formulario', async (req, res) => {
    const { nome, telefone, email, placa, volume, ncompartimento, setasAdc, tipoVerificacao, dt } = req.body;

    try {
        // Verificar se o proprietário existe
        const proprietario = await db.oneOrNone('SELECT * FROM proprietario WHERE email = $1', [email]);
        if (!proprietario) {
            // Inserir proprietário se não existir
            await db.none('INSERT INTO proprietario(email, nome, tel) VALUES($1, $2, $3)', 
                [email, nome, telefone]);
        }

        // Verificar se o veículo existe
        const veiculo = await db.oneOrNone('SELECT * FROM veiculo WHERE placa = $1', [placa]);
        if (!veiculo) {
            // Inserir veículo se não existir
            const insertVeiculoQuery = 'INSERT INTO veiculo(placa, vol_total, num_comp, set_ad, prop) VALUES($1, $2, $3, $4, $5)';
            await db.none(insertVeiculoQuery, [placa, volume, ncompartimento, setasAdc, email]);
        }

        // Verificar se a data está disponível para reserva
        const reserva = await db.oneOrNone('SELECT * FROM reservas WHERE dt = $1', [dt]);
        const reservaId = reserva.cod
        if (!reserva) {
            // Inserir reserva se a data estiver disponível
            const reservaResponse = await db.one('INSERT INTO reservas(cod, dt, status) VALUES(default, $1, $2)', [dt, 'reservado']);
            const reservaId = reservaResponse.cod;
            // Inserir solicitação
        }
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
