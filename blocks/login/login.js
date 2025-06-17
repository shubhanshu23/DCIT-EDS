export default async function decorate(block) {
  const MOCK_CREDENTIALS = {
    Deloitte: 'deloitte@123!',
    Admin: 'admin@123!',
  };
  const setCookie = (name, value, hours) => {
    const date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };
  const getUsernameFromCookie = () => {
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find((cookie) => cookie.trim().startsWith('dcit_username='));
    if (userCookie) {
      return userCookie.split('=')[1];
    }
    return null;
  };
  const checkLoginCookie = () => {
    const username = getUsernameFromCookie();
    if (username) {
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
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', '#');
  const userLabel = document.createElement('label');
  userLabel.setAttribute('for', 'login-username');
  userLabel.textContent = 'Username';
  const userInput = document.createElement('input');
  userInput.type = 'text';
  userInput.id = 'login-username';
  userInput.name = 'j_username';
  userInput.required = true;
  const passLabel = document.createElement('label');
  passLabel.setAttribute('for', 'login-password');
  passLabel.textContent = 'Password';
  const passInput = document.createElement('input');
  passInput.type = 'password';
  passInput.id = 'login-password';
  passInput.name = 'j_password';
  passInput.required = true;
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = 'Log In';
  form.append(userLabel, userInput, passLabel, passInput, submitBtn);
  block.append(form);
  const showError = (msg) => {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    userInput.focus();
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    const username = userInput.value.trim();
    const password = passInput.value;
    if (MOCK_CREDENTIALS[username] === password) {
      setCookie('dcit_username', username, 24);
      window.location.href = '/';
    } else {
      showError('Invalid username or password.');
    }
  });
}
