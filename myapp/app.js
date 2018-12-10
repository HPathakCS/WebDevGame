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

app.get("/play", indexRouter);
app.get("/*", indexRouter);

var games = [];
var board = [];
initializeBoard();

// var game = {
//     numPlayers: value,
//     playerA: value, //Websocket of player
//     playerB: value,
//     playerC: value,
//     playerD: value,
//     playerAPos: value, //Position of players
//     playerBPos: value,
//     playerCPos: value,
//     playerDPos: value,
//     currentTurn; //"A", "B", "C", "D"
//     winner: 
//     gameState: //"Completed", "Waiting", "Ongoing", "Abandon"
// }

socketServer.on("connection", function(ws){
    kek();
    console.log("Connection made");
    ws.on("message", function incoming(message) {
        var msg = JSON.parse(message);
        switch(msg.type){
            case "rollDice":
            var game = games[msg.gameId];
            var diceResult = rollRandomDice();
            ws.send(JSON.stringify({
                type: "roll",
                roll: diceResult
            }));
            var currPos;
            switch(msg.player){
                    case "A":
                        currPos = game.playerAPos;
                        game.playerAPos = (validateMove(currPos + diceResult) === -2) ? currPos:validateMove(currPos+diceResult);
                        break;
                    case "B":
                        currPos = game.playerBPos;
                        game.playerBPos = (validateMove(currPos + diceResult) === -2) ? currPos:validateMove(currPos+diceResult);
                        break;
                    case "C":
                        currPos = game.playerCPos;
                        game.playerCPos = (validateMove(currPos + diceResult) === -2) ? currPos:validateMove(currPos+diceResult);
                        break;
                    case "D":
                        currPos = game.playerDPos;
                        game.playerDPos = (validateMove(currPos + diceResult) === -2) ? currPos:validateMove(currPos+diceResult);
                        break;
                }
                switch(game.numPlayers){
                    case 2:
                        if(game.playerAPos == 100){
                            game.winner = "A";
                            game.gameState = "Completed";
                        }else if(game.playerBPos == 100){
                            game.winner = "B"
                            game.gameState = "Completed";
                        }else{
                            game.winner = -1;
                        }
                        var gameUpdate = JSON.stringify({
                            type: "gameUpdate",
                            playerAPos: game.playerAPos,
                            playerBPos: game.playerBPos,
                            won: game.winner,
                            gameState: game.gameState
                         });
                        game.playerA.send(gameUpdate);
                        game.playerB.send(gameUpdate);
                        if(game.winner == -1){
                            if(game.CurrentTurn == "A"){
                                game.playerA.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerB.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.CurrentTurn = "B";
                            }else{
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerA.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.CurrentTurn = "A";
                            }
                        }
                        break;
                    case 3:
                        if(game.playerAPos == 100){
                            game.winner = "A";
                            game.gameState = "Completed";
                        }else if(game.playerBPos == 100){
                            game.winner = "B"
                            game.gameState = "Completed";
                        }else if(game.playerCPos == 100){
                            game.winner = "C";
                            game.gameState = "Completed";
                        }else{
                            game.winner = -1;
                        }
                        if(game.playerAPos == 100 || game.playerBPos == 100 || game.playerCPos == 100){
                            won = true;
                        }
                        var gameUpdate = JSON.stringify({
                            type: "gameUpdate",
                            playerAPos: game.playerAPos,
                            playerBPos: game.playerBPos,
                            playerCPos: game.playerCPos,
                            won: game.winner,
                            gameState: game.gameState
                        });
                        game.playerA.send(gameUpdate);
                        game.playerB.send(gameUpdate);
                        game.playerC.send(gameUpdate);
                        if(game.winner == -1){
                            if(game.CurrentTurn == "A"){
                                game.playerA.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerB.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerC.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "B";
                            }else if(game.CurrentTurn == "B"){
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerC.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "C";
                            }else{
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerA.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerC.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "A";
                            }
                        }
                        break;
                    case 4:
                        if(game.playerAPos == 100){
                            game.winner = "A";
                            game.gameState = "Completed";
                        }else if(game.playerBPos == 100){
                            game.winner = "B";
                            game.gameState = "Completed";
                        }else if(game.playerCPos == 100){
                            game.winner = "C";
                            game.gameState = "Completed";
                        }else if(game.playerDPos == 100){
                            game.winner = "D";
                            game.gameState = "Completed";
                        }else{
                            game.winner = -1;
                        }
                        var gameUpdate = JSON.stringify({
                            type: "gameUpdate",
                            playerAPos: game.playerAPos,
                            playerBPos: game.playerBPos,
                            playerCPos: game.playerCPos,
                            playerDPos: game.playerDPos,
                            won: game.winner,
                            gameState: game.gameState
                        });
                        game.playerA.send(gameUpdate);
                        game.playerB.send(gameUpdate);
                        game.playerC.send(gameUpdate);
                        game.playerD.send(gameUpdate);
                        if(game.winner == -1){
                            if(game.CurrentTurn == "A"){
                                game.playerB.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerA.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerC.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerD.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "B";
                            }else if(game.CurrentTurn == "B"){
                                game.playerC.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerA.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerD.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "C";
                            } else if(game.CurrentTurn == "C"){
                                game.playerD.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerA.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerC.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "D";
                            }   else{
                                game.playerA.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                                game.playerD.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerB.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.playerC.send(JSON.stringify({
                                    type: "disableRoll"
                                }));
                                game.CurrentTurn = "A";
                            }
                        }
                        break;
                }
                break;
            case "initialize":
                var found = false;
                for (let index = 0; index < games.length; index++) {
                    const element = games[index];  
                    if(element.gameState == "Waiting" && element.numPlayers == msg.numPlayers){
                        if(element.playerA == -1){
                            element.playerA = ws;
                            ws.send(JSON.stringify({
                                type: "gameJoin",
                                gameId: index,
                                playerTag: "A"
                            }));
                            found = true;
                        }else if(element.playerB == -1){
                            element.playerB = ws;
                            ws.send(JSON.stringify({
                                type: "gameJoin",
                                gameId: index,
                                playerTag: "B"
                            }));
                            if(element.numPlayers == 2){
                                element.playerC = -2;
                                element.playerD = -2;
                                element.gameState = "Ongoing";
                                element.playerA.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                            }
                            found = true;
                        }else if(element.playerC == -1){
                            element.playerC = ws;
                            ws.send(JSON.stringify({
                                type: "gameJoin",
                                gameId: index,
                                playerTag: "C"
                            }));
                            if(element.numPlayers == 3){
                                element.playerD = -2;
                                element.gameState = "Ongoing";
                                element.playerA.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                            }
                            found = true;
                        }else if(element.playerD == -1){
                            element.playerD = ws;
                            ws.send(JSON.stringify({
                                type: "gameJoin",
                                gameId: index,
                                playerTag: "D"
                            }));
                            if(element.numPlayers == 4){
                                element.gameState = "Ongoing";
                                element.playerA.send(JSON.stringify({
                                    type: "enableRoll"
                                }));
                            }
                            found = true;
                        }
                    }
                };
                if(!found){
                    games.push({
                        numPlayers: msg.numPlayers,
                        playerA: ws, //Websocket of player
                        playerB: -1,
                        playerC: -1,
                        playerD: -1,
                        playerAPos: 1, //Position of players
                        playerBPos: 1,
                        playerCPos: 1,
                        playerDPos: 1,
                        CurrentTurn: "A",
                        winner: -1,
                        gameState: "Waiting"
                    });

                    ws.send(JSON.stringify({
                        type: "gameJoin",
                        gameId: games.length -1,
                        playerTag: "A"
                    }));
                }
                break;
                
        }
        console.log("[LOG] " + message);
    });

    ws.on("close", function(kek){
        console.log("player left");
        for (let index = 0; index < games.length; index++) {
            const game = games[index];
            if(game.winner == -1){
                console.log("left ongoing game");
                if(game.playerA == ws){
                    console.log("player A Left");
                    game.gameState  = "Abandon";
                    try {
                        game.playerB.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerC.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerD.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                    } catch (error) {
                        
                    }
                }else if(game.playerB == ws){
                    game.gameState = "Abandon";
                    try {
                        game.playerA.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerC.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerD.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                    } catch (error) {
                        
                    }
                }else if(game.playerC == ws){
                    game.gameState = "Abandon";
                    try {
                        game.playerB.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerA.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerD.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                    } catch (error) {
                        
                    }
                }else if(game.playerD == ws){
                    game.gameState = "Abandon";
                    try {
                        game.playerB.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerC.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                        game.playerA.send(JSON.stringify({
                            type: "gameUpdate",
                            gameState: game.gameState
                        }));
                    } catch (error) {
                        
                    }
                }
            }
        }
    })
});

function rollRandomDice(){
    return Math.floor(Math.random() * 6) + 1;
}

function initializeBoard(){
    for (let index = 0; index < 100; index++) {
        board[index] = -1;
    }

    // //Testing
    // board[2]=99;board[3]=99;board[4]=99;board[5]=99;board[6]=99;board[7]=99;

    //snakes
    board[99]=21; board[95]=75; board[93]=89; board[78]=25; board[52]=28; board[16]=8;
    //ladders
    board[2]=45; board[4]=27; board[9]=31; board[47]=84; board[70]=87; board[71]=91;
}

var i_kek = 0;
function kek(input){
    var str = (input) ? input:i_kek++;
    console.log("kek " + str);
}

function validateMove(position){
    if(position < 100){
        if(board[position] == -1){
            return position;
        }else{
            return board[position];
        }
    }else if(position == 100){
        return 100;
    }else{
        return -2;
    }
}

server.listen(port);