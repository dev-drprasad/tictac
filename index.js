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

const INCOMPLETE = 'INCOMPLETE';
const XWON = 'XWON';
const OWON = 'OWON';
const TIE = 'TIE';

let grid = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];
let gameResult = INCOMPLETE;


function cloneGrid(grid) {
  let copy = []
    for (let row = 0 ; row<3 ; row++){
    copy.push([])
    for (let column = 0 ; column<3 ; column++){
      copy[row][column] = grid[row][column]
    }
  }
  return copy;
}

function cellHTML(rowId, colId, value, backgroundColor) {
  return `<div class="box" row-id="${rowId}" col-id="${colId}" style="background-color: ${backgroundColor}">${value}</div>`
}

function render() {
    const parent = document.getElementById("grid");

    let html = '';
    for (let rowId = 0; rowId < grid.length; rowId += 1) {
      for (let colId = 0; colId < grid[rowId].length; colId += 1) {
        const backgroundColor = (rowId + colId) % 2 === 0 ? 'lightgray' : 'white';
        html += cellHTML(rowId, colId, grid[rowId][colId], backgroundColor);
      }
    }
    parent.innerHTML = html;

    document.getElementById("result").textContent = gameResult !== INCOMPLETE ? `Result: ${gameResult}` : '';
}

function getAvailableMoves(grid) {
  const availableMoves = [];
  for (let rowId = 0; rowId < grid.length; rowId += 1) {
    for (let colId = 0; colId < grid[rowId].length; colId += 1) {
      if (grid[rowId][colId] === '') availableMoves.push({  rowId, colId });
    }
  }
  return availableMoves;
}

function getBestMove(grid, availableMoves) {

  const movesWithScores = availableMoves.map((move) => {
    const newGrid = cloneGrid(grid);
    newGrid[move.rowId][move.colId] = 'O';

    const resultWithO = getResult(newGrid);
    if (resultWithO === OWON) {
      return { ...move, score : 1 };  
    };

    newGrid[move.rowId][move.colId] = 'X';
    const resultWithX = getResult(newGrid);
    if (resultWithX === XWON) {
      return { ...move, score : 1 };
    };

    return { ...move, score: 0 };
  });
  console.log('movesWithScores :', movesWithScores);
  const sortedMoves = movesWithScores.sort((a, b) => b.score - a.score);
  console.log('sortedMoves :', sortedMoves);
  return sortedMoves[0];
}

function getResult(grid) {

  for (let rowId = 0; rowId < grid.length; rowId++) {
    const row = grid[rowId];
    const rowString = row.join("");
    if (rowString === 'XXX') return XWON;
    if (rowString === 'OOO') return OWON;
  }

  for (let colId = 0; colId < grid.length; colId++) {
    const col = [];

    for (let rowId = 0; rowId < grid.length; rowId++) {
      const cell = grid[rowId][colId];
      col.push(cell);
    }
    
    const colString = col.join("");
    if (colString === 'XXX') return XWON;
    if (colString === 'OOO') return OWON;
  }

  const diag1 = [];
  const diag2 = [];
  for (let i = 0; i < grid.length; i++) {
    diag1.push(grid[i][i]);
    diag2.push(grid[i][grid.length - 1 - i])
  }

  const diag1String = diag1.join('');
  const diag2String = diag2.join('');
  if (diag1String === 'XXX') return XWON;
  if (diag1String === 'OOO') return OWON;
  if (diag2String === 'XXX') return XWON;
  if (diag2String === 'OOO') return OWON;

  for (let rowId = 0; rowId < grid.length; rowId += 1) {
    for (let colId = 0; colId < grid[rowId].length; colId += 1) {
      if (grid[rowId][colId] === '') return INCOMPLETE;
    }
  }

  return TIE
}

function doComputerMove() {
  const availableMoves = getAvailableMoves(grid);
  const bestMove = getBestMove(grid, availableMoves);

  console.log('bestMove :', bestMove);
  grid[bestMove.rowId][bestMove.colId] = 'O';
  render();
}

function onBoxClick(node) {
    var rowIdx = node.getAttribute("row-id");
    var colIdx = node.getAttribute("col-id");
    grid[rowIdx][colIdx] = 'X';
    addClickHandlers();
    
    const result = getResult(grid);
    if (result === XWON || result === TIE) {
      gameResult = result;
      removeEventHandlers();
    }

    if (result === INCOMPLETE) {
      doComputerMove();
  
      const result = getResult(grid);
      if (result === OWON || result === TIE) {
        gameResult = result;
        removeEventHandlers();
      }
    }
    render();
}

function handleGridClick(event) {
  const boxes = document.getElementById("grid");
  if (event.target.parentElement === boxes) {
    onBoxClick(event.target);
}
}

function addClickHandlers() {
  const boxes = document.getElementById("grid");
  boxes.addEventListener('click', handleGridClick, false);
}

function removeEventHandlers() {
  const boxes = document.getElementById("grid");
  boxes.removeEventListener('click', handleGridClick);
}

render();
addClickHandlers();
