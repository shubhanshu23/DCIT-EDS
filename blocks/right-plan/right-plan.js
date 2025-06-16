export default function decorate(block) {
  const tabs = [
    { label: 'Life Insurance', form: `
      <form class="tab-form">
        <h3>Life Insurance Calculator</h3>
        <label>Name <input type="text" name="name" required></label>
        <label>Age <input type="number" name="age" required></label>
        <label>Email ID <input type="email" name="email" required></label>
        <label>Income <input type="number" name="income" required></label>
        <button type="submit">Calculate Premium- INR XX</button>
      </form>
    ` },
    { label: 'Health Insurance', form: `
      <form class="tab-form">
        <h3>Health Insurance Calculator</h3>
        <label>Name <input type="text" name="name" required></label>
        <label>Age <input type="number" name="age" required></label>
        <label>Email ID <input type="email" name="email" required></label>
        <label>Income <input type="number" name="income" required></label>
        <button type="submit">Calculate Premium- INR XX</button>
      </form>
    ` },
    { label: 'Retirement Planner', form: `
      <form class="tab-form">
        <h3>Retirement Planner</h3>
        <label>Name <input type="text" name="name" required></label>
        <label>Current Age <input type="number" name="age" required></label>
        <label>Retirement Age <input type="number" name="retirement_age" required></label>
        <label>Monthly Savings <input type="number" name="savings" required></label>
        <button type="submit">Calculate Plan</button>
      </form>
    ` },
    { label: 'Home Loan Calculator', form: `
      <form class="tab-form">
        <h3>Home Loan Calculator</h3>
        <label>Loan Amount <input type="number" name="amount" required></label>
        <label>Tenure (years) <input type="number" name="tenure" required></label>
        <label>Interest Rate (%) <input type="number" name="rate" required></label>
        <button type="submit">Calculate EMI</button>
      </form>
    ` },
    { label: 'Car Loan Calculator', form: `
      <form class="tab-form">
        <h3>Car Loan Calculator</h3>
        <label>Loan Amount <input type="number" name="amount" required></label>
        <label>Tenure (years) <input type="number" name="tenure" required></label>
        <label>Interest Rate (%) <input type="number" name="rate" required></label>
        <button type="submit">Calculate EMI</button>
      </form>
    ` },
    { label: 'EMI Calculator', form: `
      <form class="tab-form">
        <h3>EMI Calculator</h3>
        <label>Loan Amount <input type="number" name="amount" required></label>
        <label>Tenure (months) <input type="number" name="tenure" required></label>
        <label>Interest Rate (%) <input type="number" name="rate" required></label>
        <button type="submit">Calculate EMI</button>
      </form>
    ` },
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
      block.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabContent.innerHTML = tab.form;
    });
    tabsHeader.appendChild(btn);
  });

  // Show the first tab's form by default
  tabContent.innerHTML = tabs[0].form;

  block.innerHTML = '';
  block.appendChild(tabsHeader);
  block.appendChild(tabContent);
}