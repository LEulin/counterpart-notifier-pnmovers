var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exp = require('express');
var fs = require('fs');


var port = process.env.PORT || 3000;
var users = [];
var actualuser = '';
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/notify.html');
});

app.use(exp.static('public'));
const Lealyn = {
    "id": 1,
    "name": "Lealyn Eulin",
    "Batch": "2020B",
    "monthPaid": {
        "January": true,
        "February": true,
        "March": true,
        "April": true,
        "May": true,
        "June": true,
        "July": true,
        "August": true,
        "September": true,
        "October": true,
        "November": true,
        "December": false
    }
}
const Faye = {
    id: 1,
    name: "Faye Erika Catalvas",
    Batch: "2020B",
    monthPaid: {
        January: true,
        February: true,
        March: true,
        April: true,
        May: true,
        June: true,
        July: true,
        August: true,
        September: true,
        October: true,
        November: true,
        December: false
    }
}
var Jericho = {
    id: 1,
    name: "Jericho James Villahermosa",
    Batch: "2020B",
    monthPaid: {
        January: true,
        February: true,
        March: true,
        April: true,
        May: true,
        June: true,
        July: true,
        August: true,
        September: true,
        October: true,
        November: true,
        December: false
    }
}

var users = [Lealyn,Faye,Jericho];
var online_users = [];
io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        users.forEach(element => {
            if (element.username == msg.username) {
                msg = { username: msg.username, msg: msg.msg, source: element.source }
            }
        });
        io.emit('chat message', msg);
    });

    socket.on('broadcast', function(data) {
        io.emit('broadcast', data)
    })

    socket.on('online', function(data) {
        if (!online_users.find( user => user.username === data.username )) {
            online_users.push({username: data.username, text: "Paid"});
        }
        console.log(data);
        
        console.log(online_users);
        
        io.emit('online', online_users);
    });

    socket.on("typing", function(data) {
        io.emit("typing", data);
    });

    socket.on("paid",async function(data) {
        let user = data.username.toLowerCase()
        if(user == "jericho"){
            Jericho.monthPaid.December = true
            io.emit("payment", {username:data.username, name:Jericho.name, month:"December"})
        }else if(user == "faye"){
            Faye.monthPaid.December = true
            io.emit("payment", {username:data.username,name:Faye.name, month:"December"})
        }else if(user == "lealyn"){
            Lealyn.monthPaid.December = true
            io.emit("payment", {username:data.username,name:Lealyn.name, month:"December"})
        }
        await online_users.forEach(element=>{
            if(element.username == data.username){
                element.text = "Done"
            }
        })
        io.emit('online', online_users);
    });

    socket.once('disconnect', function() {        
        for (let i = 0; i < users.length; ++i) {
            if (users[i].username == actualuser) {
                users.splice(i, 1);
            }
        }
        io.emit('logout', users)
    })

});

http.listen(port, function() {
    console.log('listening on ***:' + port);
});