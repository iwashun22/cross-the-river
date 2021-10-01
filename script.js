
const canvas = document.getElementById('canvas');
// @ts-ignore
const ctx = canvas.getContext('2d');

// set game board
const pixelSize = 15;
const boardLength = 21;
const boardHeight = 25;

canvas.setAttribute('width', `${pixelSize * boardLength}px`);
canvas.setAttribute('height', `${pixelSize * boardHeight}px`);

console.log(canvas);
console.log(ctx);

/// global game Object ///

const game = {
   player: {
      size: 14,
      positionX: 0,
      positionY: 0,
      directionX: 0,
      directionY: 0,
      cooldown: 0,
   },
   isOver: true,
   moving: null,
   rivers: []
};

class river{
   constructor(y){
      this.log = [];
      this.positionY = y;
      this.length = pixelSize;
      this.direction = (Math.floor(Math.random() * 6) + 1) * 3;
   }
}

function init(){
   drawBackground();
   ctx.fillStyle = 'black';
   ctx.font = "30px Arial";
   ctx.fillText(
      'Press enter to start...',
      10, 
      // @ts-ignore
      canvas.height / 2
   )
}
init();

function startGame(){
   game.isOver = false;
   game.player.direction = 0;
   game.player.cooldown = 0;

   // @ts-ignore
   game.player.positionX = canvas.width / 2;
   // @ts-ignore
   game.player.positionY = canvas.height - (game.player.size / 2);
   game.moving = setInterval(ticker, 10);
}

function ticker(){
   scrollScreen();
   //createRiver();

   //moveRiver();
   movePlayer();

   // @ts-ignore
   ctx.clearRect(0, 0, canvas.width, canvas.height);
   drawBackground();
   //drawLog();
   drawPlayer();
}

function scrollScreen(){
   if(
      game.player.positionY <= canvas.height * 3 / 4
   ){
      game.player.positionY += pixelSize;

      game.rivers = game.rivers.map(r => 
         r.positionY + pixelSize
      )
   }
}

function movePlayer(){

   game.player.positionX += game.player.directionX;
   game.player.positionY += game.player.directionY;

   game.player.directionX = 0;
   game.player.directionY = 0;
   
   game.player.cooldown <= 0?
      game.player.cooldown = 0
   :
      game.player.cooldown--;
}

function drawBackground(){
   ctx.fillStyle = '#FFF8C2';
   // @ts-ignore
   ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer(){
   ctx.fillStyle = '#00DC14';
   const halfSize = game.player.size / 2;
   ctx.fillRect(
      game.player.positionX - halfSize,
      game.player.positionY - halfSize,
      game.player.size,
      game.player.size
   )
}

document.addEventListener('keydown', (e) => {
   if(game.isOver && e.key == 'Enter'){
      startGame();
   }

   if(game.player.cooldown == 0 && !game.isOver){
      if(e.key == 'ArrowUp'){
         game.player.directionY = -pixelSize;
      }
      else if(e.key == 'ArrowDown' && 
               game.player.positionY < canvas.height - pixelSize
            ){
         game.player.directionY = pixelSize;
      }
      else if(e.key == 'ArrowLeft' &&
               game.player.positionX > pixelSize
      ){
         game.player.directionX = -pixelSize;
      }
      else if(e.key == 'ArrowRight' &&
               game.player.positionX < canvas.width - pixelSize
      ){
         game.player.directionX = pixelSize;;
      }

      game.player.cooldown = 24;
   }
})
