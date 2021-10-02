
const canvas = document.getElementById('canvas');
// @ts-ignore
const ctx = canvas.getContext('2d');

// set game board
const pixelSize = 20;
const boardLength = 21;
const boardHeight = 25;

canvas.setAttribute('width', `${pixelSize * boardLength}px`);
canvas.setAttribute('height', `${pixelSize * boardHeight}px`);

console.log(canvas);
console.log(ctx);

/// global game Object ///

const game = {
   player: {
      size: 16,
      positionX: 0,
      positionY: 0,
      directionX: 0,
      directionY: 0,
      countCooldown: 0,
      cooldown: 20
   },
   isOver: true,
   moving: null,
   rivers: [],
   maxRiversRows: 5,
   countRivers: 0,
   spaceBetweenRivers: 0
};

class river{
   constructor(y){
      this.logs = [];
      this.positionY = y;
      this.length = pixelSize;
      this.countCooldown = 0;
      this.cooldown = (Math.floor(Math.random() * 6) + 1) * 3;

      const randomDirection = Math.floor(Math.random() * 2);
      if(randomDirection == 0)
         this.direction = 'left';
      else 
         this.direction = 'right';
   }
}

function init(){
   drawBackground();
   ctx.fillStyle = 'black';
   ctx.font = "30px Arial";
   ctx.fillText(
      'Press enter to start...',
      70, 
      // @ts-ignore
      canvas.height / 2
   )
   game.isOver = true;
   game.moving = null;
   game.rivers = [];
}
init();

function startGame(){
   game.isOver = false;
   game.player.direction = 0;
   game.player.countCooldown = 0;

   // @ts-ignore
   game.player.positionX = canvas.width / 2;
   // @ts-ignore
   game.player.positionY = canvas.height - (pixelSize / 2);

   createDefaultRivers();
   game.moving = setInterval(ticker, 10);
}

function createDefaultRivers(){
   for(let i = 0; i < boardHeight; i+= Math.floor(Math.random() * 4) + 1){
      let randomY = canvas.height - (pixelSize / 2) - (pixelSize * i);
      
      /// we don't want to have rivers in first four line
      if(randomY < canvas.height - (pixelSize * 4)){
         let r = new river(randomY);
         game.rivers.push(r);
      }
   }
}


function ticker(){
   scrollScreen();
   //createLogs();

   //moveRiver();
   movePlayer();

   drawBackground();
   //drawLog();
   drawPlayer();
}

function scrollScreen(){
   if(
      game.player.positionY <= canvas.height * 3 / 4
   ){
      game.player.positionY += pixelSize;

      game.rivers.forEach(r => {
         r.positionY += pixelSize;
      })

      game.rivers = game.rivers.filter(r => r.positionY < canvas.height);

      if(game.countRivers <= 0 && game.spaceBetweenRivers <= 0){
         game.countRivers = Math.floor(Math.random() * game.maxRiversRows) + 1;
         game.spaceBetweenRivers = Math.floor(Math.random() * 4) + 1;
      }
      
      
      if(game.countRivers > 0 && game.spaceBetweenRivers > 0){
         let r = new river(pixelSize / 2);
         game.rivers.push(r);

         game.countRivers--;
      }
      else game.spaceBetweenRivers--;
   }
}

function movePlayer(){

   game.player.positionX += game.player.directionX;
   game.player.positionY += game.player.directionY;

   game.player.directionX = 0;
   game.player.directionY = 0;
   
   game.player.countCooldown <= 0?
      game.player.countCooldown = 0
   :
      game.player.countCooldown--;
}

function drawBackground(){
   // @ts-ignore
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   ctx.fillStyle = '#FFF8C2';
   // @ts-ignore
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   game.rivers.forEach(r => {
      ctx.fillStyle = '#00C5EB';
      ctx.fillRect(
         0, 
         r.positionY - (pixelSize / 2),
         canvas.width,
         pixelSize
      )
   })
}

function drawPlayer(){
   ctx.fillStyle = '#0A9F00';
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

   if(game.player.countCooldown == 0 && !game.isOver){
      if(e.key == 'ArrowUp'){
         game.player.directionY = -pixelSize;
      }
      else if(e.key == 'ArrowDown' && 
               game.player.positionY < canvas.height - pixelSize
            ){
         game.player.directionY = pixelSize;
      }
      else if(e.key == 'ArrowLeft' &&
               game.player.positionX >= (pixelSize * 3 / 2)
      ){
         game.player.directionX = -pixelSize;
      }
      else if(e.key == 'ArrowRight' &&
               game.player.positionX <= canvas.width - (pixelSize * 3 / 2)
      ){
         game.player.directionX = pixelSize;;
      }

      game.player.countCooldown = game.player.cooldown;
   }
})
