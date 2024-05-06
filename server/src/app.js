require('../strategies/localStrategy')

const http = require('http')
const path = require('path')
const openssl = require('openssl')
const fs = require('fs')

const express = require('express')
const expressSession = require('express-session')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')

const app = express()
const port = 5000

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'ejs')

const sql = require('mssql')
const pool = new sql.ConnectionPool('config/string')
const db = require('../config/config.js')
const { stringify } = require('querystring')
const { data } = require('jquery')
const MemoryStore = require('memorystore')(expressSession)

const server = http.createServer(app);

render = route => path.join(__dirname, `../views/${route}`)

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  expressSession({
    name: 'crmdaniel.sid',
    secret: 'h8Y2OUv$139VlDsLGC5i46K&mu@KfUtND$&6s58srbl$@dw!cB',
    saveUninitialized: false,
    resave: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  })
)

app.use(passport.initialize())
app.use(passport.session())

// Se estiver Logado, o static path é view. Se não, é public.
app.use(express.static(path.join(__dirname, '../public')))

app.use((req, res, next) => {
  if (req.session.logged)
    return express.static(path.join(__dirname, '../views'))(req, res, next)

  next()
})

const getUnidadeConsumidoraByClientId = async (id) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT DISTINCT unidadeconsumidora.unidadeConsumidora, cliente.id, cliente.nome
              FROM cliente
              JOIN unidadeconsumidora ON cliente.id = unidadeconsumidora.cliente_id
              WHERE cliente.id = ?`, [id], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

const getClients = async () => {
  return new Promise((resolve, reject) => {
      db.query("SELECT * FROM cliente", (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
  })
}

  const getClientById = async (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM cliente WHERE id = ?', [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log('Result from getClientById:', result);
          resolve(result);
        }
      });
    });
  };

const clienteSelect = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM cliente", (err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
    })
})
}

const getUnidadeConsumidora = async () => {
  return new Promise((resolve, reject) =>{
    db.query("SELECT * FROM unidadeConsumidora", (err, result) => {
      if (err) {
        reject(err)
    } else {
        resolve(result)
    }
})
})
}

const getUnidadeConsumidoraById  = async (unidadeConsumidora) => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM unidadeconsumidora WHERE unidadeConsumidora = ${unidadeConsumidora}`, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
  })
}

const unidadeConsumidoraSelect = async () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM unidadeConsumidora", (err, result) => {
        if (err) {
            reject(err)
        } else {
            resolve(result)
        }
    })
})
}

const getAnalise = async () => {
  return new Promise((resolve, reject) =>{
    db.query("SELECT * FROM analise", (err, result) => {
      if (err) {
        reject(err)
    } else {
        resolve(result)
    }
})
})
}

const getAnaliseById = async (analise) =>{
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM analise WHERE id = ${analise}`, (err, result) =>{
      if(err){
        reject(err)
      } else{
        resolve(result)
      }
    })
  })
}

const getRefaturamento = async () => {
  return new Promise((resolve, reject) =>{
    db.query("SELECT * FROM refaturamento", (err, result) => {
      if (err) {
        reject(err)
    } else {
        resolve(result)
    }
})
})
}

const getAjustes = async () => {
  return new Promise((resolve, reject) =>{
    db.query("SELECT * FROM ajustes", (err, result) => {
      if (err) {
        reject(err)
    } else {
        resolve(result)
    }
})
})
}

const getCobranca = async () => {
  return new Promise((resolve, reject) =>{
    db.query("SELECT * FROM cobrancaIndevida", (err, result) => {
      if (err) {
        reject(err)
    } else {
        resolve(result)
    }
})
})
}

const getRefaturamentoById  = async (refaturamento) => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM refaturamento WHERE id = ${refaturamento}`, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
  })
}

const getAjusteById  = async (ajustes) => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ajustes WHERE id = ${ajustes}`, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
  })
}


const getCobrancaById  = async (cobrancaIndevida) => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM cobrancaIndevida WHERE id = ${cobrancaIndevida}`, (err, result) => {
          if (err) {
              reject(err)
          } else {
              resolve(result)
          }
      })
  })
}

const formateDate = (date) =>{
  const [day, month, year] = date.split('/')
  return [year, month, day].join('-')
}

const formateDateReturn = (isoDate) =>{
  const date = new Date (isoDate)
  return date.toLocaleDateString()
}

 //DASHBOARD VIEW FOR CARDS
 app.get('/dashboard', (req, res) => {
  const sql = 'SELECT * FROM dashboard_view';
  db.query(sql, (err, result, fields) => {
    if (err) throw err;
    const data = {};
    result.forEach(row => {
      data[row.table_name] = row.num_rows;
    });
    res.send(data);
  });
});

// ROTAS ------------------------------------------------------------------------------------------------------

