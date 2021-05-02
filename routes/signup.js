var express = require('express');
// var app = express();
var router = express.Router();
var path = require('path');
const connection = require('../utill/mysql');
const bcrypt = require('bcrypt');

router.get('/', function(req, res) {
    if ( !req.session.user ) {
        res.sendFile(path.join(__dirname, '../public/signup.html'));
    } else {
        res.redirect('/');
    }
});

router.post('/', function(req, res) {
    const saltRounds = 10;
    const encryptPassword = bcrypt.hashSync(req.body.password, saltRounds);

    var intputData = {
        email : req.body.email,
        name : req.body.name,
        pw : encryptPassword
    };

    var query = connection.query('select * from user where email = ?', [intputData.email], function(err, rows) {
        if (err) {
            res.status(500).json(err);
        }

        if (rows.length) {
            res.json( {success : false} );
        } else {
            var query = connection.query('insert into user set ?', [intputData], function(err, rows) {
                if (err) {
                    res.status(500).json(err);
                }

                req.session.user = {
                    email : intputData.email,
                    name : intputData.name
                };

                res.cookie('login_name', req.session.user.name, {

                });

                res.json( {success : true} );
            });
        }
    });
});

module.exports = router;