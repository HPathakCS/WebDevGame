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

drawOnCanvas(1,99);
drawOnCanvas(2,25);
drawOnCanvas(3,32);
drawOnCanvas(4,49);


var socket = new WebSocket("ws://localhost:3000");
function rollDice(){
    console.log("button click");
        socket.send(JSON.stringify({
            type: "rollDice",
            player: "A"
        }));
};

socket.onopen = function(){
    console.log("connected");
}


socket.onmessage = function(event){
    var json = JSON.parse(event.data);
    switch(json.type){
        case "roll":
            console.log("Server rolled " + json.roll);
    }
}
    

console.log("client.js reporting");