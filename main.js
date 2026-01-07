'use strict';

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
let jugadorMuerto = false;

let temporizadorMuerte = null;

function getKeys() {
  let keys = {};
  window.onkeydown = function (e) {
    keys[e.key] = true;
  };
  window.onkeyup = function (e) {
    keys[e.key] = false;
  };
  return keys;
}

let keys = getKeys();

function loadImage(url) {
  let img = new Image();
  img.src = url;
  return new Promise(function (resolve, reject) {
    img.onload = function () {
      resolve(img);
    };
  });
}

let fondoJuego = {
  posicionY: 256,
  posicionX: 240,
};

let player = {
  posx: 1300,
  posy: 192,
  //posx: 1300,
  width: 18,
  height: 18,
  onground: true,
  dir: 'Q',
  vy: 0,
};

let camera = {
  x: 0,
  y: 0,
  width: fondoJuego.posicionX / 2,
  height: fondoJuego.posicionY,
};


/*
  function updateCamera() {
  let margenX = 30;
  let margenY = 60;

 if (player.posx - camera.x > camera.width) {
    camera.x = player.posx - (camera.width );
  }
  if (player.posx - camera.x < camera.width) {
   camera.x = player.posx - (camera.width );
  }

  if (player.posy - camera.y > camera.height - margenY) {
    camera.y = player.posy - (camera.height - margenY);
  }
  if (player.posy - camera.y < margenY) {
    camera.y = player.posy - margenY;
  }
}
  */

let haUsadoTunel = false;
  function updateCamera() {
  let margenX = 30;
  let margenY = 60;

 if (player.posx - camera.x > camera.width) {
    camera.x = player.posx - (camera.width );
  }
  if (player.posx - camera.x < camera.width) {
   camera.x = player.posx - (camera.width );
  }
  if(haUsadoTunel){
    camera.y = 240;
    camera.x=767; 
  }
  if(!haUsadoTunel){
    camera.y=0;
  }
}


let marioIzqu = { posx: 177, posy: 88 };
let marioDer = { posx: 216, posy: 88 };
let marioCaminandoDer = { posx: 255, posy: 88 };
let marioCaminandoIzq = { posx: 134, posy: 88 };

playerDirection = marioDer;

