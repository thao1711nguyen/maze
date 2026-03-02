const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  static #VALID_DIRS = ['t', 'd', 'l', 'r']
  constructor(width, height, percentage) {
    this.field = this.generateField(width, height, percentage)
    this.lastMove = [0,0]
  }
  print() {
    this.field.forEach((arr) => {
      console.log(arr.join(''))
    })
  } 
  randomCor(width, height) {
    let x = Math.floor(Math.random()*width)
    let y = Math.floor(Math.random()*height)
    return [x,y]
  }
  generateField(width, height, percent) {
    let numberOfHoles = Math.floor(percent*width*height) 
    const field = Array.from({length: height}, () => Array.from({length: width}))
    field[0][0] = "*"
    while(numberOfHoles !== 0) {
     const[x,y] = this.randomCor(width, height)
      if (!field[y][x]) {
        field[y][x] = 'O'
        numberOfHoles--;
      }
    }
    while(true) {
     const [x,y] = this.randomCor(width, height)
     if(!field[y][x]) {
      field[y][x] = '^'
      break
     }
    }
    for(let i=0; i<field.length; i++) {
      for(let j=0; j<field[i].length; j++) {
        if(!field[i][j]) {
          field[i][j] = '░'
        }
      }
    }
    return field
  }
  isValidDir(dir) {
    return Field.#VALID_DIRS.includes(dir)
  }
  convertDir(dir) {
    let x,y;
    switch(dir) {
      case 't': 
        x = this.lastMove[0]
        y = this.lastMove[1] - 1
        break;
      case 'd':
        x = this.lastMove[0]
        y = this.lastMove[1] + 1
        break;
      case 'l':
        x = this.lastMove[0] - 1
        y = this.lastMove[1]
        break;
      case 'r':
        x = this.lastMove[0] + 1
        y = this.lastMove[1]
        break;
    }
    return [x,y]
  }
  isValidMove(move) {
    const [x,y] = move;
    return !( x < 0 || x >= this.field[0].length || 
    y < 0 || y >= this.field.length) 
  }
  checkResult(move) {
    const [x,y] = move
    if (this.field[y][x] === 'O') {
      return 0
    } 
    if (this.field[y][x] === '^') {
      return 1
    } 
    return 2
  }
  markField(move) {
    const [x,y] = move 
    this.field[y][x] = '*'
  }
  play() {
    this.print()
    while(true) {
      let dir = prompt("Which direction you'd like to move?").toLowerCase()
      const validDir = this.isValidDir(dir)
      if (!validDir) {
        console.log('You please enter a valid move')
        return 
      } 
      let move = this.convertDir(dir)
      const validMove = this.isValidMove(move)
      if (!validMove) {
        console.log('Out of bound!')
        return
      } 
      this.lastMove = move
      const result = this.checkResult(move)
      this.markField(move)
      this.print()
      switch(result) {
        case 0: 
          console.log('You fail into a hold!')
          return
        case 1: 
          console.log('Congratulation! You found your hat!')
          return 
      }
    }
  }
}
// const myField = new Field([
//   ['*', '░', '░', 'O',],
//   ['░', 'O', '░', 'O'],
//   ['░', '^', '░', '░'],
// ]);
const myField = new Field(4,3,0.1)
myField.play()