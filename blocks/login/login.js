export default async function decorate(block) {
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

  function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    userInput.focus();
  }

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';

    const formData = new FormData(form);

    try {
      const loginUrl = `${window.location.origin}/j_security_check`;
      const response = await fetch(loginUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const finalUrl = response.url || '';
        if (response.redirected || (finalUrl && !finalUrl.includes('j_security_check'))) {
          window.location.href = finalUrl || '/';
        } else {
          window.location.reload();
        }
      } else {
        showError('Invalid username or password.');
      }
    } catch (err) {
      showError('An error occurred. Please try again.');
    }
  });

  try {
    const sessionInfo = await fetch(
      `${window.location.origin}/system/sling/info.sessionInfo.json`,
      {
        credentials: 'include',
      },
    );
    if (sessionInfo.ok) {
      const infoData = await sessionInfo.json();
      if (infoData && infoData.userID && infoData.userID !== 'anonymous') {
        window.location.href = '/';
      }
    }
  } catch (e) {
  }
}