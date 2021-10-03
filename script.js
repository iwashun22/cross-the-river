
const canvas = document.getElementById('canvas');
// @ts-ignore
const ctx = canvas.getContext('2d');

// set game board
const pixelSize = 22;
const boardLength = 21;
const boardHeight = 21;

canvas.setAttribute('width', `${pixelSize * boardLength}px`);
canvas.setAttribute('height', `${pixelSize * boardHeight}px`);

console.log(canvas);
console.log(ctx);

/// global game Object ///

const game = {
   player: {
      defaultSize: 16,
      size: 0,
      positionX: 0,
      positionY: 0,
      directionX: 0,
      directionY: 0,
      countCooldown: 0,
      cooldown: 15
   },

   isOver: true,
   moving: null,
   score: 0,

   rivers: [],
   maxRiversRows: 4,
   countRivers: 0,
   maxRoadRows: 5,
   countRoad: 0,

   maxLogWidth: 6,
   minLogWidth: 3,
   logSize: 14,
};

class river{
   constructor(y){
      this.logs = [];
      this.positionY = y;
      this.length = pixelSize;
      this.countCooldown = 0;
      this.logSpeed = (Math.random() * 1.5) + 1;
      this.cooldown = 200 / this.logSpeed

      const randomDirection = Math.floor(Math.random() * 1.5);
      if(randomDirection == 0)
         this.direction = 'left';
      else 
         this.direction = 'right';
   }
}

function init(){
   drawBackground();
   ctx.fillStyle = 'black';
   ctx.font = "35px Arial";
   ctx.fillText(
      'Press enter to start...',
      75, 
      // @ts-ignore
      canvas.height / 2
   )
   game.player.size = game.player.defaultSize;
   game.isOver = true;
   game.moving = null;
   game.rivers = [];
   game.score = 0;
   game.countRoad = 0;
   game.countRivers = 0;
   setTimeout(addKeyEvent, 1000);
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
   //scrollScreen();
   createLogs();

   moveLogs();
   movePlayer();

   checkGame();

   drawBackground();
   drawLogs();
   drawPlayer();
   //displayScore();
}

function scrollScreen(){

   game.rivers.forEach(r => {
      r.positionY += pixelSize;
   })
   game.rivers = game.rivers.filter(r => r.positionY < canvas.height);
   if(game.countRivers <= 0 && game.countRoad <= 0){
      game.countRivers = Math.ceil(Math.random() * game.maxRiversRows);
      game.countRoad = Math.ceil(Math.random() * game.maxRoadRows);
   }
   
   
   if(game.countRivers > 0 && game.countRoad > 0){
      let r = new river(pixelSize / 2);
      game.rivers.push(r);
      game.countRivers--;
   }
   else game.countRoad--;

   game.score++;
}

function createLogs(){
   game.rivers.forEach(r => {
      if(Math.random() * 10 < 1
      && r.countCooldown <= 0){
         let log = {
            width: Math.floor(Math.random() * (game.maxLogWidth - game.minLogWidth + 1)) + game.minLogWidth
         }

         if(r.direction == 'right'){
            log.positionX = 0 - (log.width * pixelSize / 2);
         }
         else {
            log.positionX = canvas.width + (log.width * pixelSize / 2);
         }
         
         r.logs.push(log);
         r.countCooldown = r.cooldown;
      }
      else r.countCooldown--;
   })
}

function moveLogs(){
   game.rivers.forEach(r => {
      r.logs.forEach(log => {

         const left = log.positionX - (log.width * pixelSize / 2);
         const right = log.positionX + (log.width * pixelSize / 2);
         if(r.direction == 'right'){

            if(
               game.player.positionY == r.positionY &&
               game.player.positionX < right &&
               game.player.positionX > left
               ){
                  game.player.positionX += r.logSpeed;
               }

            log.positionX += r.logSpeed;
         }
         else if(r.direction == 'left'){

            if(
               game.player.positionY == r.positionY &&
               game.player.positionX < right &&
               game.player.positionX > left
               ){
                  game.player.positionX -= r.logSpeed;
               }

            log.positionX -= r.logSpeed;  
         } 
      })

      r.logs = r.logs.filter(log => 
         log.positionX + (log.width * pixelSize / 2) >= -log.width * pixelSize / 2&&
         log.positionX - (log.width * pixelSize / 2) <= canvas.width
      );
   })
}

function gameOver(){
   document.removeEventListener('keydown', keyEvent);
   game.isOver = true;
   game.player.size = 0;
   setTimeout(() => {
      clearInterval(game.moving);
      game.moving = null;
   }, 200);

   setTimeout(() => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(
         0, 0, canvas.width, canvas.height
      )

      ctx.fillStyle = 'black';
      ctx.font = '40px Arial';
      ctx.fillText(
         'Game over',
         (canvas.width / 3) - 20,
         canvas.height / 2
         );
   }, 200);
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

function checkGame(){
   let isGameOver = false;

   game.rivers.forEach(r => {
      if(game.player.positionY == r.positionY){
         isGameOver = true;
         r.logs.forEach(log => {
            const left = log.positionX - (log.width * pixelSize / 2);
            const right = log.positionX + (log.width * pixelSize / 2);
            if(
               game.player.positionX < right &&
               game.player.positionX > left
            ) isGameOver = false
         })
      }
   })

   if(
      game.player.positionX < (0 - pixelSize) ||
      game.player.positionX > (canvas.width + pixelSize)
   ) isGameOver = true;

   if(isGameOver){
      gameOver();
      setTimeout(init, 1000);
   }
   else return;
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

function drawLogs(){
   game.rivers.forEach(r => {
      r.logs.forEach(log => {
         ctx.fillStyle = '#572D00';
         ctx.fillRect(
            log.positionX - (log.width * pixelSize / 2),
            r.positionY - (game.logSize / 2),
            log.width * pixelSize,
            game.logSize
         );
      })
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

function addKeyEvent(){
   document.addEventListener('keydown', keyEvent);     
}

function keyEvent(e){
   if(game.isOver && e.key == 'Enter'){
      startGame();
   }
   
   if(game.player.countCooldown == 0 && !game.isOver){
      if(e.key == 'ArrowUp'){
         if(
            game.player.positionY <= canvas.height - pixelSize * 5
            ){
               scrollScreen();
            }
            else
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
}