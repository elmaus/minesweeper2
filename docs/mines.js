

const mainDiv = document.querySelector('#main');
const width = 10;
const height = 12;
const numOfBomb = 20;
const openColor =  'black' //"rgb(11, 6, 46)"
let numberOfOpened = 0;
const boxList = [];
let gameOver = false;
let gameStart = false;
let secs = 0;
let mins = 0
let timer=undefined;

let flagMode = false;
let numberOfFlag = document.querySelector('.nf');
let minutes = document.querySelector('#minutes');
let seconds = document.querySelector('#seconds');
let resetbtn = document.querySelector('#reset');
let winAlert = document.querySelector('.win');
let titlewin = document.querySelector('.title-win');
let winbtn = document.querySelector('.winbtn');
winAlert.style.display = 'none';

const bangSound = new Audio('bang.mp3');
const tap = new Audio('flip.mp3');
const emoji = document.querySelector('#emoji');

const sad = 'sad.png';
const think = 'think.png';
const happy = 'happy.png';
const welcome = 'welcome.png';
emoji.src = welcome

const btnflg = document.querySelector('#flgbtn');

const numColor = {
    one:"white",
    two:"#5bfbf5",
    three:"#5b5bfb",
    four:"#c05bfb",
    five:"#5efb5b",
    six:"#fbea5",
    seven:"#fb5b5b",
    eight:"#fb5b5b",
}

class Box {
    constructor(tile, id, flag) {
        this.tile = tile;
        this.id = id;
        this.number = 0;
        this.open = false;
        this.bomb = false;
        this.flagged = false;
        this.flag = flag;
    }
}

function stopGame() {
    gameOver = true;
    emoji.src = 'sad.png'
    for(let k=0; k<height; k++){
        for(let l=0; l<width; l++){
            if(boxList[k][l].flagged){
                boxList[k][l].tile.removeChild(boxList[k][l].flag)
            }
            if(boxList[k][l].bomb){
                clearInterval(timer);
                boxList[k][l].tile.style.backgroundColor = "#fb5b5b";
                let img = document.createElement('img');
                img.src = "bomb.png";
                img.setAttribute('class', 'img');
                if(!boxList[k][l].open){
                    boxList[k][l].tile.appendChild(img);
                }
                boxList[k][l].open = true;
            }
            else {
                boxList[k][l].open = true;
                reveal(k, l);
            }
        }
    }
    bangSound.play();
    titlewin.innerHTML = 'You lose!';
    resetbtn.textContent = 'Start';
    winAlert.style.display = 'flex';
}

function startTimer() {
    secs++;

    if(mins>=10){
        clearInterval(timer);
        for(let i=0; i<height; i++){
            for(let j=0; j,width; j++){
                if(boxList[i][j].bomb){
                    stopGame();
                }
            }
        }
    }
    if(secs >59){
        secs = 0;
        mins++;
    }
    if(mins > 59){
        mins = 0;
    }
    


    secs < 10 ? seconds.textContent = `0${secs}` : seconds.textContent = secs;
    mins < 10 ? minutes.textContent = `0${mins}` : minutes.textContent = mins;
}

function win() {
    clearInterval(timer);
    titlewin.innerHTML = 'You win!';
    resetbtn.textContent = 'Start';
    winAlert.style.display = 'flex';
    gameOver = true;
}

function checkWin() {
    let bmb = 0;
    let opn = 0;
    for(let i=0; i<height; i++){
        for(let j=0; j<width; j++){
            if(boxList[i][j].bomb){
                bmb++
            }
            else {
                if(boxList[i][j].open){
                    opn++
                }
            }
        }
    }
    if(opn + bmb == 120) win();
}
function createGrid() {
    for(let i = 0; i<height; i++){
        boxList[i] = [];
        for(let j = 0; j<width; j++){
            const box = document.createElement('div');
            const flag = document.createElement('img');
            flag.src = "flag.png";
            flag.setAttribute('class', 'flag');
            boxList[i][j] = new Box(box, `${i}${j}`, flag);
            box.setAttribute('id', `${i}${j}`);
            mainDiv.appendChild(box);
            
            // box.textContent = `${i}${j}`
        }
    }
}
function createBomb() {
    for (let b = 0; b<numOfBomb; b++){
        let i = Math.floor(Math.random() * height);
        let j = Math.floor(Math.random() * width);
        boxList[i][j].bomb = true;
    }
    // for(let i = 0; i<height; i++){
    //     for(let j = 0; j<width; j++){
    //         if (boxList[i][j].bomb){
    //             boxList[i][j].tile.style.backgroundColor = 'red';
    //         }
    //     }
    // }
}