// DEFAULT ENDPOINT ---------------------------------------
// Se estver logado, rediceciona o url padrão pra /home, se não, pra /login
app.get('/', (req, res) => {
  if (req.session.logged) return res.redirect('/home')

  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// LOGIN PAGE ENDPOINT ---------------------------------------l
// Se estiver logado, redireciona pra /home, se não, redireciona pra login page (index.html)
app.get('/login', (req, res) => {
  if (req.session.logged) return res.redirect('/home')

  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// AUTH ENDPOINT ---------------------------------------------
// Faz a autenticação do usuário na abse de dados, e adiciona o "logged state" a um usuário logado.
app.post('/auth', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return res.status(500).send({ success: false, message: err })

    if (!user)
      return res
        .status(401)
        .send({ success: false, message: info || 'Usuário não encontrado' })

    req.session.user = user
    req.session.logged = true

    // req.login(user, err => {
    //   if (err)
    //     return res
    //       .status(500)
    //       .send({ success: false, message: 'Erro interno' })
    // })

    return res.status(200).json({ success: true, data: user })
  })(req, res, next)
})

// logout ENDPOINT ---------------------------------------------

// Tira o "loged state" do usuário, e redireciona pra login.
app.get('/logout', (req, res) => {
  req.session.destroy()
  res.clearCookie('crmdaniel.sid') 
  res.redirect('/login')
})

app.use((req, res, next) => {
  if (!req.session.logged) return res.redirect('/login')

  next()
})

// HOME ENDPOINT ---------------------------------------------
// Redireciona pra Home se estiver logado, e para Login se estiver deslogado.
app.get('/home', async (req, res) => {
  res.render('home');
});

app.get('/listar-ajustes', async (req, res) => {
  const ajustes = await getAjustes()
  console.log('ajustes:', ajustes)
  res.render('pages/listarAjustes', ({ajustes: ajustes}))
})

// LISTAR ANALISES ENDPOINT ---------------------------------------------
app.get('/listar-analises', async (req, res) => {
const analise = (await getAnalise())
console.log('analise:', analise)
res.render('pages/listarAnalises', ({analise: analise}))
})//

// LISTAR CLIENTES ENDPOINT ---------------------------------------------
app.get('/listar-clientes', async (req, res) => {
  const clients = await getClients()
  res.render('pages/listarClientes', ({clients: clients }))
})

// LISTAR COBRANCAS ENDPOINT ---------------------------------------------
app.get('/listar-cobrancas', async (req, res) => {
  const cobranca = await getCobranca()
  res.render('pages/listarCobrancas', ({cobranca: cobranca}))
})

// LISTAR REFATURAMENTOS ENDPOINT ---------------------------------------------
app.get('/listar-refaturamentos', async (req, res) => {
  const refaturamento = await getRefaturamento()
  res.render('pages/listarRefaturamentos', ({refaturamento: refaturamento}))
})

// LISTAR UC ENDPOINT ---------------------------------------------
app.get('/listar-unidades-consumidoras', async (req, res) => {
  const unidadeConsumidora = await getUnidadeConsumidora()
  res.render('pages/listarUC', ({unidadeConsumidora: unidadeConsumidora}))
})

// NOVA ANALISE ENDPOINT ---------------------------------------------
app.get('/nova-analise', async (req, res) => {
  try {
    const client = await getClients();
    const selectedNome = req.query.nome;
    let unidadeConsumidora = [];

    if (selectedNome) {
      unidadeConsumidora = await getUnidadeConsumidoraByClientId(selectedNome);
    }

    res.render('pages/novaAnalise', { unidadeConsumidora: unidadeConsumidora, client:client });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/select-unidade-consumidora-by-id/:id', async (req, res) =>{

  const clientId = req.params.id
  const consumerUnitys = await getUnidadeConsumidoraByClientId(clientId)
  console.log(consumerUnitys)
  res.status(200).json(consumerUnitys)
})

// NOVA COBRANCA ENDPOINT ---------------------------------------------
app.get('/nova-cobranca', async (req, res) => {
  try {
    const client = await getClients();
    const selectedNome = req.query.nome;
    let unidadeConsumidora = [];

    if (selectedNome) {
      unidadeConsumidora = await getUnidadeConsumidoraByClientId(selectedNome);
    }

    res.render('pages/novaCobranca', { unidadeConsumidora: unidadeConsumidora, client:client });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/novo-refaturamento', async (req, res) => {
  try {
    const client = await getClients();
    const selectedNome = req.query.nome;
    let unidadeConsumidora = [];

    if (selectedNome) {
      unidadeConsumidora = await getUnidadeConsumidoraByClientId(selectedNome);
    }

    res.render('pages/novoRefaturamento', { unidadeConsumidora: unidadeConsumidora, client:client });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// NOVA UC ENDPOINT ---------------------------------------------
app.get('/nova-unidade-consumidora', async (req, res) => {
  const client = await getClients()
  res.render('pages/novaUC', {client: client})
})

// NOVO AJUSTE ENDPOINT ---------------------------------------------
app.get('/novo-ajuste', async (req, res) => {
  try {
    const client = await getClients();
    const selectedNome = req.query.nome;
    let unidadeConsumidora = [];

    if (selectedNome) {
      unidadeConsumidora = await getUnidadeConsumidoraByClientId(selectedNome);
    }

    res.render('pages/novoAjuste', { unidadeConsumidora: unidadeConsumidora, client:client });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
});

// NOVO CLIENTE ENDPOINT ---------------------------------------------
app.get('/novo-cliente', (req, res) =>{
  res.render('pages/novoCliente')
})

//Templates EJS -------------------------------------------------------------
app.get('/editar-cliente/:id', async (req, res ) =>{
  const id = req.params.id
  const client = await getClientById(id)
  console.log('cliente dados aqui:', client)
  res.render('pages/editarClientes', {client: client})
})

app.get('/editar-unidade-consumidora/:id', async (req, res) =>{
  const id = req.params.id
  const unidadeConsumidora = (await getUnidadeConsumidoraById(id))[0]
  const client = (await getClientById(unidadeConsumidora.cliente_id))[0]
  res.render('pages/editarUC', {unidadeConsumidora: unidadeConsumidora, client: client} )
})

app.get('/editar-analise/:id', async (req, res) =>{
  const id = req.params.id
  const analise = (await getAnaliseById(id))[0]
  const unidadeConsumidora = (await getUnidadeConsumidoraById(analise.unidadeConsumidora_id))[0]
  const client = (await getClientById(analise.cliente_id))[0]
  res.render('pages/editarAnalise', {analise: analise, unidadeConsumidora: unidadeConsumidora, client: client} )
})

app.get('/editar-ajustes/:id', async (req, res) => {
  const id = req.params.id
  console.log('id', id)
  const ajustes = (await getAjusteById(id))[0]
  console.log('ajustes', ajustes)
  const unidadeConsumidora = (await getUnidadeConsumidoraById(ajustes.unidadeConsumidora_id))[0]
  console.log('unidade consumidora', unidadeConsumidora)
  const client = (await getClientById(ajustes.cliente))[0]
  console.log('client', client)
  res.render('pages/editarAjuste', {ajustes: ajustes, unidadeConsumidora: unidadeConsumidora, client: client})
})

app.get('/editar-refaturamento/:id', async (req, res) => {
  const id = req.params.id
  const refaturamento = (await getRefaturamentoById(id))[0]
  const unidadeConsumidora = (await getUnidadeConsumidoraById(refaturamento.unidadeConsumidora_id))[0]
  const client = (await getClientById(refaturamento.cliente_id))[0]
  res.render('pages/editarRefaturamento', {refaturamento: refaturamento, unidadeConsumidora: unidadeConsumidora, client:client})
})

app.get('/editar-cobranca/:id', async (req, res) => {
  const id = req.params.id
  const cobranca = (await getCobrancaById(id))[0]
  const unidadeConsumidora = (await getUnidadeConsumidoraById(cobranca.unidadeConsumidora_id))[0]
  const client = (await getClientById(cobranca.cliente_id))[0]
  res.render('pages/editarCobranca', {cobranca: cobranca, unidadeConsumidora: unidadeConsumidora, client:client})
})

// AJUSTES DBcli ENDPOINT ---------------------------------------------
app.get('/ajustes-db', (req, res) => {
  db.query('SELECT * FROM ajustes', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(results)
    }
  })
})

//DELETE UNIDADE CONSUMIDORA TABLE ROW---------------------------------------------
app.delete('/delete-unidadeConsumidora-db/:unidadeConsumidora', (req, res) => {
  const unidadeConsumidora = req.params.unidadeConsumidora
  db.query(
    'DELETE FROM crmdaniel.unidadeconsumidora WHERE unidadeConsumidora = ?',
    [unidadeConsumidora],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(`Row with UC ${unidadeConsumidora} deleted from database`)
        res.sendStatus(200)
      }
    }
  )
})

//DELETE CLIENT TABLE ROW----------------------------------------------------------
app.delete('/delete-client-db/:id', (req, res) => {
  const id = req.params.id
  db.query(
    'DELETE FROM cliente WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(`Row with ${id} deleted from database`)
        res.sendStatus(200)
      }
    }
  )
})

//DELETE ANALISE TABLE ROW --------------------------------------------------------
app.delete('/delete-analise-db/:id', (req, res) => {
  const id = req.params.id
  db.query(
    'DELETE FROM analise WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(`Row with ${id} deleted from database`)
        res.sendStatus(200)
      }
    }
  )
}) 

