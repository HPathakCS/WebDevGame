var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//Draws the player circles on the canvas using the position.
function drawOnCanvas(player, position){
    if(position==100){
        context.beginPath();
        switch(player){
            case 1:
                context.arc(20, 20, 12, 0, Math.PI*2, false);
                context.fillStyle="red";
                context.fill();
            break;
            case 2:
                context.arc(50, 20, 12, 0, Math.PI*2, false);
                context.fillStyle="blue";
                context.fill();
            break;
            case 3:
                context.arc(20, 50, 12, 0, Math.PI*2, false);
                context.fillStyle="green";
                context.fill();
            break;
            case 4:
                context.arc(50, 50, 12, 0, Math.PI*2, false);
                context.fillStyle="black";
                context.fill();
            break;
        }
        context.closePath();
    }else{

        var y=Math.floor(position/10);
        var x=Math.floor(position%10)-1;
        var blockSize = 70;
    
        if(x===-1){
            if(y%2==0){
                x=0;
            }else{
                x=9;
            }
            y--;
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
}


function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

var socket;
var playerTag;
var gameId;
//Dice value picture
var dices = ['&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];
function startGame(numPlayers){
    //Getting stuff from the html so it can be changed.
    document.getElementById("playerButtons").remove();
    var rollDiceButton = document.getElementById("rollDiceButton");
    var statusText = document.getElementById("statusText");
    var colorText = document.getElementById("colorText");
    var diceLetter = document.getElementById("diceLetter");
    console.log("Starting a " + numPlayers + " player game");

    //Connect client to server
    socket = new WebSocket("ws://localhost:3000");
    //When connection open run the code inside.
    socket.onopen = function(){
        console.log("connected");
        //Once connection open tell server you want to play x player game
        socket.send(JSON.stringify({
                type: "initialize",
                numPlayers: numPlayers
        }));
        statusText.innerText = "Waiting for players";
        console.log("sent initlialize packet");
    }

    //Code runs when server sends msg.
    socket.onmessage = function(event){
        var json = JSON.parse(event.data);
        console.log(json);
        switch(json.type){
            //Server sends a roll dice msg.
            case "roll":
                diceLetter.innerHTML = dices[json.roll - 1];
                console.log("Server rolled " + json.roll);
                break;
            case "gameJoin":
            //Sent when you are added to a open lobby
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
            //When a player changes position in the game.
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
                        clearCanvas();
                        switch(json.won){
                            case "A":
                                drawOnCanvas(1, 100);
                                break;
                            case "B":
                                drawOnCanvas(2, 100);
                                break;
                            case "C":
                                drawOnCanvas(3, 100);
                                break;
                            case "D":
                                drawOnCanvas(4, 100);
                                break;
                        }
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
            //When not your turn disable
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

//Convert player number to player letter
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

//Tell the server to roll dice
function rollDice(){
    console.log("button click");
    socket.send(JSON.stringify({
        type: "rollDice",
        gameId: gameId,
        player: playerTag
    }));
};


//Functions to request fullscreen mode.
var fullscreenButton = document.documentElement;
function fullscreen(){
    if (fullscreenButton.requestFullscreen) {
        fullscreenButton.requestFullscreen();
        } else if (fullscreenButton.mozRequestFullScreen) { /* Firefox */
        fullscreenButton.mozRequestFullScreen();
        } else if (fullscreenButton.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        fullscreenButton.webkitRequestFullscreen();
        } else if (fullscreenButton.msRequestFullscreen) { /* IE/Edge */
        fullscreenButton.msRequestFullscreen();
        }
}


console.log("client.js reporting");