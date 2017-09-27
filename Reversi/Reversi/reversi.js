var state = {
  action: 'idle',
  over: false,
  turn: 'b',
  board: [
    [null, null,null, null, null, null, null,null],
    [null, null,null, null, null, null, null,null],
    [null, null,null, null, null, null, null,null],
    [null, null, null, 'w', 'b', null, null, null],
    [null, null, null, 'b', 'w', null, null, null],
    [null, null,null, null, null, null, null,null],
    [null, null,null, null, null, null, null,null],
    [null, null,null, null, null, null, null,null],
  ],
  captures: {w: 0, b: 0},
  //global var that keeps track of whether we see a piece of the opposite color when looking for legal moves
  otherPiece: false,
  captureList: [],
  possibleCaptureList: [],
  passCounter: 0
}

var ctx;

/** @function isLegalMove
  * returns a list of legal moves for the specified
  * piece to make.
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
  * @returns {boolean} if a legal move is detected
  */
function isLegalMove(x, y)
{
  //check for OOB
  if(!checkBounds(x, y) || state.board[y][x] !== null)
  {
    return false;
  }
    var direction = "right";
  //look in all 8 directions for an opposite color piece, then see if there's another piece belonging to the turn player  somewhere down the line
  for (var i = 0; i < 8; i++)
  {
      var tempX = x;
      var tempY = y;
      switch (direction)
      {
        case "right":
        {
          for(var j = 0; j < 8; j++)
          {
            //skip checking origin
            tempX += 1;
            //skip checking if out of bounds or the place next to it has no piece
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (!state.board[tempY][tempX])
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
          direction = "up-right";
          break;
        }
        case "up-right":
        {
          for(var j = 0; j < 8; j++)
          {
            tempX += 1;
            tempY -= 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
         }
         direction = "up";
         break;
       }
        case "up":
        {
          for(var j = 0; j < 8; j++)
          {
            tempY -= 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
          direction = "up-left";
          break;
        }
        case "up-left":
        {
          for(var j = 0; j < 8; j++)
          {
            tempX -= 1;
            tempY -= 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
        direction = "left";
        break;
        }
        case "left":
        {
          for(var j = 0; j < 8; j++)
          {
            tempX -= 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
          direction = "down-left";
          break;
        }
        case "down-left":
        {
          for(var j = 0; j < 8; j++)
          {
            tempX -= 1;
            tempY += 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
          direction = "down";
          break;
        }
        case "down":
        {
          for(var j = 0; j < 8; j++)
          {
            tempY += 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
          direction = "down-right";
          break;
        }
        case "down-right":
        {
          for(var j = 0; j < 8; j++)
          {
            tempX += 1;
            tempY += 1;
            if (!checkBounds(tempX, tempY))
            {
              break;
            }
            else if (state.board[tempY][tempX] === null)
            {
              state.possibleCaptureList = [];
              break;
            }

            if (checkPiece(tempX, tempY))
            {
              break;
            }
          }
          break;
        }
    }
  }


  if(state.captureList.length > 0)
  {
    return true;
  }
  else
  {
    return false;
  }

}

/** @function checkPiece
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
*/
function checkPiece (x, y)
{
  var possibleCaptures =
  {
    x: x,
    y: y
  }

  if(state.board[y][x].charAt(0) != state.turn)
  {
    state.possibleCaptureList.push(possibleCaptures);
    state.otherPiece = true;
    return false;
  }
  else if(state.otherPiece)
  {
    //if we found a
    state.captureList = state.captureList.concat(state.possibleCaptureList);
    state.possibleCaptureList = [];
    return true;
  }

}

/** @function checkBounds
  @param {integer} x
  A simple function that checks if the given coordinates are inside the play area
  * @param {integer} x - the x position of the piece on the board
  * @param {integer} y - the y position of the piece on the board
*/
function checkBounds(x, y)
{
  if(x < 0 || y < 0 || x > 7 || y > 7)
  {
    return false;
  }
  else
  {
    return true;
  }
}

/** @function ApplyMove
  * A function to apply the selected move to the game
  */
function applyMove()
{
  state.captureList.forEach(function(element){
    state.board[element.y][element.x] = state.turn;
  });
}

/** @function nextTurn()
  * Starts the next turn by changing the
  * turn property of state.
  */
function nextTurn()
{
  if(state.turn === 'b')
  {
    state.turn = 'w';
  }
  else
  {
    state.turn = 'b';
  }
}

/** @function scoreCheck()
  re-calculates the score after a move
*/
function scoreCheck()
{
  state.captures.b = 0;
  state.captures.w = 0;
  for(var y = 0; y < 8; y++)
  {
    for(var x = 0; x < 8; x++)
    {
      if(state.board[y][x])
      {
        if(state.board[y][x].charAt(0) === "b")
        {
          state.captures.b += 1;
        }
        else
        {
          state.captures.w += 1;
        }
      }
    }
  }
}

/** @function boardPosition
  returns the grid position gotten from mouse coordinates
*/
function boardPosition(x, y)
{
//  console.log(x,y,event.offsetX, event.clientX);
  var boardX = Math.floor(x / 100);
  var boardY = Math.floor(y / 100);
  return {x: boardX, y: boardY}
}

//handles what happens when you click the board
function handleMouseDown(event)
{
  console.log(event.offsetX, event.offsetY);
  if(isButton(event.offsetX, event.offsetY) && canMove() === false)
  {
    passTurn();
    renderBoard()
    return;
  }
  else
  {
    state.passCounter = 0;
  }
  var position = boardPosition(event.offsetX, event.offsetY);
  var x = position.x;
  var y = position.y;

  if(!checkBounds(x, y))
  {
    return;
  }
  // Make sure we have a valid move
  if(isLegalMove(x,y))
  {

    applyMove();
    state.board[y][x] = state.turn;
    state.captureList = [];
    nextTurn();
    renderBoard();
  }
}

/** @function isButton
  *Checks if the space clicked is where the button is
*/
function isButton(x, y)
{
  if (x>=345 && x <=455 && y <= 960 && y >= 905)
  {
    return true;
  }
  else
  {
      return false;
  }
}

/** @function canMove
  *Checks if there are any availble moves left
*/
function canMove()
{
  var moves = 0;
  for(var y = 0; y < 8; y++)
  {
    for(var x = 0; x < 8; x++)
    {
      if(isLegalMove(x,y))
      {
        moves += 1;
      }
      state.captureList = [];
      state.possibleCaptureList = [];
    }
  }
  if(moves > 0)
  {
    return true;
  }
  else
  {
    return false;
  }
}
/** @function passTurn
  *passes turn, if two passes happen then game over
*/
function passTurn()
{
  state.passCounter += 1;
  if (state.passCounter >= 2)
  {
    endGame();
  }
  else
  {
    nextTurn();
  }

}
/** @function endGame()
  * controls what happens when the game is over
*/
function endGame()
{
  if(state.captures.w > state.captures.b)
  {
    displayWinner("White");
  }
  else if(state.captures.b > state.captures.w)
  {
    displayWinner("Black");
  }
  else
  {
    displayWinner("Draw");
  }
}

function displayWinner(winner)
{
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, 800, 800);
    ctx.font = "40px Arial";
    ctx.fillStyle = "White";
    ctx.textAlign = "center";
    if (winner == "White" || winner == "Black")
    {
      console.log("yesyes");
      ctx.fillText(winner + " is the winner!", 400, 400);
    }
    else
    {
      console.log("yesyes2");
      ctx.fillText("It's a Draw! Refresh to play again", 400, 400);
    }
}
/** @function renderBoard()
  * Renders the entire game board.
  */
function renderBoard()
{
  if(!ctx) return;
  ctx.fillStyle = "hsl(120, 100%, 25%)";
  ctx.fillRect(0, 0, 800, 800);
  for(var y = 0; y < 8; y++)
  {
    for(var x = 0; x < 8; x++)
    {
      renderSquare(x, y);
    }
  }
}

/** @function renderSquare
  * Renders a single square on the game board
  * as well as any checkers on it.
  */
function renderSquare(x,y)
{
    ctx.fillStyle = '#888';
    ctx.strokeRect(x*100, y*100, 100, 100);
    if(state.board[y][x])
    {
      renderPiece(state.board[y][x], x, y);
    }
}

/** @function renderPiece
  * Renders a checker at the specified position
  */
function renderPiece(piece, x, y)
{
  ctx.beginPath();
  if(state.board[y][x].charAt(0) === 'w')
  {
    ctx.fillStyle = '#fff';
  }
  else
  {
    ctx.fillStyle = '#000';
  }
  ctx.shadowBlur=6;
  ctx.shadowColor="black";
  ctx.arc(x*100+50, y*100+50, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur=0;
  drawText();
}

/**
  @function drawText
  Draws the current game data
*/
function drawText()
{
  scoreCheck();
  ctx.fillStyle = "#fdf6ee";
  ctx.fillRect(0, 800, 800, 200);

  ctx.font = "50px Arial";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.shadowBlur=.01;
  if (state.turn === "b")
  {
    ctx.fillText("Current Turn: Black", 400, 850);
  }
  else
  {
    ctx.fillText("Current Turn: White", 400, 850);
  }
  ctx.fillText("White: " + state.captures.w, 200, 950);
  ctx.fillText("Black: " + state.captures.b, 600, 950);


  //button stuff
  ctx.shadowBlur=6;
  ctx.fillStyle = "Gray";
  ctx.fillRect(345, 910, 110, 45);
  ctx.font = "50px Arial";
  ctx.fillStyle = "White";
  ctx.fillText("Pass", 400, 950);
  ctx.shadowBlur=0;
}

function setup()
{
  var canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 1000;
  canvas.onmousedown = handleMouseDown;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  renderBoard();
}

setup();
