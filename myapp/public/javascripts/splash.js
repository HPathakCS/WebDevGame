if(!document.cookie == 0){
    document.cookie++;
}else{
    document.cookie = 0;
}

var cookieText = document.getElementById("cookie");
cookieText.innerText = "You visited this page " + document.cookie + " times";
console.log(document.cookie);