//DELETE REFATURAMENTO TABLE ROW
app.delete('/delete-refaturamento-db/:id', (req, res) => {
  const id = req.params.id
  db.query(
    'DELETE FROM refaturamento WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(`Row with ${id} deleted from database`)
        res.sendStatus(200)
      }
    }
  )
})

//DELETE AJUSTE TABLE ROW
app.delete('/delete-ajuste-db/:id', (req, res) => {
  const id = req.params.id
  db.query(
    'DELETE FROM ajustes WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(`Row with ${id} deleted from database`)
        res.sendStatus(200)
      }
    }
  )
})

//DELETE COBRANÇA INDEVIDA TABLE ROW
app.delete('/delete-cobrancaIndevida-db/:id', (req, res) => {
  const id = req.params.id
  db.query(
    'DELETE FROM cobrancaIndevida WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(`Row with ${id} deleted from database`)
        res.sendStatus(200)
      }
    }
  )
})

// ANALISE DB TABLE ENDPOINT ---------------------------------------------
app.get('/analise-db', (req, res) => {
  db.query('SELECT * FROM analise', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(results)
    }
  })
})

// CLIENTE DB TABLE ENDPOINT ---------------------------------------------
app.get('/cliente-db', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(results)
    }
  })
})

// COBRANÇA INDEVIDDA DB TABLE ENDPOINT ---------------------------------------------
app.get('/cobrancaindevida-db', (req, res) => {
  db.query('SELECT * FROM cobrancaindevida', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(results)
    }
  })
})

