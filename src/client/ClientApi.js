/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
import { io } from 'socket.io-client';

class ClientApi {
  constructor(cfg) {
    Object.assign(this, {
      ...cfg,
      game: cfg.game,
    });
  }

  connect() {
    const { url, path } = this;

    this.io = io(url, {
      path,
    });

    this.io.on('welcome', this.onWelcome);
    this.io.on('join', this.onJoin.bind(this));
    this.io.on('newPlayer', this.onNewPlayer.bind(this));
    this.io.on('playerMove', this.onPlayerMove.bind(this));
    this.io.on('playerDisconnect', this.onPlayerDisconnect.bind(this));
  }

  onWelcome(serverStatus) {
    console.log('Server is online', serverStatus, this);
  }

  onJoin(player) {
    console.log(player);
    this.game.createCurrentPlayer(player.player);
    this.game.setPlayers(player.playersList);
  }

  onNewPlayer(player) {
    this.game.createPlayer(player);
  }

  onPlayerMove(moveCfg) {
    console.log(moveCfg);
    const { game } = this;
    const { oldCol, oldRow, col, row, id } = moveCfg;
    const player = game.getPlayerById(id);

    if (player) {
      player.moveToCellCoord(col, row);

      let state = 'main';
      if (row > oldRow) {
        state = 'down';
      } else if (oldRow > row) {
        state = 'up';
      } else if (col > oldCol) {
        state = 'right';
      } else if (oldCol > col) {
        state = 'left';
      }

      console.log(state);
      player.setState(state);
      player.once('motion-stopped', () => player.setState('main'));
    }
  }

  onPlayerDisconnect(id) {
    this.game.removePlayerById(id);
  }

  join(playerName) {
    this.io.emit('join', playerName);
  }

  move(dir) {
    this.io.emit('move', dir);
  }
}

export default ClientApi;
