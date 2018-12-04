var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");

var port = process.argv[2];
var app = express();
var server = http.createServer(app);

const WebSocket = require('ws');
const socketServer = new WebSocket.Server({ server });


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/splash", indexRouter);
app.get("/play", indexRouter);



socketServer.on("connection", function(ws){
    console.log("Connection made");
    ws.on("message", function incoming(message) {
        var msg = JSON.parse(message);
        switch(msg.type){
            case "rollDice":
                var player = msg.player;
                ws.send(JSON.stringify({
                    type: "roll",
                    roll: rollRandomDice()
                }));
        }
        console.log("[LOG] " + message);
    });
});

function rollRandomDice(){
    return Math.floor(Math.random() * 6) + 1;
}

server.listen(port);

