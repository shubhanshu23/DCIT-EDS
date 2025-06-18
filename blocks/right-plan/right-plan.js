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
  const tabs = [
    {
      label: 'Life Insurance', form: `
      <form class="tab-form">
        <p class="tabs-subtext">Protect your family today and get <b>₹1 Crore <span class="highlight">@487/month</span></b></p class="tabs-subtext">
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
        <input type="text" name="age" placeholder="Age" required>
        <input type="text" name="phone" placeholder="Phone Number" required>
        <button type="submit">Calculate Premium- INR XX</button>
      </form>
    `,
    },
    {
      label: 'Health Insurance', form: `
      <form class="tab-form">
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
        <input type="text" name="age" placeholder="Age" required>
        <input type="text" name="phone" placeholder="Phone Number" required>
        <button type="submit">Calculate Premium- INR XX</button>
      </form>
    `,
    },
  ];

  // Tabs header
  const tabsHeader = document.createElement('div');
  tabsHeader.className = 'tabs-header';
  const tabContent = document.createElement('div');
  tabContent.className = 'tab-content';

  tabs.forEach((tab, idx) => {
    const btn = document.createElement('button');
    btn.textContent = tab.label;
    btn.className = 'tab-btn';
    if (idx === 0) btn.classList.add('active');
    btn.addEventListener('click', () => {
      block.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      tabContent.innerHTML = tab.form;
    });
    tabsHeader.appendChild(btn);
  });

  tabContent.innerHTML = tabs[0].form;

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
