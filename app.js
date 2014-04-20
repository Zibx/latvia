#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
//GLOBAL.createBG = true;
GLOBAL.debug = false;
process.argv.slice(2).forEach( function( param ){
    param = param.replace(/^-*/, '' ).trim();
    if( param === 'debug' )
        GLOBAL.debug = true;
});
var debug = GLOBAL.debug;
console.log('DEBUG MODE '+ (debug ? 'ON': 'OFF'));
!debug && process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log('ALARM!', err);
});

require('./js/Z');
require('./js/UUID');
var tpl = require('./js/tpl' ),
    t = tpl.renderers,
    w = GLOBAL.w = require('./js/widgets')({tpl: tpl});

require('./js/api');
require('./js/App');

api.init('./api/');

//setInterval( function(  ){
tpl.loadAll('views');
//},3000);

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'qazaq1',
    database : 'latvia'
});

connection.connect();
GLOBAL.db = connection;




var express = require('express');
var app = express();

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

app.use( express.static(__dirname + '/public') );

app.use( express.cookieParser() );
var Context = GLOBAL.Context = function( cfg ){
    Z.apply( this, cfg );
};
Context.prototype = {t: t};
app.get('/', function(req, res){
    debug && tpl.loadAll('views');
    api.authorize.getUserByHash({hash:req.cookies.u}, function( user ){
        var out;
        var context = new Context({
            user: user,
            wFactory: w.factory()
        });
        context.wFactory.exportTpl('menu');
        context.wFactory.exportTpl('bottomMenu');

        context.wFactory.exportTpl('subMenu');
        if( user )//{
            context.wFactory.js += 'Z.user.data='+JSON.stringify(user)+';';

        var outData = {
            title: 'Billingrad',
            content: ''//vm.authorize(context)
        };
        outData.js = context.wFactory.js;
        out = t.mainTemplate(outData);
        //}
        res.send( out );
    });

});


app.get('/api/*', api.resolve.bind(api));
app.post('/api/*', api.resolve.bind(api));
