enum PlayerType {
  BLACK = "BLACK",
  WHITE = "WHITE",
}

enum PieceType {
  MAN = "MAN",
  KING = "KING",
}

export interface Position {
  row: number;
  col: number;
}

export class Piece {
  type: PieceType;
  player: PlayerType;
  position: Position;

  constructor(player: PlayerType, position: Position) {
    this.type = PieceType.MAN;
    this.player = player;
    this.position = position;
  }

  changeToKing() {
    this.type = PieceType.KING;
  }
}

class Board {
  squares: (Piece | null)[][];

  constructor() {
    this.squares = this.initializeBoard();
  }

  initializeBoard(): (Piece | null)[][] {
    const board: (Piece | null)[][] = [];

    for (let row = 0; row < 8; row++) {
      const currentRow: (Piece | null)[] = [];
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          if (row < 3) {
            currentRow.push(new Piece(PlayerType.BLACK, { row, col }));
          } else if (row > 4) {
            currentRow.push(new Piece(PlayerType.WHITE, { row, col }));
          } else {
            currentRow.push(null);
          }
        } else {
          currentRow.push(null);
        }
      }
      board.push(currentRow);
    }

    return board;
  }

  getPiece(position: Position): Piece | null {
    if (!this.isWithinBounds(position)) {
      return null;
    }
    return this.squares[position.row]?.[position.col] || null;
  }

  setPiece(position: Position, piece: Piece | null): void {
    if (this.isWithinBounds(position)) {
      this.squares[position.row]![position.col] = piece;
      if (piece) {
        piece.position = position;
      }
    }
  }

  isWithinBounds(position: Position): boolean {
    return (
      position.row >= 0 &&
      position.row < 8 &&
      position.col >= 0 &&
      position.col < 8
    );
  }

  getPossibleMoves(piece: Piece): Position[] {
    const moves: Position[] = [];
    const directions = this.getMoveDirections(piece);

    for (const dir of directions) {
      const newPosition = {
        row: piece.position.row + dir.row,
        col: piece.position.col + dir.col,
      };

      if (this.isWithinBounds(newPosition) && !this.getPiece(newPosition)) {
        moves.push(newPosition);
      }
    }

    return moves;
  }

  getPossibleCaptures(piece: Piece): Position[] {
    const captures: Position[] = [];
    const directions = this.getMoveDirections(piece);

    for (const dir of directions) {
      const middlePosition = {
        row: piece.position.row + dir.row,
        col: piece.position.col + dir.col,
      };
      const landingPosition = {
        row: piece.position.row + dir.row * 2,
        col: piece.position.col + dir.col * 2,
      };

      if (
        this.isWithinBounds(landingPosition) &&
        this.getPiece(middlePosition) &&
        this.getPiece(middlePosition)?.player !== piece.player &&
        !this.getPiece(landingPosition)
      ) {
        captures.push(landingPosition);
      }
    }

    return captures;
  }

  getMoveDirections(piece: Piece): Position[] {
    const directions: Position[] = [];

    if (piece.type === PieceType.MAN) {
      if (piece.player === PlayerType.WHITE) {
        directions.push({ row: -1, col: -1 }, { row: -1, col: 1 });
      } else {
        directions.push({ row: 1, col: -1 }, { row: 1, col: 1 });
      }
    } else if (piece.type === PieceType.KING) {
      directions.push(
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 }
      );
    }

    return directions;
  }

  movePiece(piece: Piece, newPosition: Position) {
    this.setPiece(piece.position, null);
    this.setPiece(newPosition, piece);

    if (
      (piece.player === PlayerType.WHITE && newPosition.row === 0) ||
      (piece.player === PlayerType.BLACK && newPosition.row === 7)
    ) {
      piece.changeToKing();
    }
  }

  capturePiece(piece: Piece, targetPosition: Position) {
    const dirRow = (targetPosition.row - piece.position.row) / 2;
    const dirCol = (targetPosition.col - piece.position.col) / 2;
    const capturedPosition = {
      row: piece.position.row + dirRow,
      col: piece.position.col + dirCol,
    };

    this.setPiece(capturedPosition, null);
    this.movePiece(piece, targetPosition);
  }

  hasPieces(player: PlayerType): boolean {
    for (const row of this.squares) {
      for (const piece of row) {
        if (piece && piece.player === player) {
          return true;
        }
      }
    }
    return false;
  }

  hasValidMoves(player: PlayerType): boolean {
    for (const row of this.squares) {
      for (const piece of row) {
        if (piece && piece.player === player) {
          if (
            this.getPossibleMoves(piece).length > 0 ||
            this.getPossibleCaptures(piece).length > 0
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

export class Game {
  board: Board;
  currentPlayer: PlayerType;
  winner: PlayerType | null;

  constructor() {
    this.board = new Board();
    this.currentPlayer = PlayerType.WHITE;
    this.winner = null;
  }

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === PlayerType.WHITE
        ? PlayerType.BLACK
        : PlayerType.WHITE;
  }

  checkGameOver() {
    const opponent =
      this.currentPlayer === PlayerType.WHITE
        ? PlayerType.BLACK
        : PlayerType.WHITE;

    if (
      !this.board.hasPieces(opponent) ||
      !this.board.hasValidMoves(opponent)
    ) {
      this.winner = this.currentPlayer;
    }
  }

  playTurn(
    piece: Piece,
    targetPosition: Position
  ): { result: string } | undefined {
    if (piece.player !== this.currentPlayer) {
      throw new Error("It's not your turn!");
    }

    const possibleCaptures = this.board.getPossibleCaptures(piece);

    if (possibleCaptures.length > 0) {
      if (
        possibleCaptures.some(
          (pos) =>
            pos.row === targetPosition.row && pos.col === targetPosition.col
        )
      ) {
        this.board.capturePiece(piece, targetPosition);

        const possibleCapturesAfterCapture =
          this.board.getPossibleCaptures(piece);
        if (possibleCapturesAfterCapture.length > 0) {
          return { result: "extra-move" };
        }
      } else {
        throw new Error("You must capture if possible!");
      }
    } else {
      const possibleMoves = this.board.getPossibleMoves(piece);
      if (
        possibleMoves.some(
          (pos) =>
            pos.row === targetPosition.row && pos.col === targetPosition.col
        )
      ) {
        this.board.movePiece(piece, targetPosition);
      } else {
        throw new Error("Invalid move!");
      }
    }

    this.checkGameOver();
    if (!this.winner) {
      this.switchPlayer();
    }
  }
}