function countAdjacentBomb(){
    for(let i = 0; i<height; i++){
        for(let j = 0; j<width; j++){
            if(i==0 && j >0 && j <width-1){
                boxList[i][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }
            else if(j == 0 && i>0 && i < height -1){
                boxList[i-1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }
            else if(j == width-1 && i>0 && i < height -1){
                boxList[i-1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }
            else if(i == height-1 && j>0 && j < width -1){
                boxList[i][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }
            else if(i==0 && j == 0){
                boxList[i][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }
            else if(i==0 && j == width-1){
                boxList[i][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }   
            else if(i==height-1 && j == 0){
                boxList[i-1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }   
            else if(i==height-1 && j == width-1){
                boxList[i-1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
            }   
            else {
                boxList[i-1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i-1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;

                boxList[i][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                
                boxList[i+1][j-1].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j].bomb ? boxList[i][j].number++ : boxList[i][j].number;
                boxList[i+1][j+1].bomb ? boxList[i][j].number++ : boxList[i][j].number;                
            }
        }
    }
}


function open(i, j){
    // if(boxList[i][j].number !=0){
    //     boxList[i][j].tile.textContent = boxList[i][j].number;
    // }
    // boxList[i][j].tile.style.backgroundColor = openColor;


    if(boxList[i][j].open) {
        return;
    }
    boxList[i][j].open = true;
    if(boxList[i][j].flagged){
        return
    }
    else if(boxList[i][j].number > 0){
        boxList[i][j].open = true;
        boxList[i][j].tile.textContent = boxList[i][j].number;
        return;
    } 
    else if (boxList[i][j].bomb){ 
        return;
    }
    else if(i==0 && j>0 && j<width-1){
        boxList[i][j-1].number == 0 ? open(i, j-1) : boxList[i][j-1].open = true;        
        boxList[i+1][j-1].number == 0 ? open(i+1, j-1) : boxList[i+1][j-1].open = true;
        boxList[i+1][j].number == 0 ? open(i+1, j) : boxList[i+1][j].open = true
        boxList[i+1][j+1].number == 0 ? open(i+1, j+1) : boxList[i+1][j+1].open = true;
        boxList[i][j+1].number == 0 ? open(i, j+1) : boxList[i][j+1].open = true
    }
    else if (j==0 && i>0 && i<height-1){ // left side
        boxList[i-1][j].number == 0 ? open(i-1, j) : boxList[i-1][j].open = true 
        boxList[i+1][j].number == 0 ? open(i+1, j) : boxList[i+1][j].open = true 
        boxList[i-1][j+1].number == 0 ? open(i-1, j+1) : boxList[i-1][j+1].open = true;
        boxList[i][j+1].number == 0 ? open(i, j+1) : boxList[i][j+1].open = true;
        boxList[i+1][j+1].number == 0 ? open(i+1, j+1) : boxList[i+1][j+1].open = true;


    }
    else if(j == width-1 && i>0 && i<height-1){ // right side
        boxList[i-1][j].number == 0 ? open(i-1, j) : boxList[i-1][j].open = true
        boxList[i+1][j].number == 0 ? open(i+1, j) : boxList[i+1][j].open = true  
        boxList[i-1][j-1].number == 0 ? open(i-1, j-1) : boxList[i-1][j-1].open = true;
        boxList[i][j-1].number == 0 ? open(i, j-1) : boxList[i][j-1].open = true;
        boxList[i+1][j-1].number == 0 ? open(i+1, j-1) : boxList[i+1][j-1].open = true;
    }
    else if(i==height-1 && j>0 && j<width-1){
        boxList[i][j-1].number == 0 ? open(i, j-1) : boxList[i][j-1].open = true;
        boxList[i][j+1].number == 0 ? open(i, j+1) : boxList[i][j+1].open = true;

        boxList[i-1][j-1].number == 0 ? open(i-1, j-1) : boxList[i-1][j-1].open = true;
        boxList[i-1][j].number == 0 ? open(i-1, j) : boxList[i-1][j].open = true
        boxList[i-1][j+1].number == 0 ? open(i-1, j+1) : boxList[i-1][j+1].open = true;
    }
    else if(i==0 && j==0){
        boxList[i][j+1].number == 0 ? open(i, j+1) : boxList[i][j+1].open = true;
        boxList[i+1][j+j].number == 0 ? open(i+1, j+1) : boxList[i+1][j+1].open = true;
        boxList[i+1][j].number == 0 ? open(i+1, j) : boxList[i+1][j].open = true
    }
    else if (i==0 && j==width-1){
        boxList[i][j-1].number == 0 ? open(i, j-1) : boxList[i][j-1].open = true;
        boxList[i+1][j-1].number == 0 ? open(i+1, j-1) : boxList[i][j].open = true;
        boxList[i+1][j].number == 0 ? open(i+1, j) : boxList[i+1][j].open = true
    }
    else if(i==height-1 && j==0){
        boxList[i-1][j].number == 0 ? open(i-1, j) : boxList[i-1][j].open = true
        boxList[i-1][j+1].number == 0 ? open(i-1, j+1) : boxList[i-1][j+1].open = true;
        boxList[i][j+1].number == 0 ? open(i, j) : boxList[i][j+1].open = true;
    }
    else if(i==height-1 && j==width-1){
        boxList[i-1][j].number == 0 ? open(i-1, j) : boxList[i][j].open = true
        boxList[i-1][j-1].number == 0 ? open(i-1, j-1) : boxList[i][j].open = true;
        boxList[i][j-1].number == 0 ? open(i, j-1) : boxList[i][j].open = true;
    }
    else {
        boxList[i-1][j].number == 0 ? open(i-1, j) : boxList[i-1][j].open = true
        boxList[i+1][j].number == 0 ? open(i+1, j) : boxList[i+1][j].open = true

        boxList[i-1][j-1].number == 0 ? open(i-1, j-1) : boxList[i-1][j-1].open = true;
        boxList[i][j-1].number == 0 ? open(i, j-1) : boxList[i][j-1].open = true;
        boxList[i+1][j-1].number == 0 ? open(i+1, j-1) : boxList[i+1][j-1].open = true;

        boxList[i-1][j+1].number == 0 ? open(i-1, j+1) : boxList[i-1][j+1].open = true;
        boxList[i][j+1].number == 0 ? open(i, j+1) : boxList[i][j+1].open = true;
        boxList[i+1][j+1].number == 0 ? open(i+1, j+1) : boxList[i+1][j+1].open = true;
    }
    //   boxList[i][j].number == 0 ? open(i, j) : boxList[i][j].tile.textContent = boxList[i][j].number;

}

function reveal(i, j) {
    // for(let i = 0; i<height; i++){
    //     for(let j = 0; j<width; j++){
        if(boxList[i][j].open && !boxList[i][j].bomb){
            boxList[i][j].tile.style.backgroundColor = openColor;
            
            if(boxList[i][j].number == 1){
                boxList[i][j].tile.style.color = numColor.one;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 2){
                boxList[i][j].tile.style.color = numColor.two;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 3){
                boxList[i][j].tile.style.color = numColor.three;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 4){
                boxList[i][j].tile.style.color = numColor.four;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 5){
                boxList[i][j].tile.style.color = numColor.five;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 6){
                boxList[i][j].tile.style.color = numColor.six;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 7){
                boxList[i][j].tile.style.color = numColor.seven;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
            else if(boxList[i][j].number == 8){
                boxList[i][j].tile.style.color = numColor.two;
                boxList[i][j].tile.textContent = boxList[i][j].number;
            }
        }        

    }
    // }
        
function listen() {
    if(!gameOver){
        for(let i = 0; i<height; i++){
            for(let j = 0; j<width; j++){
                boxList[i][j].tile.addEventListener('click', event => {
                    if(!gameStart) {
                        gameStart = true;
                        timer = setInterval(startTimer, 1000);
                        emoji.src = 'think.png';      
                        resetbtn.textContent = "Reset";         
                    }
                    if(!flagMode){
                        if(boxList[i][j].flagged){
                            return;
                        } 
                        else if(boxList[i][j].bomb){
                            if(!gameOver) stopGame();
                        }
                        else {
                            open(i, j)
                            if(!gameOver) tap.play();
                            for(let k = 0; k<height; k++){
                                for(let l = 0; l<width; l++){
                                    if(boxList[k][l].open && !boxList[k][l].bomb){
                                        reveal(k, l);
                                    }
                                }
                            }
                            checkWin();
                        }
                    }else {
                        if(!gameOver){
                            if(!boxList[i][j].flagged){
                                boxList[i][j].tile.appendChild(boxList[i][j].flag);
                                boxList[i][j].flagged = true;
                            }else {
                                boxList[i][j].tile.removeChild(boxList[i][j].flag);
                                boxList[i][j].flagged = false;
                            }
                            let number = 0
                            for(let i=0; i<height; i++){
                                for(let j=0; j<width; j++){
                                    if(boxList[i][j].flagged){
                                        number++;
                                        print()
                                    }
                                }
                            }
                            number < 10 ? numberOfFlag.textContent = `0${number}` : numberOfFlag.textContent = number;
                        }
                    }
                })
            }
        }
    }
}

btnflg.addEventListener('click', event => {
    if(flagMode){ 
        flagMode = false;
        btnflg.textContent = "Mine";
     }else { 
        flagMode = true;
        btnflg.textContent = "Flag";
     }
})

resetbtn.addEventListener('click', event => {
    if(gameStart){
        clearInterval(timer);
        minutes.textContent = '00';
        seconds.textContent = '00';
        numberOfFlag.textContent = '00';
        numberOfOpened = 0;
        resetbtn.textContent = '-----'
        nf = 0;
        gameStart = false;
        flagMode = false;
        for(let i=0; i<height; i++){
            for(let j=0; j<width; j++){
                mainDiv.removeChild(boxList[i][j].tile)
            }
            boxList[i] = [];
        }

        emoji.src = 'welcome.png';
        secs = 0;
        mins = 0;
        gameOver = false;
        btnflg.textContent = 'Mine';
        createGrid();
        createBomb();
        countAdjacentBomb();
        listen();
    }
})

winbtn.addEventListener('click', event => {
    winAlert.style.display = 'none';
})


createGrid();
createBomb();
countAdjacentBomb();
listen();
