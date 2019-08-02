function Cell(coords) {
    this.coords = coords
    this.flag = false
}
const cellsArray = [];
let flagCount = 0
let revealedCount
function createTable(row, col, numberOfBombs) {
    gameTable.style.gridTemplateRows = `repeat(${row},1fr)`;
    gameTable.style.gridTemplateColumns = `repeat(${col},1fr)`;
    const coordsArray = coordinates(row, col);
    const bombsArray = bombs(coordsArray, numberOfBombs);
    for (let i = 0; i < row * col; i++) {
        const tableCell = document.createElement("div");
        tableCell.classList.add("cell")
        gameTable.appendChild(tableCell);
        cellsArray.push(new Cell(coordsArray[i]));
        if (bombsArray.includes(coordsArray[i])) {
            cellsArray[i].bombs = true;
        }
    }
    neighbours(row, col);
    reveal(row, col, numberOfBombs)
}
function coordinates(row, col) {
    const coordsArray = [];
    for (let x = 1; x <= row; x++) {
        for (let y = 1; y <= col; y++) {
            coordsArray.push(`${x},${y}`);
        }
    }
    return coordsArray;
}
function bombs(coordsArray, numberOfBombs) {
    const arrayOfBombs = [];
    while (arrayOfBombs.length < numberOfBombs) {
        const x = coordsArray[Math.floor(Math.random() * coordsArray.length)];
        if (arrayOfBombs.indexOf(x) == -1) {
            arrayOfBombs.push(x);
        }
    }
    return arrayOfBombs;
}
function neighbours(row, col) {
    for (let i = 0; i < cellsArray.length; i++) {
        const neighbourArray = [];
        const coordinates = cellsArray[i].coords.split(",");
        const coordX = parseInt(coordinates[0]);
        const coordY = parseInt(coordinates[1]);
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (coordX + x > 0 && coordX + x <= row && coordY + y > 0 && coordY + y <= col
                    && cellsArray[i].coords != `${coordX + x},${coordY + y}`) {
                    neighbourArray.push(cellsArray.find(cell => { return cell.coords === `${coordX + x},${coordY + y}` }));
                }
            }
        }
        if (!cellsArray[i].bombs) {
            counter = 0;
            for (let j = 0; j < neighbourArray.length; j++) {
                if (neighbourArray[j].bombs === true) {
                    counter++;
                }
                cellsArray[i].value = counter;
            }
        }
    }
}
function reveal(row, col, numberOfBombs) {
    const gameCell = document.querySelectorAll(".cell")
    for (let i = 0; i < cellsArray.length; i++) {
        gameCell[i].addEventListener("click", function () {
             revealedCount = 0

            this.style.pointerEvents = "none";
            cellsArray[i].revealed = true;
            if (cellsArray[i].bombs) {
                gameOver(gameCell);
                setTimeout(function(){
                    showPopup("GAME OVER","reset")
                },1000)
            }
            else {

                if (cellsArray[i].value > 0) {
                    gameCell[i].innerHTML = cellsArray[i].value;
                }
                else {
                    gameCell[i].style.backgroundColor = "#b7ab9c"
                    const coordinates = cellsArray[i].coords.split(",");
                    const xZero = parseInt(coordinates[0]);
                    const yZero = parseInt(coordinates[1]);
                    revealIfZero(xZero, yZero, row, col, gameCell)
                }
            }
        for(let k = 0; k<cellsArray.length;k++){
            if(cellsArray[k].revealed){
                revealedCount++
                checkIfWon(numberOfBombs,row,col)
            }
        }
        })
        gameCell[i].addEventListener("contextmenu", function (e) {
               e.preventDefault()
            if (!gameCell[i].hasChildNodes()) {
                gameCell[i].innerHTML = `<img src="${localStorage.getItem("flagImg")}"></img>`
                cellsArray[i].flag = true 
                flagCount++               
            }
            else {

                gameCell[i].innerHTML = ""
                cellsArray[i].flag = false
                flagCount--
            }
            checkIfWon(numberOfBombs,row,col)
        })
    }
}
function revealIfZero(x, y, row, col, gameContainer) {
    const coordXZero = x;
    const coordYZero = y;
    for (let x1 = -1; x1 <= 1; x1++) {
        for (let y1 = -1; y1 <= 1; y1++) {
            if (coordXZero + x1 > 0 && coordXZero + x1 <= row && coordYZero + y1 > 0 && coordYZero + y1 <= col
                && `${coordXZero},${coordYZero}` != `${coordXZero + x1},${coordYZero + y1}`) {
                let cellZero = cellsArray.find(cell => { return cell.coords === `${coordXZero + x1},${coordYZero + y1}` });
                let index = cellsArray.map(cell => { return cell.coords; }).indexOf(`${coordXZero + x1},${coordYZero + y1}`)

                if (cellZero.value > 0 && !cellsArray[index].flag) {
                    cellZero.revealed = true;
                    gameContainer[index].innerHTML = cellZero.value
                    gameContainer[index].style.pointerEvents = "none"
                }
                if (!cellZero.revealed && cellZero.value === 0 && !cellsArray[index].flag) {
                    cellZero.revealed = true;
                    const c = cellZero.coords.split(",")
                    gameContainer[index].style.backgroundColor = "#b7ab9c"
                    gameContainer[index].innerHTML = ""
                    gameContainer[index].style.pointerEvents = "none"
                    revealIfZero(parseInt(c[0]), parseInt(c[1]), row, col, gameContainer)
                }
            }
        }
    }
}
function gameOver(parent) {
    indexOfBombs = bombIndexes()
    for (let i = 0; i < indexOfBombs.length; i++) {
        parent[indexOfBombs[i]].innerHTML = `<img src=${localStorage.getItem("bombImg")}></img>`
    }
    document.querySelector("#gameTable").style.pointerEvents = "none"
}
let revealed =0
function bombIndexes() {
    const index = []
    for (let i = 0; i < cellsArray.length; i++) {
        if (cellsArray[i].bombs === true) {
            index.push(i)
        }
    }
    return index
}
function checkIfWon(numberOfBombs,row,col){
    if(flagCount == numberOfBombs && revealedCount == row*col-numberOfBombs){
        setTimeout(function(){
            showPopup("YOU WON!","reset")
        },1000)
    }    
}
