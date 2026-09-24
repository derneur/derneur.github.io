'use strict';

document.getElementById('year').textContent = new Date().getFullYear();

const themeButton = document.querySelector('.theme-toggle');
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'light'));
  themeButton.setAttribute('aria-label', theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему');
  document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#f5f5f2' : '#141414';
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('portfolio-atmosphere-theme') === 'light' ? 'light' : 'dark'; } catch {}
setTheme(savedTheme);
themeButton.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  setTheme(theme);
  try { localStorage.setItem('portfolio-atmosphere-theme', theme); } catch {}
});

const form = document.getElementById('booking-form');
const client = document.getElementById('booking-client');
const owner = document.getElementById('booking-owner');
const summary = document.getElementById('booking-summary');
const state = document.getElementById('booking-state');
const confirmButton = document.getElementById('booking-confirm');
form.addEventListener('submit', event => {
  event.preventDefault();
  summary.textContent = form.elements.service.value + ' · ' + form.elements.time.value;
  state.textContent = 'Ожидает подтверждения';
  confirmButton.disabled = false;
  confirmButton.querySelector('span').textContent = '✓';
  client.hidden = true;
  owner.hidden = false;
  confirmButton.focus();
});
confirmButton.addEventListener('click', () => {
  state.textContent = 'Подтверждено · учебный пример';
  confirmButton.disabled = true;
  confirmButton.querySelector('span').textContent = '✓';
});
document.getElementById('booking-again').addEventListener('click', () => {
  owner.hidden = true;
  client.hidden = false;
  form.querySelector('select').focus();
});

const copyButton = document.getElementById('copy-contact');
const notice = document.getElementById('notice');
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('@derneur_dev');
      notice.textContent = 'Контакт скопирован: @derneur_dev';
    } catch {
      notice.textContent = 'Контакт: @derneur_dev';
    }
    window.setTimeout(() => { notice.textContent = ''; }, 4000);
  });
}