// REFATURAMENTO DB TABLE ENDPOINT ---------------------------------------------
app.get('/refaturamento-db', (req, res) => {
  db.query('SELECT * FROM refaturamento', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(results)
    }
  })
})

// UC DB TABLE ENDPOINT ---------------------------------------------
app.get('/unidadeconsumidora-db', (req, res) => {
  db.query('SELECT * FROM unidadeconsumidora', (err, results) => {
    if (err) {
      console.error(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.json(results)
    }
  })
})

// UC DB TABLE EDIT ENDPOINT ---------------------------------------------
app.get('/unidadeconsumidora/:ID', (req, res) => {
  const id = req.params.ID
  db.query(
    'SELECT * FROM unidadeconsumidora WHERE ID = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Internal Server Error')
      } else if (result.length === 0) {
        res.status(404).send('Unidade consumidora not found')
      } else {
        const uc = result[0]
        res.status(200).send(uc)
      }
    }
  )
})

//ADICIONAR NOVA UC--------------------------------
app.post('/add-nova-uc', async (req, res) => {
  // //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
  const {
    cliente_id,
    unidadeConsumidora,
    localDeInstalacao,
    endereco,
    cep,
    cidade,
    estado,
    classificacao,
    dataDeLeitura,
    tipoDeFornecimento,
    ICMS,
    geracaoDistribuida,
    demandaContratada,
    opcaoTarifaria,
    concessionaria,
    login,
    senha
  } = req.body

  const formattedDataDeLeitura = dataDeLeitura ? new Date(dataDeLeitura).toISOString().split('T')[0] : null;
  const client = (await getClientById(cliente_id))[0]
  const cepFloat = !isNaN(+cep) ? parseFloat(cep) : null
  
  console.log('valor de client:', client)

  console.log('BODY AQUI:', req.body)

  const sql = `
    INSERT INTO unidadeconsumidora (
      cliente_id,
      nome,
      unidadeConsumidora,
      localdeInstalacao,
      endereco,
      cep,
      cidade,
      estado,
      classificacao,
      dataDeLeitura,
      tipoDeFornecimento,
      ICMS,
      geracaoDistribuida,
      demandaContratada,
      opcaoTarifaria,
      concessionaria,
      login,
      senha
      ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`;
 
  const values = [
    cliente_id,
    client.nome,
    unidadeConsumidora,
    localDeInstalacao,
    endereco,
    cepFloat,
    cidade,
    estado,
    classificacao,
    formattedDataDeLeitura !== null ? formattedDataDeLeitura : null,
    tipoDeFornecimento,
    ICMS,
    geracaoDistribuida,
    demandaContratada,
    opcaoTarifaria, 
    concessionaria,
    login,
    senha,
    unidadeConsumidora
  ];

    console.log('VALORES AQUI:', values)
  //EXECUTA A SQL QUERY
  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error)
      return error
    } else {
      console.log('results mas, me string', results)
    }
    res.redirect(`/listar-unidades-consumidoras`) 
  })
}) 

