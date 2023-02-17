//setup
class Vector{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}
class Soldier{
    constructor(pos,color,radius,health,attack,speed,enemyId) {
        this.enemyId = enemyId;
        this.pos = pos;
        this.color = color;
        this.radius = radius;
        this.health = health;
        this.attack = attack;
        this.targets = [];
        this.alive = true;
        this.targets[0] = new Vector(startPos.x + pathdata[0].x, startPos.y + pathdata[0].y)
        for (let i = 1; i < pathdata.length; i++) {
            let prevTarget = this.targets[i - 1];
            let path = pathdata[i];
            let newTarget = new Vector(prevTarget.x + path.x, prevTarget.y + path.y);
            this.targets[i] = newTarget;
        }
        this.currentTarget = this.targets[0];
        this.dir = new Vector(0,0);
        this.speed = speed;
        this.minTargetDistance = 2;
    }
    update() {
        if (this.currentTarget == null || this.health < 1) {this.alive = false};
        if (this.alive == false) return;
        let dir = new Vector(this.currentTarget.x - this.pos.x, this.currentTarget.y - this.pos.y);
        let distance = (dir.x**2 + dir.y**2) ** (1/2); 
        if (distance == 0) return; // no need to move, end here.
        dir.x /= distance;
        dir.y /= distance;
        this.pos.x += dir.x * this.speed;
        this.pos.y += dir.y * this.speed;
        let xDist = Math.abs(this.pos.x - this.currentTarget.x);
        let yDist = Math.abs(this.pos.y - this.currentTarget.y);
        if (xDist <= this.minTargetDistance && yDist <= this.minTargetDistance) {
            this.targets.splice(0,1); //delete current target.
            if ( this.targets.length == 0 ) { this.currentTarget = null; } else {
            this.currentTarget = this.targets[0]; // replace with next, "new first item".
            }
        }
       
    }
    render() {
        if (this.alive == false) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2);
        ctx.fill();
    }
}

var canvas = document.getElementsByClassName("maincanvas")[0]
var ctx = canvas.getContext("2d");
var ground_color = "rgb(148, 115, 30)";
const sw = canvas.width;
const sh = canvas.height;
var tile_w = 25;
var pathdata = [
    new Vector(0,200),
    new Vector(400,0),
    new Vector(0,200),
    new Vector(-400,0),
    new Vector(0,300),
]
var startPos = new Vector(4 * tile_w,0);
var soldiers = []
var soldierStartPos = new Vector(startPos.x,startPos.y);
var spawnAmount = 3;
//spawn function
function spawn(color,radius,health,attack,speed,amount,interval,delay) {
    setTimeout(function(){
        for (let i = 0; i < amount; i++) {
            let newsoldier = new Soldier(new Vector(soldierStartPos.x,soldierStartPos.y),color,radius,health,attack,speed,soldiers.length)
            soldiers[soldiers.length] = newsoldier;
            soldierStartPos.y -= interval;
        } 
    },delay)
      
}
spawn("red",20,100,1,4,8,60,1)
spawn("blue",20,100,1,5,3,60,1000);spawn("blue",20,100,1,5,3,60,2000); spawn("blue",20,100,1,5,3,60,3000)

//main
function update() {
    soldiers.forEach(function(s){
        s.update();
    })
    let endWave = true
    soldiers.forEach(function(s) {
        if (s.alive) {
            endWave = false;
        }
    })
    if ( endWave == true ) { soldiers.splice(0,soldiers.length) }
}

function render() {
    ctx.fillStyle = ground_color;
    ctx.fillRect(0,0,sw,sh);
    renderPath();
    rendergrid();
    soldiers.forEach(function(s){
        s.render();
    })
}
function renderPath() {
    let drawPos = new Vector(startPos.x,startPos.y);
    ctx.fillStyle = "grey";
    pathdata.forEach(function(path){
        if (path.x == 0) {
            let x = drawPos.x - tile_w;
            let y = drawPos.y - tile_w;
            let w = tile_w * 2;
            let h = path.y + tile_w * 2;
            ctx.fillRect(x,y,w,h);
        }else {
            let x = drawPos.x - tile_w;
            let y = drawPos.y - tile_w;
            let w = path.x + tile_w * 2;
            let h =  tile_w * 2;
            ctx.fillRect(x,y,w,h);
        }
        drawPos.x += path.x; 
        drawPos.y += path.y;
    });
}
function rendergrid() {
    let [x,y] = [0,0];
    for (let i = 0; i < sw / tile_w; i++) {
        //start a path then calculate a line.
        ctx.beginPath();
        ctx.moveTo(x,0);
        ctx.lineTo(x,sh);
        ctx.stroke();
        x += tile_w;
    }
    for (let i = 0; i < sh / tile_w; i++) {
        //start a path then calculate a line.
        ctx.beginPath();
        ctx.moveTo(0,y);
        ctx.lineTo(sw,y);
        ctx.stroke();
        y += tile_w;
    }
}
function play() {
    update();
    render();
}

setInterval(play,1000/60)