function marioMovimientoDer() {
  if (animacion < 10) {
    playerDirection = marioDer;
  } else if (animacion >= 10 && animacion < 20) {
    playerDirection = marioCaminandoDer;
  } else {
    animacion = 0;
  }
  if (!keys['ArrowRight']) {
    playerDirection = marioDer;
    
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

let enemigoImg = null;
let enemigoDireccion = {};
let enemigoAnimacion = 0;

let enemigo = {
  posx: 1503,
  posy: 192,
  width: 30,
  height: 100,
  velocidadX: 1.5,
  dir: 'Derecha',
  inicioX: 1503,
  finX: 2065,
};

function estaColisionandoJugadorConEnemigo(player, enemigo) {

  const jugadorIzq = player.posx;
  const jugadorDer = player.posx + player.width;
  const jugadorArr = player.posy;
  const jugadorAbj = player.posy + player.height;

  const enemigoIzq = enemigo.posx;
  const enemigoDer = enemigo.posx + enemigo.width;
  const enemigoArr = enemigo.posy;
  const enemigoAbj = enemigo.posy + enemigo.height;

  
  if (jugadorAbj < enemigoArr) return false;
  if (enemigoAbj < jugadorArr) return false;
  if (jugadorDer < enemigoIzq) return false;
  if (enemigoDer < jugadorIzq) return false;

  
  return true;
}

let enemigoIzquierda = { posx: 115, posy: 39 };
let enemigoDerecha = { posx: 115, posy: 39 };
let enemigoCaminandoIzquierda = { posx: 134, posy: 39 };
let enemigoCaminandoDerecha = { posx: 134, posy: 39 };

enemigoDireccion = enemigoDerecha;

function enemigoMovimiento() {
  if (enemigoAnimacion < 10) {
    enemigoDireccion = enemigoDerecha;
  } else if (enemigoAnimacion >= 10 && enemigoAnimacion < 20) {
    enemigoDireccion = enemigoCaminandoDerecha;
  } else {
    enemigoAnimacion = 0;
  }
}

/*
function enemigoMovimientoIzq() {
  if (enemigoAnimacion < 10) {
    enemigoDireccion = enemigoIzquierda;
  } else if (enemigoAnimacion >= 10 && enemigoAnimacion < 20) {
    enemigoDireccion = enemigoCaminandoIzquierda;
  } else {
    enemigoAnimacion = 0;
  }
}
*/

function moverEnemigo() {
  if (enemigo.dir == 'Derecha') {
    enemigo.posx += enemigo.velocidadX;
    enemigoMovimiento();
    if (enemigo.posx >= enemigo.finX) {
      enemigo.dir = 'Izquierda';
    }
  } else if (enemigo.dir == 'Izquierda') {
    enemigo.posx -= enemigo.velocidadX;
    enemigoMovimiento();
    if (enemigo.posx <= enemigo.inicioX) {
      enemigo.dir = 'Derecha';
    }
  }
  enemigoAnimacion++;
}

function hayChoque(mario, bloque) {
  const choqueHorizontal =
    mario.posx < bloque.x + bloque.width && mario.posx + mario.width > bloque.x;

  const choqueVertical =
    mario.posy < bloque.y + bloque.height &&
    mario.posy + mario.height > bloque.y;

  return choqueHorizontal && choqueVertical;
}

function update() {
  final();
  tunelSuperficie();
  tunelSubsuelo();
  moverEnemigo();

  if (estaColisionandoJugadorConEnemigo(player, enemigo) || (player.posy >= 237 && player.posy<=300   )) {
    jugadorMuerto = true;
  }

  let posicionAnteriorX = player.posx;

  if (keys['ArrowLeft']) {
    player.posx -= 2;
    marioMovimientoIzq();
  }

  if (keys['ArrowRight']) {
    player.posx += 2;
    marioMovimientoDer();
  }

  for (let i = 0; i < listaDeBloques.length; i++) {
    let bloque = listaDeBloques[i];
    if (hayChoque(player, bloque)) {
      player.posx = posicionAnteriorX;
    }
  }

  if (keys['ArrowUp'] && player.onground) {
    player.vy = -7;
    player.onground = false;
  }

  player.vy += 0.3;
  player.posy += player.vy;

  for (let i = 0; i < listaDeBloques.length; i++) {
    let bloque = listaDeBloques[i];
    if (hayChoque(player, bloque)) {
      if (player.vy > 0) {
        player.posy = bloque.y - player.height;
        player.vy = 0;
        player.onground = true;
      } else if (player.vy < 0) {
        player.posy = bloque.y + bloque.height;
        player.vy = 0;
      }
    }
  }
  updateCamera();
}

function tunelSuperficie() {
  if (keys['ArrowDown'] && player.posx >= 910 && player.posx <= 942) {
    player.posx = 789;
    player.posy = 443;
    haUsadoTunel=true;
  }
}

function tunelSubsuelo() {
  if (
    keys['ArrowRight'] &&
    player.posx >= 955 &&
    player.posx <= 975 &&
    player.posy >= 416 &&
    player.posy <= 447
  ) {
    player.posx = 2619;
    player.posy = 173;
    haUsadoTunel=false;
    
  }
}

function final() {
  if (player.posx >= 3167) {
    juegoTerminado = true;
  }
}

function draw() {
  ctx.fillStyle = 'green';
  ctx.fillRect(enemigo.posx, enemigo.posy, enemigo.width, enemigo.height);

  //fondo
  ctx.drawImage(
    background,
    camera.x,
    camera.y,
    canvas.width,
    canvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  //jugador
  ctx.drawImage(
    playerImg,
    playerDirection.posx,
    playerDirection.posy,
    18,
    18,
    player.posx - camera.x,
    player.posy - camera.y,
    18,
    18
  );

  ctx.drawImage(
    enemigoImg,
    enemigoDireccion.posx,
    enemigoDireccion.posy,
    18,
    18,
    enemigo.posx - camera.x,
    enemigo.posy - camera.y,
    18,
    18
  );

  if (player.posx >= 3167) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    const x = canvas.width / 2.5 / 2;
    const y = canvas.height / 2.5 / 2;
    ctx.fillText('Has ganado', x, y);
  }

  if (jugadorMuerto) {
    player.posx = 200;
    player.posy = 192;
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    const x = canvas.width / 2.5 / 2;
    const y = canvas.height / 2.5 / 2;

    ctx.fillText('Has muerto', x, y);
    setTimeout(() => {
      jugadorMuerto = false;
    }, 2000);
  }
}

const FRAMETIME = 16;
let startTime = null;
let lag = 0;

function mainLoop(timestamp) {
  if (timestamp === undefined) {
    requestAnimationFrame(mainLoop);
    return;
  }

  if (startTime == null) startTime = timestamp;
  let delta = timestamp - startTime;
  startTime = timestamp;
  lag += delta;

  while (lag > FRAMETIME) {
    update();
    lag -= FRAMETIME;
  }

  //saltoYBajada()
  animacion++;
  frames++;
  //Actualitzar el mon (entitats, controls..)

  //Dibuixar els elements dle joc
  ctx.save();
  ctx.scale(2.5, 2.5);
  draw();
  ctx.restore();

  requestAnimationFrame(mainLoop);
}

let listaDeBloques = [];

async function main() {
  background = await loadImage('imgs/bg-1-1.png');
  playerImg = await loadImage('imgs/mario.png');

  enemigoImg = await loadImage('imgs/enemies.png');
  let respuesta = await fetch('colisiones.json');
  let datosCargados = await respuesta.json();

  listaDeBloques = datosCargados.layers[1].objects;

  mainLoop();
}

main();
