/* eslint-disable operator-linebreak */
import { io } from 'socket.io-client';
import './index.scss';
import ClientGame from './client/ClientGame';
import { getTime } from './common/util';

window.addEventListener('load', async () => {
  const socket = io('https://jspromarathonchat.herokuapp.com/');
  const world = await fetch('https://jsmarathonpro.herokuapp.com/api/v1/world').then((res) => res.json());
  const sprites = await fetch('https://jsmarathonpro.herokuapp.com/api/v1/sprites').then((res) => res.json());
  const gameObjects = await fetch('https://jsmarathonpro.herokuapp.com/api/v1/gameObjects').then((res) => res.json());

  const $startGame = document.querySelector('.start-game');
  const $nameForm = document.getElementById('nameForm');
  const $inputName = document.querySelector('input');

  const $chat = document.querySelector('.chat-wrap');

  const $chatForm = document.getElementById('form');
  const $chatInput = document.getElementById('input');
  const $chatMessage = document.querySelector('.message');

  $startGame.style.display = 'flex';

  let myID = null;

  const funcSumbitForm = (e) => {
    e.preventDefault();

    if ($inputName.value) {
      ClientGame.init({
        tagId: 'game',
        playerName: $inputName.value,
        world,
        sprites,
        gameObjects,
        apiCfg: {
          url: 'https://jsmarathonpro.herokuapp.com/',
          path: '/game',
        },
      });

      socket.emit('start', $inputName.value);

      $chat.style.display = 'block';
      $nameForm.removeEventListener('submit', funcSumbitForm);
      $startGame.remove();
    }
  };

  $nameForm.addEventListener('submit', funcSumbitForm);

  $chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if ($chatInput.value) {
      socket.emit('chat message', $chatInput.value);

      $chatInput.value = '';
    }
  });

  socket.on('connect', () => {
    myID = socket.id;
  });

  socket.on('chat connection', (data) => {
    $chatMessage.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> - ${data.msg}</p>`);
  });

  socket.on('chat disconnect', (data) => {
    $chatMessage.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> - ${data.msg}</p>`);
  });

  socket.on('chat online', (data) => {
    $chatMessage.insertAdjacentHTML(
      'beforeend',
      `<p><strong>${getTime(data.time)}</strong> - Количество пользователей в чате на данный момент - ${
        data.online
      }</p>`,
    );
    data.names.forEach((obj) => {
      $chatMessage.insertAdjacentHTML('beforeend', `<p>Пользователь - ${obj.name} - в сети!</p>`);
    });
  });

  socket.on('chat message', (data) => {
    $chatMessage.insertAdjacentHTML('beforeend', `<p><strong>${getTime(data.time)}</strong> - ${data.msg}</p>`);

    if (data.id === myID) {
      $chatMessage.lastChild.style.cssText +=
        'text-shadow:-1px -1px #fff,-2px -2px #fff,-1px 1px #fff,-2px 2px #fff,1px 1px #fff,2px 2px #fff,1px -1px #fff,2px -2px #fff,-3px -3px 2px #bbb,-3px 3px 2px #bbb,3px 3px 2px #bbb,3px -3px 2px #bbb;color:#4682b4';
    }
  });
});
