'use strict'

let canvas=document.getElementById('canvas');
let ctx= canvas.getContext('2d');
let background=null;
let playerImg=null;
let scrollH=0;
let scrollV=0;
let framse=0;
let playerDirection={};


function getKeys(){
    let keys={};
    window.onkeydown=function(e){
        keys[e.key]=true;
    }
    window.onkeyup=function(e){
        keys[e.key]=false;
    }
    return keys;
}
let keys=getKeys();

function loadImage(url){
    let img= new Image();
    img.src=url;
    return new Promise(function (resolve,reject) {
        img.onload=function(){
            resolve(img)
        }
    })
}
let fondoJuego={
    posicionY:256,
    posicionX:240,
}
let player={
    posx:fondoJuego.posicionX/2,
    posy:192,
    width:40,
    height:50,
   
}

let marioIzqu={
    posx:177,
    posy:88
}
let marioDer={
    posx:337,
    posy:90,
}
playerDirection=marioIzqu;

function update(){

if(keys['ArrowLeft']){
    
    playerDirection=marioIzqu;
    player.posx-=5
}
if(keys['ArrowRight']){
    playerDirection=marioDer;
    /*player.posx+=1;*/
    scrollH+=1
}
if(keys['ArrowUp']){
    player.posy-=5
}
if(keys['ArrowDown']){
    player.posy+=5
}
if(keys['z']){
    scrollH-=2
}
if(keys['x']){
    scrollH+=2
}
if(keys['q']){
    scrollV-=2
}
if(keys['a']){
    scrollV+=2
}

}

function draw(){
    //esto es el fondo
   ctx.drawImage(background,scrollH,scrollV,fondoJuego.posicionY,fondoJuego.posicionX,0,0, fondoJuego.posicionY,fondoJuego.posicionX)

   //personaje
    ctx.drawImage(playerImg, playerDirection.posx, playerDirection.posy, 18,18, player.posx, player.posy, 18,18 )
   //ctx.beginPath();
    //ctx.rect(player.posx,player.posy,player.width,player.height);
    //ctx.fill();
}
function mainLoop(){
    frames++;
    //Actualitzar el mon (entitats, controls..)
    update();
    //Dibuixar els elements dle joc
    ctx.save()
    ctx.scale(2.5,2.5)
    draw();
    ctx.restore();
    requestAnimationFrame(mainLoop);
}

async function main(){
// inicialitzacions
background = await loadImage('imgs/bg-1-1.png')
playerImg=await loadImage('imgs/mario.png')

//bucl principal(60fps)
mainLoop()
}

main();