import { sendAuthInfoBeacon } from '../../scripts/datalayer.js';
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();

  const setCookie = (name, value, hours) => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };
  const getUsernameFromCookie = () => {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find((cookie) => cookie.trim().startsWith('dcit_ud='));
    if (userCookie) {
      return atob(userCookie.split('=')[1]);
    }
    return null;
  };
  const checkLoginCookie = () => {
    const userDetails = getUsernameFromCookie();
    if (userDetails) {
      window.location.href = '/';
      return true;
    }
    return false;
  };
  if (checkLoginCookie()) {
    return;
  }
  const cells = [...block.children];
  if (cells[0]) {
    const titleText = cells[0].textContent.trim();
    if (titleText) {
      cells[0].innerHTML = `<h2>${titleText}</h2>`;
    } else {
      block.removeChild(cells[0]);
    }
  }
  if (cells[1]) {
    const descText = cells[1].innerHTML.trim();
    if (descText) {
      if (!descText.startsWith('<')) {
        cells[1].innerHTML = `<p>${descText}</p>`;
      }
    } else {
      block.removeChild(cells[1]);
    }
  }
  const errorDiv = document.createElement('div');
  errorDiv.className = 'login-error';
  block.append(errorDiv);
  const successDiv = document.createElement('div');
  successDiv.className = 'login-success';
  block.append(successDiv);
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');
  const userLabel = document.createElement('label');
  userLabel.setAttribute('for', 'login-username');
  userLabel.textContent = placeholders.username;
  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.id = 'login-username';
  userInput.name = 'j_username';
  userInput.required = true;
  const passLabel = document.createElement('label');
  passLabel.setAttribute('for', 'login-password');
  passLabel.textContent = placeholders.password;
  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.id = 'login-password';
  passInput.name = 'j_password';
  passInput.required = true;
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = placeholders.logIn;
  form.append(userLabel, userInput, passLabel, passInput, submitBtn);
  block.append(form);
  const showError = (msg) => {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    userInput.focus();
  };
  const showSuccess = (msg) => {
    successDiv.textContent = msg;
    successDiv.style.display = 'block';
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    const username = userInput.value.trim();
    const password = passInput.value;

    try {
      const response = await fetch('/blocks/login/users.json');
      if (!response.ok) throw new Error('Failed to load users data');
      const data = await response.json();

      const user = data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
      if (user && user.password === password) {
        delete user.password;
        setCookie('dcit_ud', btoa(JSON.stringify(user)), 24);
        sendAuthInfoBeacon(user, 'login');
        showSuccess(`${placeholders.welcomeBack}, ${user.name}! ${placeholders.loginRedirectMessage}`);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        showError(placeholders.invalidLogin);
      }
    } catch (error) {
      showError(placeholders.errorApiLogin);
    }
  });
}
