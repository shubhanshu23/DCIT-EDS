import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholdersForLocale();
  const leftContent = document.createElement('div');
  leftContent.className = 'right-plan-left';
  leftContent.innerHTML = `
    <h2>${placeholders.planLeftTitle}</h2>
    <p>${placeholders.planLeftDesc}</p>
    <h3>${placeholders.planLeftSubTitle}</h3>
    <ul>
      <li>${placeholders.planLeftDescListOne}</li>
      <li>${placeholders.planLeftDescListTwo}</li>
    </ul>
    <div class="right-plan-stats">
      <div><strong>${placeholders.planLeftPolicyRated}</strong><br><span>${placeholders.policiesSold}</span></div>
      <div><strong>${placeholders.planLeftRegisteredCount}</strong><br><span>${placeholders.registeredConsumer}</span></div>
      <div><strong>${placeholders.planLeftPartnerCount}</strong><br><span>${placeholders.insurancePartners}</span></div>
    </div>
  `;
  const lifeForm = document.createElement('form');
  lifeForm.className = 'tab-form life-form';
  lifeForm.innerHTML = `
    <p class="tabs-subtext"> ${placeholders.lifeFormTitle} <b>₹1 Crore <span class="highlight">@487/month</span></b></p>
    <div class="gender-group">
      <label class="gender-label">
        <input type="radio" name="gender" value="male" required>
        <span>${placeholders.male}</span>
      </label>
      <label class="gender-label">
        <input type="radio" name="gender" value="female" required>
        <span>${placeholders.female}</span>
      </label>
    </div>
    <input type="text" name="name" placeholder="${placeholders.name}" required>
    <input type="number" name="age" placeholder="${placeholders.age}" required>
    <input type="number" name="phone" placeholder="${placeholders.phone}" required>
    <button type="submit">${placeholders.calculatePremium}</button>
  `;

  const healthForm = document.createElement('form');
  healthForm.className = 'tab-form health-form';
  healthForm.innerHTML = `
    <p class="tabs-subtext">${placeholders.healthFormTitle}</p>
    <div class="gender-group">
      <label class="gender-label">
        <input type="radio" name="gender" value="male" required>
        <span>${placeholders.male}</span>
      </label>
      <label class="gender-label">
        <input type="radio" name="gender" value="female" required>
        <span>${placeholders.female}</span>
      </label>
    </div>
    <input type="text" name="name" placeholder="${placeholders.name}" required>
    <input type="number" name="age" placeholder="${placeholders.age}" required>
    <input type="number" name="phone" placeholder="${placeholders.phone}" required>
    <button type="submit">${placeholders.calculatePremium}</button>
  `;

  // Attach premium logic to both forms
  [lifeForm, healthForm].forEach((form) => {
    const btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const premium = Math.floor(Math.random() * 800) + 400;
      btn.textContent = `${placeholders.premium}: ₹${premium}`;
      btn.classList.add('flip-btn-animate');
      btn.disabled = true;
      setTimeout(() => btn.classList.remove('flip-btn-animate'), 1000);
    });

    // Listen for any input change to reset the button
    form.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        btn.textContent = `${placeholders.calculatePremium}`;
        btn.disabled = false;
      });
    });
  });

  // Tabs header
  const tabsHeader = document.createElement('div');
  tabsHeader.className = 'tabs-header';

  const tabBtns = [
    { label: `${placeholders.lifeInsurance}`, form: lifeForm },
    { label: `${placeholders.healthInsurance}`, form: healthForm },
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
