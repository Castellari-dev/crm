const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const db = require('../config/config.js');

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
  db.query(
    `SELECT * FROM cadastro WHERE email = ?`,
    [email],
    (err, rows) => {
      if (err) return done(err);

      if (!rows.length) return done('Usuário não encontrado.');

      return done(null, rows[0]);
    }
  );
});

passport.use('login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'senha',
      passReqToCallback: true,
      session: true
    },
    (req, email, password, done) => {
      db.query(
        `SELECT * FROM cadastro WHERE email = ? AND senha = ?`,
        [email, password],
        (err, rows) => {
          if(err) return done(err)
          
          if(!rows.length) return done('Usuário ou senha inválidos.')

          return done(null, rows[0])
        }
      )
    }
  )
)