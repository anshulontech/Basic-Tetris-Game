document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')

    const width = 10
    let nextRandom = 0
    let timerId
    let score=0
    const colors =[
        'orange' ,
        'red' ,
        'purple' ,
        'green' ,
        'blue'
    ]

    // The Tetrominoes

    const lTetromino = [
        [1, width + 1, 2 * width + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, 2 * width + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, 2 * width + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTerominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    let random = Math.floor(Math.random() * theTerominoes.length)
    console.log(random)
    let current = theTerominoes[random][currentRotation]

    // draw the tetromino 

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition+index].style.backgroundColor = colors[random]
        })
    }

    // undraw the tetromino

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }
    // assign function to keycodes
    function control(e) {
        if (e.keyCode === 37) {
            moveleft()
        } else if (e.keyCode == 38) {
            rotate()
        } else if (e.keyCode == 39) {
            moveRight()
        } else if (e.keyCode == 40) {
            moveDown()
        }
    }

    document.addEventListener('keyup', control)

    // move down function

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // freeze function

    function freeze() {
        if (current.some(index => squares[currentPosition + width + index].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // start the new tetromino falling 

            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTerominoes.length)
            current = theTerominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    // move the tetromino left unless is at the edge or blockage

    function moveleft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    // move the tetromino right unless is at the edge or blockage

    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isAtRightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }

        draw()
    }

    // rotate the tetromino 

    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation === current.length) { // If the current rotation goes to 4 than make it again 0
            currentRotation = 0
        }

        current = theTerominoes[random][currentRotation]
        draw()
    }

    // show up next tetromino in mini grid dispaly 
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    // the tetromino without rotation 

    const upNextTetrominoes = [
        [1, displayWidth + 1, 2 * displayWidth + 1, 2], // lTetromino
        [0, displayWidth, displayWidth + 1, 2 * displayWidth + 1], // zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTerominoes
        [0, 1, displayWidth, displayWidth + 1], // oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
    ]

    // display the shape in the mini-grid

    function displayShape() {
        // remove any traces of tetromino from the grid

        displaySquares.forEach( square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor =''
        })

        upNextTetrominoes[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex+index].style.backgroundColor = colors[nextRandom]
        })
    }

    // Add functionality to the button 
    startBtn.addEventListener( 'click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        }
        else {
            draw() 
            timerId=setInterval(moveDown,1000)
            nextRandom= Math.floor(Math.random()*theTerominoes.length)
            displayShape()
        }
    })


    // add score 

    function addScore() {
        for(let i=0;i<199;i+=width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score+=10;
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })

            const squaresRemoved = squares.splice(i,width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }

        }
    }


    // game over function 

    function gameOver() {
        if(current.some(index => squares[currentPosition+index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = score+' end'
            clearInterval(timerId)
        }
    }


})