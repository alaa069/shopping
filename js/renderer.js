const electron = require('electron');
const { ipcRenderer } = electron;

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    ipcRenderer.send('login', username, password);
}