'use strict'
//artificial ants / swarm intelligence
//created by https://vk.com/hentai_lxrd
//version: 2.28
const canvas    = document.getElementById('gamec');
const ctx       = canvas.getContext('2d');
let counterhtml = document.getElementById( 'counter'    );
let foodbtn     = document.getElementById( 'foodbtn'    );
let homebtn     = document.getElementById( 'homebtn'    );
let pausebtn    = document.getElementById( 'pausebtn'   );
let borderbtn   = document.getElementById( 'borderbtn'  );
let slideradius = document.getElementById( 'myRangeR'   );
let radiustext  = document.getElementById( 'radiustext' );
let antsQ       = document.getElementById( 'myRangeA'   );
let antstext    = document.getElementById( 'antstext'   );
canvas.height   = 720;
canvas.width    = 1280;
function randint(max) {return Math.floor(Math.random() * (max + 1));};
function go(ant) {
    ant.x += Math.cos(ant.vect + (((randint(1) - 0.5) * Math.PI) / 180)) * ant.speed;
    ant.y += Math.sin(ant.vect + (((randint(1) - 0.5) * Math.PI) / 180)) * ant.speed;
    if (ant.x > qlt.x - 2 || ant.x < 1) { 
        ant.vect = Math.PI - ant.vect;
    };
    if (ant.y > qlt.y - 2 || ant.y < 1) {
        ant.vect = Math.PI  * 2 - ant.vect;
    };
    if (ant.type                    == 'scout' &&
        ant.counter                 != 0       &&
        Math.floor(ant.counter / 7) == ant.counter / 7) {
        ant.vect = ant.vect + ((randint(10) - 5) * Math.PI) / 180;
    };
    if (ant.type == 'scout'){
        ant.counter ++;
    };
    ant.steps.home ++;
    ant.steps.food ++;
};
function check(ant) {
    ant.speedgo = 0;
    let targets, nottargets;
    let scout = false;
    if (ant.type == 'scout') {
        scout = true;
        targets = foods;
        nottargets = homes;    
    }
    else if (ant.target === 1) {
        targets = foods;
        nottargets = homes;
    }
    else if (ant.target === 0) {
        targets = homes;
        nottargets = foods;
    };
    for (let target of targets) {
        if (Math.sqrt((ant.x - target.x) * (ant.x - target.x) +
                      (ant.y - target.y) * (ant.y - target.y)) <= target.radius) {
            if (ant.target === 0) {ant.steps.home = 0;}
            else {ant.steps.food = 0;};
            if (!scout) {               
                ant.target = ~~!~~ant.target;
                if (ant.color === foodcolor) {ant.color = homecolor}
                else {ant.color = foodcolor};    
                ant.counter ++    
                if (ant.counter / 2 === Math.floor(ant.counter / 2) && ant.counter !== 0) {   
                    counter ++;
                };
            };           
            if (!ant.trigger.tr) {
                ant.vect = ant.vect - Math.PI;
                ant.trigger.tr = true;
            };
            ant.trigger.i ++;
            break;
        };
    };
    for (let nottarget of nottargets) {
        if (Math.sqrt((ant.x - nottarget.x) * (ant.x - nottarget.x) +
                      (ant.y - nottarget.y) * (ant.y - nottarget.y)) <= nottarget.radius) {
            if (ant.target == 1) {ant.steps.home = 0;}
            else {ant.steps.food = 0;};           
            if (!ant.trigger.tr) {
                ant.vect = ant.vect - Math.PI;
                ant.trigger.tr = true;
            };
            ant.trigger.i ++;
            break;
        };
    };
    for (let border of borders) {
        if (Math.sqrt((ant.x - border.x) * (ant.x - border.x) +
                      (ant.y - border.y) * (ant.y - border.y)) <= border.radius) {            
            if (!ant.trigger.tr) {
                ant.vect = Math.atan2(ant.y - border.y, ant.x - border.x);
                ant.trigger.tr = true;
            };
            ant.trigger.i ++;
            break;
        };
    };
    if (ant.trigger.i === 0) {
        ant.trigger.tr = false;
    };
    ant.trigger.i = 0;
};
function doscream(ant, index) {
    echo.push({steps: {home: ant.steps.home + signalradius,
               food: ant.steps.food + signalradius},
               x: ant.x,
               y: ant.y,
               index: index
               });
};
function changeDir(ant, index) {
    if (ant.trigger.tr) {return 0;};
    if (ant.type == 'scout') {return 0;};
    let trcoords = {x: -1, y: -1};
    for(let scream of echo) {
        if (index !== scream.index) {
            if(Math.sqrt((scream.x - ant.x) * (scream.x - ant.x) +
                         (scream.y - ant.y) * (scream.y - ant.y)) <= signalradius) {
                if (scream.steps.food < ant.steps.food) {
                    ant.steps.food = scream.steps.food;
                    if (ant.target === 1) {
                        trcoords.x = scream.x;
                        trcoords.y = scream.y;
                    };
                };
                if (scream.steps.home < ant.steps.home) {
                    ant.steps.home = scream.steps.home;
                    if (ant.target === 0) {
                        trcoords.x = scream.x;
                        trcoords.y = scream.y;
                    };
                };
            };
        };
    };
    if (trcoords.x !== -1 && trcoords.y !== -1) {
        ant.vect = Math.atan2(trcoords.y - ant.y,
                              trcoords.x - ant.x) +
                              (((randint(4) - 2) * Math.PI) / 180);
    };
};
function draw() {
    antsQfunc();
    ctx.fillStyle = backcolor;
    ctx.fillRect(0, 0, qlt.x, qlt.y);
    ctx.fillStyle = homecolor;
    for (let home of homes) {
        ctx.beginPath();
        ctx.arc(home.x, home.y, home.radius, 0, Math.PI * 2, true);
        ctx.fill();
    };
    ctx.fillStyle = foodcolor;
    for (let food of foods) {
        ctx.beginPath();
        ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2, true);
        ctx.fill();
    };
    ctx.fillStyle = bordercolor;
    for (let border of borders) {
        ctx.beginPath();
        ctx.arc(border.x, border.y, border.radius, 0, Math.PI * 2, true);
        ctx.fill();
    };
    for (let ant of ants) {
        ctx.fillStyle = ant.color;
        ctx.beginPath();
        ctx.arc(ant.x, ant.y, antradius, 0, Math.PI * 2, true);
        ctx.fill();
    };
}; 
function run() {
    let start = Date.now();
    draw();
    ants.forEach(doscream);
    ants.forEach(check);
    ants.forEach(changeDir);
    ants.forEach(go);
    echo = [];
    let end = Date.now();
    counterhtml.innerHTML = 
    `count: ${counter}`                                    +
    '<br/>'                                                +
    `time: ${Math.floor((end - globalstart) / 60000)} min` +
    '<br/>'                                                +
    `fps: ${Math.round(1000 / (end - start))}`;
};
function antsQfunc() {
    if (antsquantity < ants.length) {
        for (let i = 0; i < ants.length - antsquantity; i++) {
            ants.pop();
        };
    }
    else if (antsquantity > ants.length) {
        for (let i = 0; i < antsquantity - ants.length; i ++) {
            ants.push(new Ant_regular);
        };
    };
};
function eventHandler(event) {
    let trigger = true;
    for (let [i, food] of foods.entries()) {
        if (Math.sqrt((event.offsetX - food.x) * (event.offsetX - food.x) +
        (event.offsetY - food.y) * (event.offsetY - food.y)) <= food.radius) {
            foods.splice(i, 1);
            trigger = false;
            return 0;
        };
    };
    for (let [i, home] of homes.entries()) {
        if (Math.sqrt((event.offsetX - home.x) * (event.offsetX - home.x) +
        (event.offsetY - home.y) * (event.offsetY - home.y)) <= home.radius) {
            homes.splice(i, 1);
            trigger = false;
            return 0;
        };
    };
    for (let [i, border] of borders.entries()) {
        if (Math.sqrt((event.offsetX - border.x) * (event.offsetX - border.x) +
        (event.offsetY - border.y) * (event.offsetY - border.y)) <= border.radius) {
            borders.splice(i, 1);
            trigger = false;
            return 0;
        };
    };
    if (trigger === true) {
        if (createtarget === 1) {
            foods.unshift({x: event.offsetX, y: event.offsetY, radius: baseradius});
        }
        else if (createtarget === 0) {
            homes.unshift({x: event.offsetX, y: event.offsetY, radius: baseradius});
        }
        else if (createtarget === 2) {
            borders.unshift({x: event.offsetX, y: event.offsetY, radius: baseradius});
        };
    };
};
function pauseIt() {
    pause = !pause;
    if (pause) {
        clearInterval(cycle);
        pausedraw = setInterval(draw, 1000 / fps, 1);
    }
    else {
        cycle = setInterval(run, 1000 / fps)
        clearInterval(pausedraw);
    };
};
function Ant_regular() {
    this.x          = randint(qlt.x / 2) + qlt.x / 4;
    this.y          = randint(qlt.y / 2) + qlt.y / 4;
    this.target     = randint(1);
    this.vect       = randint(360) * Math.PI / 180;
    this.steps      = {home: 0, food: 0};
    this.speed      = randint(3) + 2;
    this.counter    = 0;
    this.color      = this.target == 1 ? foodcolor : homecolor;
    this.type       = 'regular';
    this.trigger    = {tr: false, i: 0, tri: false};
};
function Ant_scout() {
    this.x          = randint(qlt.x / 2) + qlt.x / 4;
    this.y          = randint(qlt.y / 2) + qlt.y / 4;
    this.vect       = randint(360) * Math.PI / 180;
    this.steps      = {home: 0, food: 0};
    this.speed      = randint(3) + 2;
    this.color      = white;
    this.counter    = 0;
    this.type       = 'scout';
    this.trigger    = {tr: false, i: 0, tri: false};
};
let qlt             = {x: canvas.width, y: canvas.height};
let fps             = 30;
let baseradius      = 40;
let antradius       = 3;
let signalradius    = 32.0;
let antsquantity    = 1500;
let scoutquantity   = 0;
let homes           = [];
let foods           = [];
let borders         = [];
let ants            = [];
let echo            = [];
let counter         = 0;
let createtarget    = 0;
let pause           = false;
let cycle;
let pausedraw;
const backcolor       = '#e2e2e2';
const foodcolor       = '#514dff';
const homecolor       = '#ff4343';
const bordercolor     = '#708090';
const white           = '#ffffff';
radiustext.innerHTML = 'Radius: ' + (slideradius.value);
slideradius.oninput = function() {
    radiustext.innerHTML = 'Radius: ' + this.value;
    baseradius = this.value;
};
antstext.innerHTML = 'Ants: ' + (antsQ.value);
antsQ.oninput = function() {
    antstext.innerHTML = 'Ants: ' + this.value;
    antsquantity = parseInt(this.value);
};
homebtn.onclick         = () => {createtarget = 0;
                                 homebtn.style.borderWidth   = '3px';
                                 foodbtn.style.borderWidth   = '0px';
                                 borderbtn.style.borderWidth = '0px';
                                 pausebtn.style.borderWidth  = '0px';
                                };