// ADD NOVO CLIENTE -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/add-novo-cliente', (req, res) => {
  // //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
  const {
    nome,
    cpfCnpj,
    email,
    dataDeNascimento,
    whatsapp,
    telefone,
    endereco,
    cep,
    cidade,
    estado,
  } = req.body;

  const formattedDataDeNascimento = dataDeNascimento ? new Date(dataDeNascimento).toISOString().split('T')[0] : null;

  
  const sql = `
    INSERT INTO cliente (
      nome, 
      cpfCnpj, 
      email, 
      dataDeNascimento, 
      whatsapp, 
      telefone, 
      endereco, 
      cep, 
      cidade, 
      estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;


  const values = [
    nome,
    cpfCnpj,
    email,
    formattedDataDeNascimento !== null ? formattedDataDeNascimento : null,
    whatsapp,
    telefone,
    endereco,
    cep,
    cidade,
    estado,
  ];

  // EXECUTA A SQL QUERY
  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error);
      res
        .status(500)
        .send('Error inserting new row into database: ' + error.message);
    } else {
      console.log('New row inserted into database with ID: ', results.insertId);
      res.redirect('/listar-clientes');
    }
  });
});

//POST pra analise -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
app.post('/add-nova-analise', async (req, res) => {
  //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
      const {
        client_id,
        mesAno,
        unidadeConsumidora_id,
        valorInicial,
        valorFinal,
        consumoPonta,
        consumoForaPonta,
        consumoHR,
        demandaLida,
        demandaContratada,
        demandaFaturada,
        adicionalBandeiraPonta,
        adicionalBandeiraForaPonta,
        adicionalBandeiraHR,
        ufer,
        uferForaPonta,
        uferHR,
        compensacaoDicMensal,
        compensacaoDicTrimestral,
        compensacaoDicAnual,
        compensacaoDecMensal,
        compensacaoDecTrimestral,
        compensacaoDecAnual,
        compensacaoFicMensal,
        compensacaoFicTrimestral,
        compensacaoFicAnual,
        compensacaoFecMensal,
        compensacaoFecTrimestral,
        compensacaoFecAnual,
        compensacaoDMICMensal,
        compensacaoDMICTrimestral,
        compensacaoDMICAnual,
        multa, 
        juros,
        outros,
        faturaOk
      } = req.body
      
      console.log('body aqui:', req.body)
      const client = (await getClientById(client_id))[0]
      const formattedMesAno = mesAno ? new Date(`${mesAno}-01`).toISOString().split('T')[0] : null;

      
    const sql = `
      INSERT INTO analise (
        cliente_id,
        nome,
        mesAno,
        unidadeConsumidora_id,
        valorInicial,
        valorFinal,
        consumoPonta,
        consumoForaPonta,
        consumoHR,
        demandaLida,
        demandaContratada,
        demandaFaturada,
        adicionalBandeiraPonta,
        adicionalBandeiraForaPonta,
        adicionalBandeiraHR,
        ufer,
        uferForaPonta,
        uferHR,
        compensacaoDicMensal,
        compensacaoDicTrimestral,
        compensacaoDicAnual,
        compensacaoDecMensal,
        compensacaoDecTrimestral,
        compensacaoDecAnual,
        compensacaoFicMensal,
        compensacaoFicTrimestral,
        compensacaoFicAnual,
        compensacaoFecMensal,
        compensacaoFecTrimestral,
        compensacaoFecAnual,
        compensacaoDMICMensal,
        compensacaoDMICTrimestral,
        compensacaoDMICAnual,
        multa, 
        juros,
        outros,
        faturaOk
      ) VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      )
    `
  
    const values = [
      client_id,
      client.nome,
      formattedMesAno,
      unidadeConsumidora_id,
      valorInicial,
      valorFinal,
      consumoPonta,
      consumoForaPonta,
      consumoHR,
      demandaLida,
      demandaContratada,
      demandaFaturada,
      adicionalBandeiraPonta,
      adicionalBandeiraForaPonta,
      adicionalBandeiraHR,
      ufer,
      uferForaPonta,
      uferHR,
      compensacaoDicMensal,
      compensacaoDicTrimestral,
      compensacaoDicAnual,
      compensacaoDecMensal,
      compensacaoDecTrimestral,
      compensacaoDecAnual,
      compensacaoFicMensal,
      compensacaoFicTrimestral,
      compensacaoFicAnual,
      compensacaoFecMensal,
      compensacaoFecTrimestral,
      compensacaoFecAnual,
      compensacaoDMICMensal,
      compensacaoDMICTrimestral,
      compensacaoDMICAnual,
      multa, 
      juros,
      outros,
      faturaOk
    ]
  
    //EXECUTA A SQL QUERY
    db.query(sql, values, (error, results, fields) => {
      if (error) {
        console.error('Error inserting new row into database: ', error)
        res
          .status(500)
          .send('Error inserting new row into database: ' + error.message)
      } else {
        console.log('New row inserted into database with ID: ', results.insertId)
        res.status(200).send('New row inserted into database')
      }
    })
  })

// POST PRA REFATURAMENTO
app.post('/add-novo-refaturamento', async(req, res) => {
  // //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
  const {
    client_id,
    unidadeConsumidora_id,
    analise,
    solicitacaoTexto,
    solicitacaoOpcao,
    dataDaSolicitacao,
    protocoloDaSolicitacao,
    statusDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
  } = req.body;
  
  const client = (await getClientById(client_id))[0]
  console.log('body:', req.body)

  const sql = `
    INSERT INTO refaturamento (
      cliente_id,
      nome,
      unidadeConsumidora_id,
      analise,
      solicitacaoTexto,
      solicitacaoOpcao,
      dataDaSolicitacao,
      protocoloDaSolicitacao,
      statusDaSolicitacao,
      conclusaoDaSolicitacao,
      dataDaConclusao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )`
  
  const values = [
    client_id,
    client.nome,
    unidadeConsumidora_id,
    analise,
    solicitacaoTexto,
    solicitacaoOpcao,
    dataDaSolicitacao,
    protocoloDaSolicitacao,
    statusDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
  ]

  console.log('values:', values)
  

 //EXECUTA A SQL QUERY
  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error)
      res
        .status(500)
        .send('Error inserting new row into database: ' + error.message)
    } else {
      console.log('New row inserted into database with ID: ', results.insertId)
      res.status(200).send('New row inserted into database')
    }
  })
})

//POST AJUSTE
app.post('/add-novo-ajuste', async (req, res) => {
  // //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
  const {
    client_id,
    unidadeConsumidora_id,
    tipoDeAjuste,
    analise,
    solicitacaoTexto,
    solicitacaoEscolha,
    dataDaSolicitacao,
    statusDaSolicitacao,
    protocoloDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
  } = req.body;
  
  
  const client = (await getClientById(client_id))[0]
  console.log('body:', req.body)
  console.log('cliente aqui:', client)

  const sql = `
    INSERT INTO ajustes (
      cliente_id, 
      nome,
      unidadeConsumidora_id,
      tipoDeAjuste,
      analise,
      solicitacaoTexto,
      solicitacaoEscolha,
      dataDaSolicitacao,
      statusDaSolicitacao,
      protocoloDaSolicitacao,
      conclusaoDaSolicitacao,
      dataDaConclusao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  
  const values = [
    client_id,
    client.nome,
    unidadeConsumidora_id,
    tipoDeAjuste,
    analise,
    solicitacaoTexto,
    solicitacaoEscolha,
    dataDaSolicitacao,
    statusDaSolicitacao,
    protocoloDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
  ]


  console.log('values:', values)

  //EXECUTA A SQL QUERY
  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error)
      res
        .status(500)
        .send('Error inserting new row into database: ' + error.message)
    } else {
      console.log('New row inserted into database with ID: ', results.insertId)
      res.status(200).send('New row inserted into database')
    }
  })
})

