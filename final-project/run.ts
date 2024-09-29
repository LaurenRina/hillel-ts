import {Game, Piece, Position} from "./script";
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const gameInstance = new Game()

renderBoard()

do {
  console.info(`PLAYER ${gameInstance.currentPlayer} TURN`)

  let pickedFigureCoordinates: Position | undefined;
  try {
    pickedFigureCoordinates = await promptSelectFigure()
  } catch (e) {
    console.error('Selected figure not valid')
    continue
  }

  console.log('pickedFigureCoordinates', pickedFigureCoordinates)


  const pickedPiece = gameInstance.board.getPiece(pickedFigureCoordinates)

  if (pickedPiece == null) {
    console.warn('Invalid piece coordinates')
    continue
  }

  renderBoard(pickedFigureCoordinates)

  let movementCoordinates: Position | undefined;
  try {
    movementCoordinates = await promptMove(gameInstance.board.getPossibleMoves(pickedPiece), gameInstance.board.getPossibleCaptures(pickedPiece))
  } catch (e) {
    console.error('Invalid movement coordinates')
    continue
  }

  try {
    const output = gameInstance.playTurn(pickedPiece, movementCoordinates)
    if (output.result === 'extra-move') {
      continue
    }
  } catch (e) {
    console.error('GAME ERROR: ', e)
    continue
  }
  renderBoard()

} while (!gameInstance.winner)




async function promptSelectFigure(): Promise<Position> {
  return new Promise((resolve, reject) => {
    rl.question('Select your figure ', (answer) => {

      if (answer.length) {
        const coords = answer.split(/,| /);
        if (coords.length === 2 && typeof +coords[0] === 'number' && typeof +coords[1] === 'number') {
          resolve({row: +coords[0] - 1, col: +coords[1] - 1});
        }
      }

      reject()
    });
  })
}



async function promptMove(possibleMoves: Position[], possibleCaptures: Position[]): Promise<Position> {
  return new Promise((resolve, reject) => {
    const hints = (possibleCaptures.length ? possibleCaptures : possibleMoves)?.map(h => [h.row + 1, h.col + 1]).join(' OR ')
    rl.question(`Select your move ${hints} :: `, (answer) => {

      if (answer.length) {
        const coords = answer.split(/,| /);
        if (coords.length === 2 && typeof +coords[0] === 'number' && typeof +coords[1] === 'number') {
          resolve({row: +coords[0] - 1, col: +coords[1] - 1});
        }
      }

      reject()
    });
  })
}



function renderBoard(pickedFigureCoordinates?: Position) {
  const asciiBoard = gameInstance.board.squares.map(row => (row.map(piece => {

    if (pickedFigureCoordinates != null) {

    }

    if (piece == null) return ''
    if (piece.player === 'WHITE') {
      if (pickedFigureCoordinates != null && piece.position.row === pickedFigureCoordinates.row && piece.position.col === pickedFigureCoordinates.col) {
        return piece.type === 'MAN' ? 'ö' : 'Ö'
      }
      return piece.type === 'MAN' ? 'o' : 'O'
    }
    if (piece.player === 'BLACK') {
      if (pickedFigureCoordinates != null && piece.position.row === pickedFigureCoordinates.row && piece.position.col === pickedFigureCoordinates.col) {
        return piece.type === 'MAN' ? 'ä' : 'Ä'
      }
      return piece.type === 'MAN' ? 'a' : 'A'
    }
  })))

  asciiBoard.forEach(row => {
    // Pad each cell to be 3 characters wide for uniformity
    const formattedRow = row.map(cell => cell.padEnd(2, ' ')).join('|');
    console.log(formattedRow);
  });
}