foodbtn.onclick         = () => {createtarget = 1;
                                 homebtn.style.borderWidth   = '0px';
                                 foodbtn.style.borderWidth   = '3px';
                                 borderbtn.style.borderWidth = '0px';
                                 pausebtn.style.borderWidth  = '0px';
                                };
borderbtn.onclick       = () => {createtarget = 2;
                                 homebtn.style.borderWidth   = '0px';
                                 foodbtn.style.borderWidth   = '0px';
                                 borderbtn.style.borderWidth = '3px';
                                 pausebtn.style.borderWidth  = '0px';
                                };
pausebtn.onclick        = () => {pauseIt();
                                 homebtn.style.borderWidth   = '0px';
                                 foodbtn.style.borderWidth   = '0px';
                                 borderbtn.style.borderWidth = '0px';
                                 pausebtn.style.borderWidth  = '3px';
                                 if (pausebtn.value == 'Start') {
                                     pausebtn.value = 'Stop';
                                 }
                                 else {
                                    pausebtn.value = 'Start';
                                 };
                                };
canvas.addEventListener('click', eventHandler);
for (let i = 0; i < antsquantity - scoutquantity; i ++) {
    ants.push(new Ant_regular);
};
for (let i = 0; i < scoutquantity; i ++) {
    ants.push(new Ant_scout);
};
let globalstart = Date.now();
pauseIt();