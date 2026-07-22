const canvas=document.getElementById("game");
const startButton=document.getElementById("start-button");
const proceedButton=document.getElementById("proceed-button");
let gameStarted=false;
const ctx=canvas.getContext("2d");
canvas.width=600;
canvas.height=400;
let score=0;
let keys={};
let ship={
x:280,
y:350,
width:40,
height:40,
speed:6
};
let stars=[];
function spawnStar(){
stars.push({
x:Math.random()*570,
y:-20,
size:10,
speed:2+Math.random()*2
});
}
let spawnTimer;
startButton.addEventListener("click",()=>{
startButton.style.display="none";
canvas.style.display="block";
gameStarted=true;
spawnTimer=setInterval(spawnStar,800);
});
document.addEventListener("keydown",e=>{
keys[e.key.toLowerCase()]=true;
});
document.addEventListener("keyup",e=>{
keys[e.key.toLowerCase()]=false;
});
function drawShip(){
const cx=ship.x+ship.width/2;
const top=ship.y-14;
const bottom=ship.y+ship.height;

ctx.save();
ctx.translate(cx,0);

// exhaust flame
ctx.beginPath();
ctx.moveTo(-8,bottom);
ctx.quadraticCurveTo(0,bottom+16,8,bottom);
ctx.closePath();
ctx.fillStyle="#ff8844";
ctx.shadowColor="rgba(255,136,68,0.8)";
ctx.shadowBlur=10;
ctx.fill();
ctx.shadowBlur=0;

// left fin
ctx.beginPath();
ctx.moveTo(-14,bottom-4);
ctx.lineTo(-22,bottom+8);
ctx.lineTo(-8,bottom-2);
ctx.closePath();
ctx.fillStyle="#cccccc";
ctx.fill();

// right fin
ctx.beginPath();
ctx.moveTo(14,bottom-4);
ctx.lineTo(22,bottom+8);
ctx.lineTo(8,bottom-2);
ctx.closePath();
ctx.fillStyle="#cccccc";
ctx.fill();

// body (rounded capsule)
ctx.beginPath();
ctx.moveTo(-14,bottom-2);
ctx.lineTo(-14,top+14);
ctx.quadraticCurveTo(-14,top,0,top);
ctx.quadraticCurveTo(14,top,14,top+14);
ctx.lineTo(14,bottom-2);
ctx.quadraticCurveTo(0,bottom+6,-14,bottom-2);
ctx.closePath();
ctx.fillStyle="#f0f0f0";
ctx.shadowColor="rgba(255,255,255,0.35)";
ctx.shadowBlur=10;
ctx.fill();
ctx.shadowBlur=0;

// nose cap
ctx.beginPath();
ctx.moveTo(-14,top+16);
ctx.quadraticCurveTo(-14,top,0,top);
ctx.quadraticCurveTo(14,top,14,top+16);
ctx.closePath();
ctx.fillStyle="#ff5555";
ctx.fill();

// window
ctx.beginPath();
ctx.arc(0,ship.y+ship.height/2-4,7,0,Math.PI*2);
ctx.fillStyle="#333";
ctx.fill();
ctx.beginPath();
ctx.arc(0,ship.y+ship.height/2-4,4.5,0,Math.PI*2);
ctx.fillStyle="#8fd6ff";
ctx.fill();

ctx.restore();
}
function drawStars(){
ctx.fillStyle="white";
stars.forEach(star=>{
ctx.beginPath();
ctx.arc(
star.x,
star.y,
star.size,
0,
Math.PI*2
);
ctx.fill();
});
}
function update(){
if(keys["arrowleft"] || keys["a"]){
ship.x-=ship.speed;
}
if(keys["arrowright"] || keys["d"]){
ship.x+=ship.speed;
}
if(ship.x<0)
ship.x=0;
if(ship.x>560)
ship.x=560;
stars.forEach((star,index)=>{
star.y+=star.speed;
if(
star.x < ship.x+ship.width &&
star.x+star.size > ship.x &&
star.y < ship.y+ship.height &&
star.y+star.size > ship.y
){
stars.splice(index,1);
score++;
document.getElementById("score").textContent=score;
if(score>=19){
complete();
}
}
if(star.y>400){
stars.splice(index,1);
}
});
}
function complete(){
clearInterval(spawnTimer);
document.getElementById("message").innerHTML=
`
RECOVERY COMPLETE
<br><br>
19/19 DATA CORES RESTORED
<br><br>
ARCHIVE ACCESS GRANTED
`;
proceedButton.style.display="block";
proceedButton.onclick=function(){
window.location.href=
"https://avaanis.github.io/Password-required/";
};
}
function loop(){
if(gameStarted){
ctx.clearRect(
0,
0,
canvas.width,
canvas.height
);
drawShip();
drawStars();
update();
}
requestAnimationFrame(loop);
}
loop();
