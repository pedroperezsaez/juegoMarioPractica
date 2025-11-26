'use strict'

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let background = null;
let playerImg = null;
let scrollH = 0;
let scrollV = 0;
let frames = 0;
let playerDirection = {};
let velocidadCanvas = {};
let animacion = 0;
let playerPositionY = 192;
let saltando = false;
let saltoAltura = 0;
let collision_object={
    x: 447,
    y:175,
    w:480-447,
    h:209-175,
}

function getKeys() {
    let keys = {};
    window.onkeydown = function (e) {
        keys[e.key] = true;
    }
    window.onkeyup = function (e) {
        keys[e.key] = false;
    }
    return keys;
}
let keys = getKeys();

function loadImage(url) {
    let img = new Image();
    img.src = url;
    return new Promise(function (resolve, reject) {
        img.onload = function () {
            resolve(img)
        }
    })
}
let fondoJuego = {
    posicionY: 256,
    posicionX: 240,
}
let player = {
    posx: fondoJuego.posicionX / 2,
    posy: 192,
    width: 18,
    height:18,
   
    onground:true,
    dir: 'Q',
    vy:0,

}





let marioIzqu = {
    posx: 177,
    posy: 88
}
let marioDer = {
    posx: 216,
    posy: 88,
}
let marioCaminandoDer = {
    posx: 255,
    posy: 88,
}
let marioCaminandoIzq = {
    posx: 134,
    posy: 88,
};
playerDirection = marioDer;

function marioMovimientoDer() {
    if (animacion < 10) {
        playerDirection = marioDer;

    } else if (animacion >= 10 && animacion < 20) {
        playerDirection = marioCaminandoDer;
    } else {
        animacion = 0;
    }
    if(!keys['ArrowRight']){
        playerDirection = marioDer;
        player.dir = 'R'
    }
}

function marioMovimientoIzq() {

    if (animacion < 10) {
        playerDirection = marioIzqu;

    } else if (animacion >= 10 && animacion < 20) {
        playerDirection = marioCaminandoIzq;
    } else {
        animacion = 0;
    }
    
}

/*function salto() {
    if (!saltando) {
        saltando = true;
        saltoAltura = -5;

    }

}
//tengo que seguir mirando aqui
let alturaMaximaDeSalto = 100;
function saltoYBajada() {
    player.posy = player.posy + saltoAltura;
    console.log(player.posy)

    if (player.posy <= alturaMaximaDeSalto) {
        player.posy = playerPositionY;
        saltando = false;player
        saltoAltura = 0;
    }


}
    */




function pararArrancarCanvas() {
    if (((player.posx) - (fondoJuego.posicionX / 2)) < 0) {
        player.posx += 3
    } else {
        scrollH += 2;
        player.posx+=2
    }
}
function collisions(){
let xmina = player.posx
let xmaxa = xmina + player.width
let ymina=player.posy
let ymaxa=ymina+player.height
let xminb=collision_object.x
let xmaxb= xminb+collision_object.w
let yminb= collision_object.y
let ymaxb= yminb+collision_object.h
if(ymaxa<yminb ||ymaxb < ymina) return false;
if(xmaxa < xminb || xmaxb< xmina) return false;
return true;
}

function update() {

if(collisions()){
    console.log("colision")
   player.posx= collision_object.x - player.width-0.1
}

    player.dir = 'Q'
    if (keys['ArrowLeft']) {
        player.dir = 'L'
        marioMovimientoIzq();
        player.posx -= 1;
    }

    if (keys['ArrowRight']) {
        player.dir = 'R'
        marioMovimientoDer()
        pararArrancarCanvas();
        
       
    }
   if (keys['ArrowUp']) {
    if (player.onground) {
        player.vy = -6.4;   
        player.onground = false;
    }
}

if (!player.onground) {
    player.vy += 0.3;      
}

player.posy += player.vy;


if (player.posy >= 192) {
    player.posy = 192;
    player.onground = true;
    player.vy = 0;
}
    
    if (keys['z']) {
        velocidadCanvas.izquierda;
    }
    if (keys['x']) {
        scrollH += 2
    }
    if (keys['q']) {
        scrollV -= 2
    }
    if (keys['a']) {
        scrollV += 2
    }

}

function draw() {
    //esto es el fondo
  
    ctx.drawImage(background, scrollH, scrollV, fondoJuego.posicionY, fondoJuego.posicionX, 0, 0, fondoJuego.posicionY, fondoJuego.posicionX)

    //personaje
    ctx.drawImage(playerImg, playerDirection.posx, playerDirection.posy, 18, 18, player.posx, player.posy, 18, 18)
    //ctx.beginPath();
    //ctx.rect(player.posx,player.posy,player.width,player.height);
    //ctx.fill();
    
}

const FRAMETIME = 16;
let startTime = null;
let lag=0;

function mainLoop(timestamp) {
    if (timestamp === undefined) {
        requestAnimationFrame(mainLoop);
        return;
    }
    if (startTime == null) startTime = timestamp
    let delta = timestamp - startTime
    startTime = timestamp
    lag+=delta;

    while (lag > FRAMETIME) {
        update();
        lag -= FRAMETIME;
    }

    //saltoYBajada()
    animacion++;
    frames++;
    //Actualitzar el mon (entitats, controls..)

    //Dibuixar els elements dle joc
    ctx.save()
    ctx.scale(2.5, 2.5)
    draw();
    ctx.restore();
    requestAnimationFrame(mainLoop);
}

async function main() {
    // inicialitzacions
    background = await loadImage('imgs/bg-1-1.png')
    playerImg = await loadImage('imgs/mario.png')

    //bucl principal(60fps)
    mainLoop()
}

main();