import { io } from 'socket.io-client';
import './index.scss';
import ClientGame from './client/ClientGame';
import { getTime } from './common/util';

window.addEventListener('load', () => {
  const socket = io('https://jspromarathonchat.herokuapp.com/');

  const $startGame = document.querySelector('.start-game');
  const $nameForm = document.getElementById('nameForm');
  const $inputName = document.querySelector('input');

  const $chat = document.querySelector('.chat-wrap');

  const $chatForm = document.getElementById('form');
  const $chatInput = document.getElementById('input');
  const $chatMessage = document.querySelector('.message');
  const $audio = document.querySelector('.audio');

  let myID = null;

  const funcSumbitForm = (e) => {
    e.preventDefault();

    if ($inputName.value) {
      ClientGame.init({
        tagId: 'game',
        playerName: $inputName.value,
        apiCfg: {
          url: 'https://jsmarathonpro.herokuapp.com/',
          path: '/game',
        },
      });

      socket.emit('start', $inputName.value);

      $chat.style.display = 'block';
      $nameForm.removeEventListener('submit', funcSumbitForm);
      $startGame.remove();
      $audio.play();
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
    $chatMessage.insertAdjacentHTML(
      'beforeend',
      `<p><strong>${getTime(data.time)} - </strong>${data.msg.substr(0, data.msg.length - 10)} has joined the chat</p>`,
    );
  });

  socket.on('chat disconnect', (data) => {
    $chatMessage.insertAdjacentHTML(
      'beforeend',
      `<p><strong>${getTime(data.time)} - </strong>${data.msg.substr(0, data.msg.length - 11)} has left the chat</p>`,
    );
  });

  socket.on('chat online', (data) => {
    $chatMessage.insertAdjacentHTML(
      'beforeend',
      `<p><strong>${getTime(data.time)} - </strong>${data.online} user${data.online > 1 ? 's' : ''} online</p>`,
    );
  });

  socket.on('chat message', (data) => {
    let userName = `<b>${data.name}:</b>`;

    if (data.id === myID) {
      userName = `<u>${userName}</u>`;
    }

    $chatMessage.insertAdjacentHTML(
      'beforeend',
      `<p><b>${getTime(data.time)} </b><span style="color: #0633ff;">${userName}</span> ${data.msg}</p>`,
    );

    $chatMessage.scrollTop = $chatMessage.scrollHeight;
  });
});
