const mysql = require('mysql')

const db = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "crmdb"
});

db.connect((err) => {
    if (err)
        return console.error("Não foi possivel conectar ao banco de dados"  + err.stack);
        
        console.log("Conectado ao banco de dados");
});

module.exports = db;
