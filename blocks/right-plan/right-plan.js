export default function decorate(block) {
  const leftContent = document.createElement('div');
  leftContent.className = 'right-plan-left';
  leftContent.innerHTML = `
    <h2>Life Insurance</h2>
    <p>Life is unpredictable, and while we all hope for the best, being prepared is essential. Life insurance is a financial safety net that protects your loved ones in your absence. It helps your family manage expenses and maintain stability during difficult times.</p>
    <h3>Understanding Life Insurance: Definition and Meaning</h3>
    <ul>
      <li>Life insurance is a contract between a policyholder and an insurance company where the insurer pays a set amount to the nominee if the policyholder dies during the policy term, in return for regular premium payments.</li>
      <li>Some plans also offer survival or maturity benefits, critical illness coverage, and tax benefits, making life insurance a smart tool for protection and long-term financial planning.</li>
    </ul>
    <div class="right-plan-stats">
      <div><strong>4.8 Rated</strong><br><span>Policies Sold</span></div>
      <div><strong>5.3 Crore</strong><br><span>Registered Consumer</span></div>
      <div><strong>10.5 Crore</strong><br><span>Insurance Partners</span></div>
    </div>
  `;
  const lifeForm = document.createElement('form');
  lifeForm.className = 'tab-form life-form';
  lifeForm.innerHTML = `
    <p class="tabs-subtext">Protect your family today and get <b>₹1 Crore <span class="highlight">@487/month</span></b></p>
    <div class="gender-group">
      <label class="gender-label">
        <input type="radio" name="gender" value="male" required>
        <span>Male</span>
      </label>
      <label class="gender-label">
        <input type="radio" name="gender" value="female" required>
        <span>Female</span>
      </label>
    </div>
    <input type="text" name="name" placeholder="Name" required>
    <input type="number" name="age" placeholder="Age" required>
    <input type="number" name="phone" placeholder="Phone Number" required>
    <button type="submit">Calculate Premium</button>
  `;

  const healthForm = document.createElement('form');
  healthForm.className = 'tab-form health-form';
  healthForm.innerHTML = `
    <p class="tabs-subtext">Get 20 Lakh Surgery Cover</p>
    <div class="gender-group">
      <label class="gender-label">
        <input type="radio" name="gender" value="male" required>
        <span>Male</span>
      </label>
      <label class="gender-label">
        <input type="radio" name="gender" value="female" required>
        <span>Female</span>
      </label>
    </div>
    <input type="text" name="name" placeholder="Name" required>
    <input type="number" name="age" placeholder="Age" required>
    <input type="number" name="phone" placeholder="Phone Number" required>
    <button type="submit">Calculate Premium</button>
  `;

  // Attach premium logic to both forms
  [lifeForm, healthForm].forEach((form) => {
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const premium = Math.floor(Math.random() * 800) + 400;
      btn.textContent = `Premium: ₹${premium}`;
      btn.classList.add('flip-btn-animate');
      btn.disabled = true;
      setTimeout(() => btn.classList.remove('flip-btn-animate'), 1000);
    });

    // Listen for any input change to reset the button
    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        btn.textContent = 'Calculate Premium';
        btn.disabled = false;
      });
    });
  });

  // Tabs header
  const tabsHeader = document.createElement('div');
  tabsHeader.className = 'tabs-header';

  const tabBtns = [
    { label: 'Life Insurance', form: lifeForm },
    { label: 'Health Insurance', form: healthForm },
  ];

  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';
  tabContent.appendChild(lifeForm);
  tabContent.appendChild(healthForm);

  // Show first form by default
  lifeForm.style.display = '';
  healthForm.style.display = 'none';

  tabBtns.forEach((tab, index) => {
    const btn = document.createElement('button');
    btn.textContent = tab.label;
    btn.className = 'tab-btn';
    if (index === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      tabsHeader.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      lifeForm.style.display = index === 0 ? '' : 'none';
      healthForm.style.display = index === 1 ? '' : 'none';
    });
    tabsHeader.appendChild(btn);
  });

  const rightContent = document.createElement('div');
  rightContent.className = 'right-plan-right';
  rightContent.appendChild(tabsHeader);
  rightContent.appendChild(tabContent);

  const container = document.createElement('div');
  container.className = 'right-plan-container';
  container.appendChild(leftContent);
  container.appendChild(rightContent);

  block.innerHTML = '';
  block.appendChild(container);
}
