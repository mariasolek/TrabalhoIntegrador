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

const usuario = "alex";
const senha = "a1895";
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
	(req, res) => {

        // Gera o token JWT
        const token = jwt.sign({ codigo: req.body.codigo }, "your-secret-key", {
            expiresIn: "1h",
        });
        console.log("Token gerado:", token);

        return res.json({ message: "Login bem-sucedido", token: token });
    },
)

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

app.get("/funcionarios", requireJWTAuth, async (req, res) => {
	try {
		const funcionarios = await db.any("SELECT * FROM funcionario;");
		console.log("Retornando todos os funcionários.");
		res.json(funcionarios).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

app.get("/funcionario", requireJWTAuth, async (req, res) => {
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
            SELECT 
                s.cod AS id,
                s.placa,
                v.vol_total AS volume,
                p.nome AS empresa,
                r.dt AS data
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




app.get("/solicitacao", requireJWTAuth, async (req, res) => {
	try {
		const soliPlaca = parseInt(req.query.placa);
		console.log(`Retornando solicitacao: ${soliPlaca}.`);
		const solicitacao = await db.one(
			"SELECT * FROM solicitacao WHERE placa = $1;",
			[soliPlaca],
		);
		res.json(solicitacao).status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
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
