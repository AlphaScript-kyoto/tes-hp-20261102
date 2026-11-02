'use strict';
(() => {
  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('menu-toggle');
  const menu = document.getElementById('main-nav');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) setMenu(false); });
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 8), { passive: true });

  const form = document.getElementById('booking-form');
  const result = document.getElementById('booking-result');
  const summary = document.getElementById('booking-summary');
  const formError = document.getElementById('form-error');
  const date = document.getElementById('date');
  // Local calendar date, not UTC, to avoid selecting yesterday in JST.
  const now = new Date();
  const today = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  date.min = today;

  const names = [ ['お名前', 'name'], ['メールアドレス', 'email'], ['メニュー', 'service'], ['ご希望日', 'date'], ['ご希望時間', 'time'], ['ご要望', 'message'] ];
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formError.hidden = true;
    if (!form.checkValidity()) {
      formError.textContent = '必須項目を正しく入力してください。';
      formError.hidden = false;
      form.reportValidity();
      return;
    }
    const chosenDate = new Date(`${date.value}T00:00:00`);
    if (chosenDate.getDay() === 1) {
      formError.textContent = '月曜日は定休日です。別の日をお選びください。';
      formError.hidden = false;
      date.focus();
      return;
    }
    if (chosenDate.getDay() === 2 && Math.ceil(chosenDate.getDate() / 7) === 2) {
      formError.textContent = '第2火曜日は定休日です。別の日をお選びください。';
      formError.hidden = false;
      date.focus();
      return;
    }
    const data = new FormData(form);
    summary.replaceChildren();
    names.forEach(([label, key]) => {
      const value = (data.get(key) || '').toString().trim();
      if (!value) return;
      const row = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = label;
      dd.textContent = value; // Using textContent prevents HTML injection.
      row.append(dt, dd);
      summary.append(row);
    });
    form.hidden = true;
    result.hidden = false;
    result.focus();
  });
  document.getElementById('booking-again').addEventListener('click', () => {
    form.reset();
    formError.hidden = true;
    result.hidden = true;
    form.hidden = false;
    document.getElementById('name').focus();
  });
})();
