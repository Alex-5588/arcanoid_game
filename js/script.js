
'use strict';

let canvas, ctx, w, h, ball, platform, blocks;
let rowHeight, row, col;
let bg = new Image();
let game = true;

let toLeft = true,
    toRight = true;

let startAudio = new Audio("sounds/start.mp3");
let gameOverAudio = new Audio("sounds/gameover.mp3");
let blockAudio = new Audio("sounds/block.mp3");
let platformAudio = new Audio("sounds/platform.mp3");

let score = 0;

let BALL = function ( x, y ) {
    this.x = x;
    this.y = y;
    this.color = 'green';
    this.radius = 4;
    //скорость
    this.vx = 1;    
    this.vy = -2;
};

let PLATFORM = function ( x, y ) {
    this.x = x;
    this.y = y;

    this.width = 70;
    this.height = 5;
    this.color = 'blue';
    this.vx = 8;
};

let BLOCKS = function ( width, height, rows, columns ) {
    this.rows = rows;
    this.columns = columns;
    this.width = width;
    this.height = height;
    this.padding = 3;
    this.obj;
}

//window.onload = init;

document.addEventListener( 'keydown', function ( event ) {
    if ( event.keyCode == 37 ) {
        toLeft = true;
        toRight= false;
    } else if ( event.keyCode == 39 ) {
        toRight = true;
        toLeft = false;
    } else if ( event.keyCode == 40 ) {
        toLeft = false;
        toRight = false;
    }
});

document.addEventListener( 'keyup', function ( event ) {
    if ( event.keyCode == 37 ) {
        toLeft = false;
        toRight= false;
    } else if ( event.keyCode == 39 ) {
        toRight = false;
        toLeft = false;
    } else if ( event.keyCode == 40 ) {
        toLeft = false;
        toRight = false;
    }
});

function init () {
    game = true;
    document.querySelector("#bttn").style.display = "none";
    startAudio.play();
    canvas = document.querySelector('#canvas');
    w = canvas.width;
    h = canvas.height;
    ctx = canvas.getContext('2d');
    ball = new BALL ( w / 2, h / 2 + 50 );
    platform = new PLATFORM ( w / 2, h - 20 );
    platform.x -= platform.width / 2;
    blocks = new BLOCKS (( w / 20 ) - 2, 8, 5, 20);

    blocks.obj = [];
    for ( var i = 0; i < blocks.rows; i++ ) {
        blocks.obj[i] = [];
        for ( var j = 0; j < blocks.columns; j++ ) {
            blocks.obj[i][j] = 1;
        }
    }
    beginGame();
}

function beginGame () {
    if (game) {
        ctx.clearRect(0, 0, w, h);

        ball.x += ball.vx;
        ball.y += ball.vy;

        let tmpScore = "Прогресс: " + score;
        ctx.font = '10px Roboto';
        ctx.strokeStyle = 'white';
        ctx.strokeText( tmpScore, 10, h - 40, 55, 20 );

        if (( ( ball.x + ball.radius ) + ball.vx > w ) || ( ( ball.x - ball.radius ) + ball.vx < 0 )) {
            ball.vx = -ball.vx;
        }

        if ( ( ball.y - ball.radius ) + ball.vy < 0 ) {
            ball.vy = -ball.vy;
        } else if (( ball.y + ball.radius + ball.vy ) >= ( h - platform.height - 10 ) && ( ball.y +  ball.radius ) +ball.vy < h ) {
            if ( ball.x + ball.radius >= platform.x && ball.x + ball.radius <= ( platform.x + platform.width ) ) {
                platformAudio.play();
                ball.vy = -ball.vy;
                ball.vx = 10 * ( ball.x - (platform.x + platform.width / 2 )) / platform.width;
            } else {
                game = false;
            }
        }
        
        /*else if  ( ball.y + ball.radius + ball.vy > h ) {    // Чтобы вниз не уходил
            ball.vy = -ball.vy;
        }*/

        if ( toRight && platform.x + platform.width < w ) {
            platform.x += platform.vx;
        }

        if ( toLeft && platform.x > 0 ) {
            platform.x -= platform.vx; 
        }

        rowHeight = blocks.height + blocks.padding;
        row = Math.floor(ball.y / (rowHeight));
        col = Math.floor(ball.x / (blocks.width + blocks.padding));
        if ( ball.y < blocks.rows * rowHeight &&  row >= 0 && col >= 0 && blocks.obj[row][col] == 1) {
            blocks.obj[row][col] = 0;
            ball.vy = -ball.vy;
            score++;
            blockAudio.play();
        }

        ctx.fillStyle = ball.color;
        ctx.beginPath();
        ctx.arc( ball.x, ball.y, ball.radius, 0, Math.PI * 2, true );
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = platform.color;
        ctx.beginPath();
        ctx.fillRect( platform.x, platform.y, platform.width, platform.height );
        ctx.closePath();

        ctx.fillStyle = 'orange';
        ctx.strokeStyle='black';
        for ( let i = 0; i < blocks.rows; i++ ) {
            //blocks.obj[i] = [];        
            for ( let j = 0; j < blocks.columns; j++ ) {
                //blocks.obj[i][j] = 1;
                if ( blocks.obj[i][j] == 1 ) {
                    ctx.beginPath();
                    ctx.rect( j * ( blocks.width + blocks.padding ), i * ( blocks.height + blocks.padding ), blocks.width, blocks.height );
                    //ctx.strokeRect( j * ( blocks.width + blocks.padding ), i * ( blocks.height + blocks.padding ), blocks.width, blocks.height );
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        window.webkitRequestAnimationFrame(beginGame);
    } else {
        setTimeout(gameOver, 500);
    }
}

function gameOver() {
    gameOverAudio.play();
    let text = "Игра закончена. Прогресс: " +score;
    ctx.clearRect( 0, 0, w, h );
    background();
    ctx.fillStyle = 'red';
    let text_length = ctx.measureText(text).width;
    ctx.fillText( text, w / 2 - text_length / 2, h / 2 );
    document.querySelector("#bttn").style.display = "block";
    document.querySelector("#bttn").style.top = "410px";
}


function background () {
    bg.src = "img/bg.jpg";
    ctx.drawImage( bg, 0, 0, w, h );
}