//POST
app.post('/add-nova-cobrancaIndevida', async (req, res) => {
  // //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
  const {
    client_id,
    unidadeConsumidora_id,
    analise,
    solicitacaoTexto,
    solicitacaoOpcao,
    dataDaSolicitacao,
    protocoloDaSolicitacao,
    statusDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao

  } = req.body

  const client = (await getClientById(client_id))[0]
  console.log('client:', client)
  console.log('body aqui:', req.body)

  const sql = `
    INSERT INTO cobrancaIndevida (
      cliente_id,
      nome,
      unidadeConsumidora_id,
      analise,
      solicitacaoTexto,
      solicitacaoOpcao,
      dataDaSolicitacao,
      protocoloDaSolicitacao,
      statusDaSolicitacao,
      conclusaoDaSolicitacao,
      dataDaConclusao
    ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  
  const values = [
    client_id,
    client.nome,
    unidadeConsumidora_id,
    analise,
    solicitacaoTexto,
    solicitacaoOpcao,
    dataDaSolicitacao,
    protocoloDaSolicitacao,
    statusDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
  ]

  console.log('values aqui:', values)

  //EXECUTA A SQL QUERY
  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error)
      res
        .status(500)
        .send('Error inserting new row into database: ' + error.message)
    } else {
      console.log('New row inserted into database with ID: ', results.insertId)
      res.status(200).send('New row inserted into database')
    }
  })
})

//EDITAR NOVO CLIENTE --------------
app.post('/editar-cliente', (req, res) => {
  const {
    id,
    nome,
    cpfCnpj,
    email,
    dataDeNascimento,
    whatsapp,
    telefone,
    endereco,
    cep,
    cidade,
    estado,
  } = req.body;

  console.log('body aqui:', req.body)
  // Converting date format
  const formattedDataDeNascimento = dataDeNascimento ? new Date(dataDeNascimento).toISOString().split('T')[0] : null;



  const sql = `UPDATE cliente SET 
  nome = ?, 
  cpfCnpj = ?, 
  email = ?, 
  dataDeNascimento = ?, 
  whatsapp = ?, 
  telefone = ?, 
  endereco = ?, 
  cep = ?, 
  cidade = ?, 
  estado = ?
WHERE ID = ?`;

  const cepFloat = !isNaN(+cep) ? parseFloat(cep) : null;

  const values = [
    nome,
    cpfCnpj,
    email,
    formattedDataDeNascimento,
    whatsapp,
    telefone,
    endereco,
    cepFloat,
    cidade,
    estado,
    parseInt(id),
  ];
  
  console.log('values aqui:', values)

  db.query(sql, values, (error, results, fields) => {
    if (error) {
      alert('Erro ao conectar no banco de dados');
      console.error('Error inserting new row into database: ', error);
      return error;
    } else {
      console.log('results mas, me string', results);
    }

    res.redirect('/listar-clientes'); //redirect to "/listar-clientes" after data has been updated
  });
});

// EDITAR UNIDADE CONSUMIDORA
app.post('/editar-unidadeConsumidora', async (req, res) => {
  // //AQUI ELE PEGA OS DADOS DO BODY DA RESQUEST
   const {
    cliente_id,
    unidadeConsumidora,
    localDeInstalacao,
    endereco,
    cep,
    cidade,
    estado,
    classificacao,
    dataDeLeitura,
    tipoDeFornecimento,
    ICMS,
    geracaoDistribuida,
    demandaContratada,
    opcaoTarifaria,
    concessionaria,
    login,
    senha
  } = req.body
  
    console.log('BODY AQUI:', req.body)

  const sql = `
    UPDATE unidadeconsumidora SET 
      cliente_id = ?,
      nome = ?,
      unidadeConsumidora = ?,
      localdeInstalacao = ?,
      endereco = ?,
      cep = ?,
      cidade = ?,
      estado = ?,
      classificacao = ?,
      dataDeLeitura = ?,
      tipoDeFornecimento = ?,
      ICMS = ?,
      geracaoDistribuida = ?,
      demandaContratada = ?,
      opcaoTarifaria = ?,
      concessionaria = ?,
      login = ?,
      senha = ?
    WHERE unidadeConsumidora = ?
  `;

  const client = (await getClientById(cliente_id))[0]
  const cepFloat = !isNaN(+cep) ? parseFloat(cep) : null
  const formattedDataDeLeitura = dataDeLeitura ? new Date(dataDeLeitura).toISOString().split('T')[0] : null;

  const values = [
      cliente_id,
      client.nome,
      unidadeConsumidora,
      localDeInstalacao,
      endereco,
      cepFloat,
      cidade,
      estado,
      classificacao,
      formattedDataDeLeitura,
      tipoDeFornecimento,
      ICMS,
      geracaoDistribuida,
      demandaContratada,
      opcaoTarifaria, 
      concessionaria,
      login,
      senha,
      unidadeConsumidora
    ];
 
    console.log('VALORES AQUI:', values)
  //EXECUTA A SQL QUERY
  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error)
      return error
    } else {
      console.log('results mas, me string', results)
    }
    res.redirect(`/listar-unidades-consumidoras`) 
  })
}) 

// EDITAR ANALISE
app.post('/editar-Analise', async (req, res) => {
    
      const {
        id,
        cliente_id,
        mesAno,
        unidadeConsumidora_id,
        valorInicial,
        valorFinal,
        consumoPonta,
        consumoForaPonta,
        consumoHR,
        demandaLida,
        demandaContratada,
        demandaFaturada,
        adicionalBandeiraPonta,
        adicionalBandeiraForaPonta,
        adicionalBandeiraHR,
        ufer,
        uferForaPonta,
        uferHR,
        compensacaoDicMensal,
        compensacaoDicTrimestral,
        compensacaoDicAnual,
        compensacaoDecMensal,
        compensacaoDecTrimestral,
        compensacaoDecAnual,
        compensacaoFicMensal,
        compensacaoFicTrimestral,
        compensacaoFicAnual,
        compensacaoFecMensal,
        compensacaoFecTrimestral,
        compensacaoFecAnual,
        compensacaoDMICMensal,
        compensacaoDMICTrimestral,
        compensacaoDMICAnual,
        multa, 
        juros,
        outros,
        faturaOk
      } = req.body;

       const client = (await getClientById(cliente_id))[0]

       const formattedMesAno = mesAno

       ? new Date(`${mesAno}-01`).toISOString().split('T')[0]
       : null;



       const sql = `
       UPDATE analise SET
           nome = ?,
           mesAno = ?,
           unidadeConsumidora_id = ?,
           valorInicial = ?,
           valorFinal = ?,
           consumoPonta = ?,
           consumoForaPonta = ?,
           consumoHR = ?,
           demandaLida = ?,
           demandaContratada = ?,
           demandaFaturada = ?,
           adicionalBandeiraPonta = ?,
           adicionalBandeiraForaPonta = ?,
           adicionalBandeiraHR = ?,
           ufer = ?,
           uferForaPonta = ?,
           uferHR = ?,
           compensacaoDicMensal = ?,
           compensacaoDicTrimestral = ?,
           compensacaoDicAnual = ?,
           compensacaoDecMensal = ?,
           compensacaoDecTrimestral = ?,
           compensacaoDecAnual = ?,
           compensacaoFicMensal = ?,
           compensacaoFicTrimestral = ?,
           compensacaoFicAnual = ?,
           compensacaoFecMensal = ?,
           compensacaoFecTrimestral = ?,
           compensacaoFecAnual = ?,
           compensacaoDMICMensal = ?,
           compensacaoDMICTrimestral = ?,
           compensacaoDMICAnual = ?,
           multa = ?,
           juros = ?,
           outros = ?,
           faturaOk = ?
        WHERE id = ?
   `;
   
   const values = [
     client.nome,
     formattedMesAno,
     unidadeConsumidora_id,
     valorInicial,
     valorFinal,
     consumoPonta,
     consumoForaPonta,
     consumoHR,
     demandaLida,
     demandaContratada,
     demandaFaturada,
     adicionalBandeiraPonta,
     adicionalBandeiraForaPonta,
     adicionalBandeiraHR,
     ufer,
     uferForaPonta,
     uferHR,
     compensacaoDicMensal,
     compensacaoDicTrimestral,
     compensacaoDicAnual,
     compensacaoDecMensal,
     compensacaoDecTrimestral,
     compensacaoDecAnual,
     compensacaoFicMensal,
     compensacaoFicTrimestral,
     compensacaoFicAnual,
     compensacaoFecMensal,
     compensacaoFecTrimestral,
     compensacaoFecAnual,
     compensacaoDMICMensal,
     compensacaoDMICTrimestral,
     compensacaoDMICAnual,
     multa, 
     juros,
     outros,
     faturaOk,
     id // id to update
   ];
   

  db.query(sql, values, (error, results, fields) => {
    if (error) {
      console.error('Error inserting new row into database: ', error)
      return error
    } else {
      console.log('results:', results)
    }
    res.redirect(`/listar-analises`) 
  })}
)

// EDITAR AJUSTE ---------------------------------------------------
app.post('/editar-ajuste', async (req, res) =>{
  const {
    id,
    cliente_id,
    unidadeConsumidora_id,
    tipoDeAjuste,
    analise,
    solicitacaoTexto,
    solicitacaoEscolha,
    dataDaSolicitacao,
    protocoloDaSolicitacao,
    statusDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
  } = req.body 

  
  client = (await getAjusteById(cliente_id))[0]
  console.log('body aqui:', req.body)
  console.log('client:', client)

  const sql = 
    `UPDATE ajustes SET
      nome = ?,
      unidadeConsumidora_id = ?,
      tipoDeAjuste = ?,
      analise = ?,
      solicitacaoTexto = ?,
      solicitacaoEscolha = ?,
      dataDaSolicitacao = ?,
      protocoloDaSolicitacao = ?,
      statusDaSolicitacao = ?,
      conclusaoDaSolicitacao = ?,
      dataDaConclusao = ?
    WHERE id = ?
    `

    const formatedeDataDaSolicitacao = dataDaSolicitacao ? new Date(dataDaSolicitacao).toISOString().split('T')[0] : null;
    const formateDataDaConclusao = dataDaConclusao ? new Date(dataDaConclusao).toISOString().split('T')[0] : null;

    const values = [
      client.nome,
      unidadeConsumidora_id,
      tipoDeAjuste,
      analise,
      solicitacaoTexto,
      solicitacaoEscolha,
      formatedeDataDaSolicitacao,
      protocoloDaSolicitacao,
      statusDaSolicitacao,
      conclusaoDaSolicitacao,
      formateDataDaConclusao,
      id
    ];
    
    console.log('values:', values)

    db.query(sql, values, (error, results, fields) => {
      if (error) {
        console.error('Error inserting new row into database: ', error)
        return error
      } else {
        console.log('results:', results)
      }
      res.redirect(`/listar-ajustes`) 
    })
  })

 //EDITAR REFATURAMENTO --------------------------------------------- 
app.post('/editar-refaturamento', async (req, res) =>{
    const {
      id,
      cliente_id,
      unidadeConsumidora_id,
      analise,
      solicitacaoTexto,
      solicitacaoOpcao,
      dataDaSolicitacao,
      protocoloDaSolicitacao,
      statusDaSolicitacao,
      conclusaoDaSolicitacao,
      dataDaConclusao
    } = req.body 

    
    client = (await getClientById(cliente_id))[0]
    console.log('body aqui:', req.body)
    console.log('client:', client)

    const sql = 
      `UPDATE refaturamento SET
        nome = ?,
        unidadeConsumidora_id = ?,
        analise = ?,
        solicitacaoTexto = ?,
        solicitacaoOpcao = ?,
        dataDaSolicitacao = ?,
        protocoloDaSolicitacao = ?,
        statusDaSolicitacao = ?,
        conclusaoDaSolicitacao = ?,
        dataDaConclusao = ?
      WHERE id = ?
      `;

      const formatedeDataDaSolicitacao = dataDaSolicitacao ? new Date(dataDaSolicitacao).toISOString().split('T')[0] : null;
      const formateDataDaConclusao = dataDaConclusao ? new Date(dataDaConclusao).toISOString().split('T')[0] : null;

      const values = [
        client.nome,
        unidadeConsumidora_id,
        analise,
        solicitacaoTexto,
        solicitacaoOpcao,
        formatedeDataDaSolicitacao,
        protocoloDaSolicitacao,
        statusDaSolicitacao,
        conclusaoDaSolicitacao,
        formateDataDaConclusao,
        id
      ];
      
      console.log('values:', values)

      db.query(sql, values, (error, results, fields) => {
        if (error) {
          console.error('Error inserting new row into database: ', error)
          return error
        } else {
          console.log('results:', results)
        }
        res.redirect(`/listar-refaturamentos`) 
      })
    })

app.post('/editar-cobrancaIndevida', async (req, res) =>{
  const {
    id,
    cliente_id,
    unidadeConsumidora_id,
    analise,
    solicitacaoTexto,
    solicitacaoOpcao,
    dataDaSolicitacao,
    protocoloDaSolicitacao,
    statusDaSolicitacao,
    conclusaoDaSolicitacao,
    dataDaConclusao
    } = req.body 
      
    client = (await getClientById(cliente_id))[0]
    console.log('body aqui:', req.body)
    console.log('client:', client)
  
    const sql = 
      `UPDATE cobrancaindevida SET
        nome = ?,
        unidadeConsumidora_id = ?,
        analise = ?,
        solicitacaoTexto = ?,
        solicitacaoOpcao = ?,
        dataDaSolicitacao = ?,
        protocoloDaSolicitacao = ?,
        statusDaSolicitacao = ?,
        conclusaoDaSolicitacao = ?,
        dataDaConclusao = ?
      WHERE id = ?
      `;
  
    const formatedeDataDaSolicitacao = dataDaSolicitacao ? new Date(dataDaSolicitacao).toISOString().split('T')[0] : null;
    const formateDataDaConclusao = dataDaConclusao ? new Date(dataDaConclusao).toISOString().split('T')[0] : null;

    const values = [
      client.nome,
      unidadeConsumidora_id,
      analise,
      solicitacaoTexto,
      solicitacaoOpcao,
      formatedeDataDaSolicitacao,
      protocoloDaSolicitacao,
      statusDaSolicitacao,
      conclusaoDaSolicitacao,
      formateDataDaConclusao,
      id
        ];
        
    console.log('values:', values)
  
    db.query(sql, values, (error, results, fields) => {
      if (error) {
        console.error('Error inserting new row into database: ', error)
          return error
            } else {
          console.log('results:', results)
          }
          res.redirect(`/listar-cobrancas`) 
        })
      })

//iniciando o server

  server.listen(port, () => {
       console.log(`Server listening on port ${port}`);
  });

//EXPORTANDO O APP
module.exports = app  
