document.getElementById("year").textContent = new Date().getFullYear();

const themeButton = document.querySelector('.theme-toggle');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
  document.querySelector('meta[name="theme-color"]').content = dark ? '#101011' : '#f3f3f1';
}
try { setTheme(localStorage.getItem('portfolio-atmosphere-theme') !== 'light'); } catch { setTheme(true); }
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  setTheme(dark);
  try { localStorage.setItem('portfolio-atmosphere-theme', dark ? 'dark' : 'light'); } catch {}
});

const projects = [...document.querySelectorAll('[data-category]')];
document.querySelector('.project-toolbar').hidden = false;
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; });
    document.querySelectorAll('.automation-cases, .case-grid').forEach(group => { group.hidden = ![...group.children].some(child => !child.hidden); });
    document.querySelector('.research-heading').hidden = button.dataset.filter !== 'all' && button.dataset.filter !== 'ml';
    document.querySelector('.filter-count').textContent = `Показано: ${projects.filter(project => !project.hidden).length}`;
    updateScroll();
  });
});

const progress = document.querySelector('.reading-progress');
const backTop = document.querySelector('.back-top');
let scrollPending = false;
function updateScroll() {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0})`;
  backTop.classList.toggle('shown', window.scrollY > 600);
  scrollPending = false;
}
window.addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
  observer.observe(element);
});

// Project notes deliberately distinguish prototypes from production results.
const caseNotes = [
  { title: 'Coin Fortuna', type: 'Telegram-продукт', intro: 'Игры, профиль и операции с балансом — в одном Telegram-интерфейсе.', task: 'Связать пользовательские сценарии, платежи и администрирование в единую систему.', built: 'Профили, 7 игровых механик, бонусы и рефералы. Журнал операций, защита от повторных списаний, возвраты и восстановление после сбоев.', result: 'Проект показывает не только интерфейс бота, но и работу со сложной логикой. В кодовой базе — 109 автотестов.', limit: 'Здесь представлена схема продукта, а не публичная игровая площадка. Денежные операции на этом сайте недоступны.' },
  { title: 'Запись в автосервис', type: 'Сайт · демонстрационный прототип', intro: 'Клиент выбирает услугу и время. Владелец получает понятную карточку записи.', task: 'Показать путь от выбора услуги до обработки заявки без звонков и переписки.', built: 'Клиентский экран и кабинет владельца. В исходном прототипе есть адаптации под автосервис, студию красоты и стоматологию.', result: 'Ниже можно попробовать упрощённый сценарий: создать учебную запись и подтвердить её от лица владельца.', limit: 'Это локальная демонстрация. Ничего не отправляется в автосервис; сервер, уведомления и сохранение между сеансами не подключены.', demo: true },
  { title: 'Фотографии товаров → ZIP', type: 'Telegram · инструмент для каталога', intro: 'Вместо сохранения картинок по одной — ссылка на каталог и подготовленный архив.', task: 'Автоматизировать сбор доступных фотографий товаров из разрешённых источников.', built: 'Поиск изображений, проверки качества, удаление дубликатов, упаковка в ZIP. Прогресс и отмена задачи в Telegram.', result: 'Сценарий объединяет повторяющиеся действия в одну задачу для бота.', limit: 'Доступность зависит от сайта-источника. Используется только контент с разрешением; публичного демо здесь нет.' },
  { title: 'Архив Telegram-публикаций', type: 'Telegram · автоматизация', intro: 'Текст, фотографии и альбомы — с сохранением позиции обработки.', task: 'Переносить новые публикации в архив и продолжать работу после перезапуска.', built: 'Обработка текста, форматирования, медиа и альбомов. SQLite хранит контрольную точку, чтобы догнать пропущенные публикации.', result: 'Автоматизирован перенос новых постов из доступного канала в архив.', limit: 'Только собственный контент или контент с разрешением. Изменения и удаления исходных публикаций не синхронизируются.' },
  { title: 'Площадь по планировке', type: 'OCR · исследовательский проект', intro: 'Из изображения планировки — в числовую оценку площади.', task: 'Найти нужную площадь среди множества чисел на чертеже.', built: 'Распознавание текста и ранжирование найденных кандидатов с помощью модели.', result: 'Средняя абсолютная ошибка на независимом контроле — 0,94 м². Это величина ошибки, а не гарантия точности каждого изображения.', limit: 'Метрика относится к экспериментальной выборке. Для другого набора планировок нужна отдельная проверка.' },
  { title: 'Валидатор жалоб', type: 'ML · исследовательский проект', intro: 'Модель помогает оценивать обоснованность жалоб.', task: 'Проверить, можно ли классифицировать обращения точнее базовой стратегии.', built: 'Эксперименты с CatBoost, временным разделением данных и независимой проверкой.', result: 'F1 — 0,4223 против 0,2597 у базовой стратегии: относительный прирост около 63%. F1 учитывает точность и полноту классификации.', limit: 'Это результат эксперимента, не подтверждённый эффект внедрения. Решения по жалобам требуют контроля человека.' },
  { title: 'Оценка аренды', type: 'ML · исследовательский проект', intro: 'Оценка стоимости по характеристикам недвижимости.', task: 'Получить прогноз точнее простой оценки по медианной цене.', built: 'Ансамбль моделей с признаками площади, района, этажа и расстояния до центра.', result: 'Средняя абсолютная ошибка — 831 против 1472 у медианной стратегии: примерно на 43,5% ниже на экспериментальных данных.', limit: 'Не сервис оценки текущего рынка. Для нового города или периода нужны актуальные данные и повторная проверка.' }
];
const moduleNotes = {
  profile: ['01 / ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ', 'Вся информация в одном месте', 'Пользователь видит баланс и историю своих операций. За интерфейсом — единый учёт действий и изменений.'],
  games: ['02 / ИГРОВЫЕ СЦЕНАРИИ', 'Один интерфейс — разные механики', 'Семь игровых механик связаны с профилем и балансом. Для каждой важны корректный результат и учёт операции.'],
  payments: ['03 / ПЛАТЕЖИ И УЧЁТ', 'Операция не должна потеряться', 'Пополнения, выводы и возвраты связаны с журналом операций. Предусмотрена защита от повторного списания и восстановление после сбоев.'],
  bonus: ['04 / БОНУСЫ И РЕФЕРАЛЫ', 'Дополнительные сценарии продукта', 'VIP-возможности и реферальная система встроены в общую логику профиля. Начисления учитываются вместе с остальными операциями.']
};
document.querySelectorAll('[data-module]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-module]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const [label, title, description] = moduleNotes[button.dataset.module];
  const detail = document.getElementById('module-detail');
  detail.querySelector('.foundation-label').textContent = label;
  detail.querySelector('b').textContent = title;
  detail.querySelector('p').textContent = description;
}));
const dialog = document.getElementById('project-dialog');
const content = document.getElementById('dialog-content');
const caseHighlights = [
  [['109', 'автотестов'], ['7', 'игровых механик'], ['3', 'сценария платежей']],
  [['Клиент', 'выбирает услугу'], ['Заявка', 'попадает владельцу'], ['Демо', 'можно попробовать']],
  [['Ссылка', 'входные данные'], ['Проверка', 'качество и повторы'], ['ZIP', 'готовый архив']],
  [['Текст', 'с форматированием'], ['Медиа', 'включая альбомы'], ['SQLite', 'позиция обработки']],
  [['OCR', 'чтение чисел'], ['Модель', 'выбор площади'], ['0,94 м²', 'ошибка на контроле']],
  [['CatBoost', 'классификатор'], ['0,4223', 'F1 в эксперименте'], ['+63%', 'F1 к базовой стратегии']],
  [['Ансамбль', 'прогноз цены'], ['MAE', 'метрика ошибки'], ['−43,5%', 'ошибка к базовой оценке']]
];
let returnFocus;
function closeProject() { dialog.close(); }
dialog.querySelector('.dialog-close').addEventListener('click', closeProject);
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); returnFocus?.focus(); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeProject(); } });
function openProject(index, trigger) {
  const note = caseNotes[index];
  const wasOpen = dialog.open;
  if (!wasOpen) returnFocus = trigger;
  dialog.querySelector('.dialog-top > span').textContent = `FORM / LOGIC · КЕЙС ${String(index + 1).padStart(2, '0')} / 07`;
  content.replaceChildren();
  const label = document.createElement('p'); label.className = 'kicker'; label.textContent = note.type;
  const title = document.createElement('h2'); title.id = 'dialog-title'; title.textContent = note.title;
  const intro = document.createElement('p'); intro.className = 'dialog-intro'; intro.textContent = note.intro;
  content.append(label, title, intro);
  const highlights = document.createElement('div'); highlights.className = 'dialog-highlights';
  caseHighlights[index].forEach(([value, caption]) => {
    const item = document.createElement('div'); const strong = document.createElement('strong'); const span = document.createElement('span');
    strong.textContent = value; span.textContent = caption; item.append(strong, span); highlights.append(item);
  });
  content.append(highlights);
  [['Задача', note.task], ['Что сделано', note.built], ['Результат', note.result]].forEach(([heading, text]) => {
    const section = document.createElement('section'); section.className = 'case-story';
    const h = document.createElement('h3'); h.textContent = heading;
    const p = document.createElement('p'); p.textContent = text; section.append(h, p); content.append(section);
  });
  if (note.demo) createDemo();
  const limit = document.createElement('p'); limit.className = 'project-note'; limit.textContent = note.limit;
  const link = document.createElement('a'); link.className = 'button button-primary'; link.href = 'https://t.me/derneur_dev'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'Обсудить похожую задачу ↗';
  content.append(limit, link);
  const navigation = document.createElement('nav'); navigation.className = 'case-navigation'; navigation.setAttribute('aria-label', 'Другие проекты');
  [['← Предыдущий', index - 1], ['Следующий кейс →', index + 1]].forEach(([caption, targetIndex]) => {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = caption;
    button.disabled = targetIndex < 0 || targetIndex >= caseNotes.length;
    if (!button.disabled) { button.setAttribute('aria-label', `${caption}: ${caseNotes[targetIndex].title}`); button.addEventListener('click', () => openProject(targetIndex, returnFocus)); }
    navigation.append(button);
  });
  content.append(navigation);
  if (!wasOpen) dialog.showModal();
  document.body.classList.add('dialog-open'); dialog.scrollTop = 0;
  if (note.demo && !wasOpen) content.querySelector('select').focus();
  else { title.tabIndex = -1; title.focus({ preventScroll: true }); }
}
// A project link must also work after filtering that project out.
document.querySelectorAll('a[href="#business-web"], a[href="#coin-fortuna"], a[href="#photo-bot"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target.hidden) document.querySelector('[data-filter="all"]').click();
  });
});
projects.forEach((project, index) => {
  const actions = document.createElement('div'); actions.className = 'case-actions';
  const button = document.createElement('button'); button.type = 'button'; button.className = 'case-button'; button.textContent = 'Разобрать проект ↗'; button.setAttribute('aria-label', `${button.textContent}: ${caseNotes[index].title}`); button.addEventListener('click', () => openProject(index, button));
  actions.append(button);
  if (index === 2) {
    const demoLink = document.createElement('a'); demoLink.href = '#pipeline-title'; demoLink.className = 'case-demo-link'; demoLink.textContent = 'Попробовать симулятор ↗'; actions.append(demoLink);
  }
  (project.querySelector('.case-copy, .booking-copy') || project).append(actions);
});
function createDemo(target = content, prefix = "dialog") {
  const demo = document.createElement('section'); demo.className = 'booking-demo';
  demo.innerHTML = `<p class="kicker">ПОПРОБУЙТЕ · БЕЗ ЛИЧНЫХ ДАННЫХ</p><h3>Вы — клиент</h3><form id="${prefix}-form"><label>Услуга<select name="service"><option>Диагностика автомобиля</option><option>Замена масла</option><option>Шиномонтаж</option></select></label><label>Время · учебный день<select name="time"><option>10:30</option><option>12:00</option><option>15:30</option></select></label><button class="button button-primary" type="submit">Создать учебную запись →</button></form><div class="demo-owner" hidden><p class="kicker">ТЕПЕРЬ ВЫ — ВЛАДЕЛЕЦ</p><p class="demo-summary"></p><p class="demo-status" role="status" aria-live="polite"></p><button type="button" class="case-button" data-demo-confirm>Подтвердить запись ✓</button></div>`;
  target.append(demo);
  const form = demo.querySelector('form'); const owner = demo.querySelector('.demo-owner'); const confirm = demo.querySelector('[data-demo-confirm]');
  form.addEventListener('submit', event => { event.preventDefault(); owner.hidden = false; demo.querySelector('.demo-summary').textContent = `${form.elements.service.value} · ${form.elements.time.value}`; demo.querySelector('.demo-status').textContent = 'Новая заявка · ожидает подтверждения'; confirm.disabled = false; confirm.textContent = 'Подтвердить запись ✓'; confirm.focus(); });
  confirm.addEventListener('click', () => { demo.querySelector('.demo-status').textContent = 'Запись подтверждена. Учебный сценарий завершён — никаких сообщений не отправлено.'; confirm.disabled = true; confirm.textContent = 'Подтверждено ✓'; });
}
createDemo(document.getElementById('inline-booking'), 'inline');
document.querySelectorAll('.service-row').forEach(row => {
  const arrow = row.querySelector('b'); const link = document.createElement('a'); link.href = '#contact'; link.className = 'service-link'; link.textContent = '↗'; link.setAttribute('aria-label', `Обсудить: ${row.querySelector('h3').textContent}`); arrow.replaceWith(link);
});
const copyContact = document.getElementById('copy-contact');
if (navigator.clipboard && window.isSecureContext) {
  copyContact.hidden = false;
  copyContact.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('@derneur_dev'); document.getElementById('notice').textContent = 'Контакт скопирован: @derneur_dev'; }
    catch { document.getElementById('notice').textContent = 'Не удалось скопировать. Контакт: @derneur_dev'; }
    window.setTimeout(() => { document.getElementById('notice').textContent = ''; }, 4000);
  });
}
