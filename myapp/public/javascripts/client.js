var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");


function drawOnCanvas(player, position){
    var y=Math.floor(position/10);
    var x=Math.floor(position%10)-1;
    var blockSize = 70;

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
            context.arc(blockSize*x + 20, 650-(blockSize*y), 12, 0, Math.PI*2, false);
            context.fillStyle="red";
            context.fill();
            break;
        case 2:
            context.arc(blockSize*x + 50, 650 - (blockSize*y), 12, 0, Math.PI*2, false);
            context.fillStyle="blue";
            context.fill();
            break;
        case 3:
            context.arc(blockSize*x + 20, 680 - (blockSize*y), 12, 0, Math.PI*2, false);
            context.fillStyle="green";
            context.fill();
            break;
        case 4:
            context.arc(blockSize*x + 50, 680 - (blockSize*y), 12, 0, Math.PI*2, false);
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
    var rollDiceButton = document.getElementById("rollDiceButton");
    var statusText = document.getElementById("statusText");
    var colorText = document.getElementById("colorText");

    console.log("Starting a " + numPlayers + " player game");

    socket = new WebSocket("ws://localhost:3000");
    socket.onopen = function(){
        console.log("connected");
        socket.send(JSON.stringify({
                type: "initialize",
                numPlayers: numPlayers
        }));
        statusText.innerText = "Waiting for players";
        console.log("sent initlialize packet");
    }


    socket.onmessage = function(event){
        var json = JSON.parse(event.data);
        console.log(json);
        switch(json.type){
            case "roll":
                console.log("Server rolled " + json.roll);
                break;
            case "gameJoin":
                console.log("We are player " + json.playerTag + " in gameId " + json.gameId);
                playerTag = json.playerTag;
                if(playerTag != "A"){
                    rollDiceButton.disabled = true;
                }
                switch(json.playerTag){
                    case "A":
                        colorText.innerText = "Red";
                        break;
                    case "B":
                        colorText.innerText="Blue";
                        break;
                    case "C":
                        colorText.innerText="Green";
                        break;
                    case "D":
                        colorText.innerText="Black";
                        break;
                }
                gameId = json.gameId;
                break;
            case "gameUpdate":
                switch(json.gameState){
                    case "Ongoing":
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
                        break;
                    case "Completed":
                        statusText.innerText = "Player " + letterToColor(json.won) + " won";
                        rollDiceButton.hidden = true;
                        break;
                    case "Abandon":
                        console.log("player left");
                        
                        statusText.innerText = "A player left the game";
                        rollDiceButton.hidden = true;
                        break;
                }
                break;
            case "disableRoll":
                statusText.innerText = "Another players turn";
                rollDiceButton.disabled = true;
                break;
            case "enableRoll":
                statusText.innerText = "Your turn";
                rollDiceButton.hidden = false;
                rollDiceButton.disabled = false;
                break;
        }
    }
}

function letterToColor(input){
    switch(input){
        case "A":
            return "Red";
        case "B":
            return "Blue";
        case "C":
            return "Green";
        case "D":
            return "Black";
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

function quitGame(){

}


console.log("client.js reporting");