const board = document.getElementById('chessboard');
const turnInfo = document.getElementById('turn-info');
const statusInfo = document.getElementById('status-info');

const pieces = {
  'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
  'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};

let boardState = [
  ['r','n','b','q','k','b','n','r'],
  ['p','p','p','p','p','p','p','p'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['P','P','P','P','P','P','P','P'],
  ['R','N','B','Q','K','B','N','R'],
];

let selected = null;
let currentTurn = 'white'; // white -> green, black -> red

function drawBoard() {
  board.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');
      if ((row + col) % 2 === 0) {
        square.classList.add('white');
      } else {
        square.classList.add('black');
      }
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = boardState[row][col];
      if (piece) {
        square.innerHTML = pieces[piece];
        if (piece === piece.toUpperCase()) {
          square.classList.add('green'); // White
        } else {
          square.classList.add('red'); // Black
        }
      }

      square.addEventListener('click', () => handleSquareClick(row, col));
      board.appendChild(square);
    }
  }
}

function handleSquareClick(row, col) {
  const piece = boardState[row][col];

  if (selected) {
    if (isValidMove(selected.row, selected.col, row, col)) {
      movePiece(selected.row, selected.col, row, col);
      selected = null;
      drawBoard();
      checkForCheck();
      switchTurn();
    } else {
      alert("Неправильний хід!");
    }
  } else {
    if (piece && isOwnPiece(piece)) {
      selected = { row, col };
      highlightSquare(row, col);
    } else {
      alert("Вибери свою фігуру!");
    }
  }
}

function highlightSquare(row, col) {
  drawBoard();
  const squares = document.querySelectorAll('.square');
  squares.forEach(sq => {
    if (parseInt(sq.dataset.row) === row && parseInt(sq.dataset.col) === col) {
      sq.classList.add('selected');
    }
  });
}

function isOwnPiece(piece) {
  return (currentTurn === 'white' && piece === piece.toUpperCase()) ||
         (currentTurn === 'black' && piece === piece.toLowerCase());
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  boardState[toRow][toCol] = boardState[fromRow][fromCol];
  boardState[fromRow][fromCol] = '';
}

function switchTurn() {
  currentTurn = currentTurn === 'white' ? 'black' : 'white';
  turnInfo.textContent = `Хід: ${currentTurn === 'white' ? 'Білі (Зелені)' : 'Чорні (Червоні)'}`;
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  const piece = boardState[fromRow][fromCol];
  const target = boardState[toRow][toCol];

  if (target && isOwnPiece(target)) {
    return false;
  }
  
  return true; // Спрощена логіка! (можемо додати складнішу потім)
}

function checkForCheck() {
  // Спрощене попередження для демонстрації
  const kings = findKings();
  if (!kings.white) {
    statusInfo.textContent = "Мат! Чорні виграли!";
    freezeBoard();
  } else if (!kings.black) {
    statusInfo.textContent = "Мат! Білі виграли!";
    freezeBoard();
  }
}

function findKings() {
  let white = false, black = false;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (boardState[row][col] === 'K') white = true;
      if (boardState[row][col] === 'k') black = true;
    }
  }
  return { white, black };
}

function freezeBoard() {
  const squares = document.querySelectorAll('.square');
  squares.forEach(sq => sq.replaceWith(sq.cloneNode(true)));
}

// Чат
function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (message) {
    const chat = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.textContent = `${currentTurn === 'white' ? 'Білі' : 'Чорні'}: ${message}`;
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
    input.value = '';
  }
}

// Копіювати посилання
function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  alert("Посилання скопійовано!");
}

drawBoard();
