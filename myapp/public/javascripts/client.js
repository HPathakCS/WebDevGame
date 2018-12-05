var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");



function drawOnCanvas(player, position){
    var y=Math.floor(position/10);
    var x=Math.floor(position%10)-1;
    var blockSize = 90;

    if(x===-1){
        if(y%2==0){
            x=0;
        }else{
            x=9;
            y--;
        }
    }else if(y%2!=0){
        x=9-x;
    }

    context.beginPath();
    switch(player){
        case 1:
            context.arc(blockSize*x + 25, 835-(blockSize*y), 15, 0, Math.PI*2, false);
            context.fillStyle="red";
            context.fill();
            break;
        case 2:
            context.arc(blockSize*x + 65, 835 - (blockSize*y), 15, 0, Math.PI*2, false);
            context.fillStyle="blue";
            context.fill();
            break;
        case 3:
            context.arc(blockSize*x + 25, 875 - (blockSize*y), 15, 0, Math.PI*2, false);
            context.fillStyle="green";
            context.fill();
            break;
        case 4:
            context.arc(blockSize*x + 65, 875 - (blockSize*y), 15, 0, Math.PI*2, false);
            context.fillStyle="black";
            context.fill();
            break;
    }
        context.closePath();
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

var socket;
var playerTag;
var gameId;
function startGame(numPlayers){
    document.getElementById("playerButtons").remove();
    console.log("Starting a " + numPlayers + " player game");
    
    drawOnCanvas(1,0);
    drawOnCanvas(2,0);
    drawOnCanvas(3,0);
    drawOnCanvas(4,0);

    socket = new WebSocket("ws://localhost:3000");
    socket.onopen = function(){
        console.log("connected");
        socket.send(JSON.stringify({
                type: "initialize",
                numPlayers: numPlayers
        }));
    }


    socket.onmessage = function(event){
        var json = JSON.parse(event.data);
        switch(json.type){
            case "roll":
                console.log("Server rolled " + json.roll);
                break;
            case "gameJoin":
                console.log("We are player " + json.playerTag + " in gameId " + json.gameId);
                playerTag = json.playerTag;
                gameId = json.gameId;
                break;
            case "gameUpdate":
                switch(numPlayers){
                    case 2:
                        clearCanvas();
                        drawOnCanvas(1, json.playerAPos);
                        drawOnCanvas(2, json.playerBPos);
                        break;
                    case 3:
                        clearCanvas();
                        drawOnCanvas(1, json.playerAPos);
                        drawOnCanvas(2, json.playerBPos);
                        drawOnCanvas(3, json.playerCPos);
                        break;
                    case 4:
                        clearCanvas();
                        drawOnCanvas(1, json.playerAPos);
                        drawOnCanvas(2, json.playerBPos);
                        drawOnCanvas(3, json.playerCPos);
                        drawOnCanvas(4, json.playerDPos);
                        break;

                }

        }
    }
}

function rollDice(){
    console.log("button click");
    socket.send(JSON.stringify({
        type: "rollDice",
        gameId: gameId,
        player: playerTag
    }));
};



console.log("client.js reporting");