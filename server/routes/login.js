const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({email: body.email}, (err, userDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if ( !userDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }
       if ( !bcrypt.compareSync( body.password, userDB.password )) {
           return res.status(400).json({
               ok: false,
               err: {
                   message: 'Usuario o (contraseña) incorrectos'
               }
           });
       }

       let token = jwt.sign({
           user: userDB
       }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN });

       res.json({
           ok: true,
           user: userDB,
           token
       });
    });
});

module.exports = app;
