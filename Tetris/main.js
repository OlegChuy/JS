'use strict';

const typeFigures = {};

const shapeFigures = ['🆗', '🆘', '🆚', '🆔'];

const randomFrom0To3 = () => {
  const result = Math.floor((Math.random() * 4)); 
  return result;
};


const createField = (m, n, arr = []) => {
  for (let i = 0; i < m; i++) {
    arr.push(new Array(n).fill(0));
  }
  return arr;
};



class MovementsPiece {
  
  score = 0;
  
  lines = 0;
  
  level = 0;
  
  playfield = createField(20, 20);

  activeShapeFigure = shapeFigures[randomFrom0To3()];
  
  activePiece = {
    x: 0,
    y: 0,
    blocks: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  };

  

  checkErrors() {
    const playfield = this.playfield;
    const {x, y, blocks} = this.activePiece;
    for (let Y = 0; Y < blocks.length; Y++) {
      for (let X = 0; X < blocks[Y].length; X++) {
        if (
        	blocks[Y][X] &&
        	((playfield[y + Y] === undefined || playfield[y + Y][x + 2*X] === undefined) ||
        	playfield[y + Y][x + 2*X])
        ) {
          return true;
        }
      }
    }
    return false;
  }
  
  movePieceDown() {
    this.activePiece.y += 1;
    if (this.checkErrors()) {
      this.activePiece.y -= 1;
      this.closePieceInField();
    }
  }

  movePieceRight() {
    this.activePiece.x += 2;
    if (this.checkErrors()) {
      this.activePiece.x -= 2;
    }
  }

  movePieceLeft() {
    this.activePiece.x -= 2;
    if (this.checkErrors()) {
      this.activePiece.x += 2;
    }
  };

  turnPiece() {
    const blocks = this.activePiece.blocks;
    let newBlock = [[], [], []];
    for (let i = 0; i < blocks.length; i++) {
      for (let j = 0; j < blocks[i].length; j++) {
        newBlock[i].push(blocks[blocks.length - 1 - j][i]);
      }
    }
    this.activePiece.blocks = newBlock;
    if (this.checkErrors()) {
      this.activePiece.blocks = blocks;
    }
  }

  closePieceInField() {
    let {x, y, blocks} = this.activePiece;
    for (let Y = 0; Y < blocks.length; Y++) {
      for (let X = 0; X < blocks[Y].length; X++) {
      	  if (blocks[Y][X] == 1)
          this.playfield[y + Y][x + 2*X] = blocks[Y][X];
      }
    };
    this.activePiece.y = 0;
    this.activePiece.x = 0;
    tetra.activeShapeFigure = shapeFigures[randomFrom0To3()];
  };
};



const tetra = new MovementsPiece();


const showField = () => {
  const field = `
                     ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛                    ⬛
                     ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛
  `
  console.log(field);
}

const showPiece = () => {
  const shapeFigure = tetra.activeShapeFigure;
  let {x, y, blocks} = tetra.activePiece;
    for (let Y = 0; Y < blocks.length; Y++) {
      for (let X = 0; X < blocks[Y].length; X++) {
        if (blocks[Y][X] == 1) {
          const yCoor = 3 + y + Y;
          const xCoor = 24 + x + 2*X;
          console.log(`\x1b[${yCoor};${xCoor}H` + shapeFigure);        
        }
    }
  };
}

const showPassivePieces = () => {
  for (let Y = 0; Y < tetra.playfield.length; Y++) {
    for (let X = 0; X < tetra.playfield[Y].length; X++) {
      if (tetra.playfield[Y][X] == 1) {
        const yCoor = Y + 3;
        const xCoor = X + 24;
        console.log(`\x1b[${yCoor};${xCoor}H` + '⬜')
      }
    }
  }
};

const fn = (reason = 'standart') => {
  console.clear();
  showField();
  showPiece();
  if (reason == 'standart') {
    tetra.movePieceDown();
  } else if (reason == 'moveRight') {
    tetra.movePieceRight();
  } else if (reason == 'moveLeft') {
    tetra.movePieceLeft();
  } else if (reason == 'turnPiece') {
    tetra.turnPiece();
  }
  showPassivePieces();    
  console.log('\x1b[25;10H');
  console.log(tetra.activeShapeFigure);
}


setInterval(fn, 500);


process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.on('data', c => {
  if (c == '\u0003') {
    console.log('SIGINT');
    process.exit();
  }
  if (c == '\u0020') {
    fn('turnPiece');
  }
  if (c == '\u001b\u005b\u0044') {
    fn('moveLeft');
  } 
  if (c == '\u001b\u005b\u0043') {
    fn('moveRight');
  }   
  if (c == '\u001b\u005b\u0042') {
    fn();
  }    
})



/*
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question( name => {
  console.log('Hey');
  rl.close;
});
*/

