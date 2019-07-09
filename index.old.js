/**
* This program is a boilerplate code for the standard tic tac toe game
* Here the “box” represents one placeholder for either a “X” or a “0”
* We have a 2D array to represent the arrangement of X or O is a grid
* 0 -> empty box
* 1 -> box with X
* 2 -> box with O
*
* Below are the tasks which needs to be completed:
* Imagine you are playing with the computer so every alternate move should be done by the computer
* X -> player
* O -> Computer
*
* Winner needs to be decided and has to be flashed
*
* Extra points will be given for approaching the problem more creatively
* 
*/

const grid = [];
const GRID_LENGTH = 3;
let turn = 'X';

const RESULT = {
    incomplete: 0,
    playerXWon: 'X',
    playerOWon: 'Y',
    tie: 3
}

function initializeGrid() {
    for (let colIdx = 0;colIdx < GRID_LENGTH; colIdx++) {
        const tempArray = [];
        for (let rowidx = 0; rowidx < GRID_LENGTH;rowidx++) {
            tempArray.push(0);
        }
        grid.push(tempArray);
    }
}

function getRowBoxes(colIdx) {
    let rowDivs = '';
    
    for(let rowIdx=0; rowIdx < GRID_LENGTH ; rowIdx++ ) {
        let additionalClass = 'darkBackground';
        let content = '';
        const sum = colIdx + rowIdx;
        if (sum%2 === 0) {
            additionalClass = 'lightBackground'
        }
        const gridValue = grid[colIdx][rowIdx];
        if(gridValue === 1) {
            content = '<span class="cross">X</span>';
        }
        else if (gridValue === 2) {
            content = '<span class="cross">O</span>';
        }
        rowDivs = rowDivs + '<div colIdx="'+ colIdx +'" rowIdx="' + rowIdx + '" class="box ' +
            additionalClass + '">' + content + '</div>';
    }
    return rowDivs;
}

function getColumns() {
    let columnDivs = '';
    for(let colIdx=0; colIdx < GRID_LENGTH; colIdx++) {
        let coldiv = getRowBoxes(colIdx);
        coldiv = '<div class="rowStyle">' + coldiv + '</div>';
        columnDivs = columnDivs + coldiv;
    }
    return columnDivs;
}

function applyMove(grid,move, turn) {
    grid[move.row][move.column]= turn
    return grid
  }

  function moveCount(grid){
    let moveCount = 0
    for (let i = 0; i<grid.length; i++){
      for (let j = 0 ; j<grid[i].length ; j++){
        if (grid[i][j]!=""){
          moveCount++
        }
      }
    }
    return moveCount
  }

function getResult(grid,turn){
    let result = RESULT.incomplete
    if (moveCount(grid)<5){
       return {result}
    }

    function succession (line){
      return (line === String(turn).repeat(3))
    }

    let line
    let winningLine=[]

    for (var i = 0 ; i<3 ; i++){
      line = grid[i].join('')
      if(succession(line)){
        result = turn;
        winningLine = [[i,0], [i,1], [i,2]]
        return {result: result === 'X' ? 1 : 2, winningLine};
      }
    }

    for (var j=0 ; j<3; j++){
      let column = [grid[0][j],grid[1][j],grid[2][j]]
      line = column.join('')
      if(succession(line)){
        result = turn
        winningLine = [[0,j], [1,j], [2,j]]
        return {result: result === 'X' ? 1 : 2, winningLine};
      }
    }

    let diag1 = [grid[0][0],grid[1][1],grid[2][2]]
    line = diag1.join('')
    if(succession(line)){
      result = turn
      winningLine = [[0,0], [1,1], [2,2]]
      return {result: result === 'X' ? 1 : 2, winningLine};
    }

    let diag2 = [grid[0][2],grid[1][1],grid[2][0]]
    line = diag2.join('')
    if(succession(line)){
      result = turn
      winningLine = [[0,2], [1,1], [2,0]]
      return {result: result === 'X' ? 1 : 2, winningLine};
    }

    if (moveCount(grid)==9){
      result=RESULT.tie
      return {result: result === 'X' ? 1 : 2, winningLine}
    }

    return {result: result === 'X' ? 1 : 2}
  }

  function doComputerMove (){
    let move = getBestMove(grid, 'O').move
    console.log('move :', move);
    executeTurn(grid, move, 2)
  }

  function executeTurn(grid, move, turn) {
    if (grid[move.row][move.column]!== 0){
      return grid
    }

    applyMove(grid,move,turn)
    let result = getResult(grid, turn).result
    console.log('result :', result);

    if (result === RESULT.incomplete){
      turn = turn === 'X' ? 'O' : 'X';
    //   renderMainGrid()
    } else {
      if(result !== RESULT.tie) {
        console.log(`${result} won`)
        
      }

      renderMainGrid()
    }
    if (result==RESULT.incomplete && turn === 'O'){
      doComputerMove()
    }
  }

  function cloneGrid(grid) {
    let copy = []
     for (let row = 0 ; row<3 ; row++){
      copy.push([])
      for (let column = 0 ; column<3 ; column++){
        copy[row][column] = grid[row][column]
      }
    }
    return copy
  }

function getBestMove (grid, turn){

    function getAvailableMoves (grid) {
      let availableMoves = []
      for (let row = 0 ; row<3 ; row++){
        for (let column = 0 ; column<3 ; column++){
          if (grid[row][column] === 0){
            availableMoves.push({row, column})
          }
        }
      }
      return availableMoves
    }

    let availableMoves = getAvailableMoves(grid)
    let availableMovesAndScores = []

    for (let i = 0 ; i<availableMoves.length ; i++){
      let move = availableMoves[i]
      let newGrid = cloneGrid(grid)
      newGrid = applyMove(newGrid,move, turn)
      result = getResult(newGrid,turn).result
      console.log('result :', result);
      let score
      if (result == RESULT.tie) {score = 0}
      else if (result == (turn === 'X' ? 1 : 2)) {
        score = 1
      }
      else {
        let otherSymbol = (turn == 'X')? 'O' : 'X'
        nextMove = getBestMove(newGrid, otherSymbol)
        score = - (nextMove.score)
      }
      if(score === 1)
        return {move, score}
      availableMovesAndScores.push({move, score})
    }

    console.log('availableMovesAndScores :', availableMovesAndScores);
    availableMovesAndScores.sort((moveA, moveB )=>{
        return moveB.score - moveA.score
      })
    return availableMovesAndScores[0]
  }

function renderMainGrid() {
    const parent = document.getElementById("grid");
    const columnDivs = getColumns();
    parent.innerHTML = '<div class="columnsStyle">' + columnDivs + '</div>';
}

function onBoxClick() {
    var rowIdx = this.getAttribute("rowIdx");
    var colIdx = this.getAttribute("colIdx");
    let newValue = 1;
    grid[colIdx][rowIdx] = newValue;
    turn = 'O'
    doComputerMove();
    renderMainGrid();

    // addClickHandlers();
}

function addClickHandlers() {
    var boxes = document.getElementById("grid");
    
    boxes.addEventListener('click', function(event) {
        if (event.target.parentElement === boxes) {
            onBoxClick();
        }
    }, false);
}

initializeGrid();
console.log('grid :', grid);
renderMainGrid();
addClickHandlers();
