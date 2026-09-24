(() => {
  'use strict';
  const operation = document.getElementById('operation-send');
  const ledger = document.querySelector('.operation-ledger');
  let recorded = false;
  operation.addEventListener('click', () => {
    ledger.textContent = recorded
      ? 'Повтор распознан. В журнале по-прежнему 1 операция: DEMO-001. Второй записи нет.'
      : 'Операция DEMO-001 записана. Всего в журнале: 1. Попробуйте отправить её ещё раз.';
    recorded = true;
    operation.textContent = 'Отправить ту же операцию ещё раз ↻';
  });
  document.getElementById('operation-reset').addEventListener('click', () => {
    recorded = false; ledger.textContent = 'В учебном журнале пока нет операций.';
    operation.textContent = 'Обработать учебную операцию →';
  });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const source = document.getElementById('pipeline-source');
  const cloud = document.querySelector('.file-cloud');
  const pipelineStatus = document.getElementById('pipeline-status');
  const run = document.getElementById('pipeline-run');
  const again = document.getElementById('pipeline-reset');
  const steps = [...document.querySelectorAll('[data-stage]')];
  const sets = {
    catalog: [1, 2, 3, 1, 4, 5, 2, 6].map(id => ({ id, size: 'large' })),
    clean: [1, 2, 3, 4, 5, 6].map(id => ({ id, size: 'large' })),
    mixed: [1, 2, 1, 3, 4, 5, 6, 2, 7, 8].map((id, index) => ({ id, size: [3, 6].includes(index) ? 'small' : 'large' }))
  };
  let pipelineEpoch = 0, running = false;
  function buildFiles() {
    cloud.replaceChildren();
    sets[source.value].forEach((file, index) => {
      const tile = document.createElement('div'); tile.className = 'sample-file';
      tile.dataset.file = String(index); tile.style.setProperty('--file-hue', String(220 + file.id * 13));
      const icon = document.createElement('span'); icon.textContent = ['◇', '◯', '✳', '◎'][file.id % 4]; icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('b'); label.textContent = `Фото ${file.id}`;
      const note = document.createElement('small'); note.textContent = file.size === 'small' ? 'маленькое' : 'исходник';
      tile.append(icon, label, note); cloud.append(tile);
    });
  }
  function resetPipeline(message = 'Все данные демонстрационные. Никаких запросов к чужим сайтам.') {
    pipelineEpoch++; running = false; source.disabled = false; run.disabled = false; again.disabled = true;
    run.textContent = 'Запустить процесс →'; pipelineStatus.textContent = message;
    steps.forEach(step => step.classList.remove('active', 'done'));
    cloud.classList.remove('packed'); buildFiles();
  }
  function stage(index) { steps.forEach((step, i) => { step.classList.toggle('active', i === index); step.classList.toggle('done', i < index); }); }
  run.addEventListener('click', async () => {
    if (running) return;
    const current = ++pipelineEpoch; running = true; source.disabled = true; run.disabled = true; again.disabled = false;
    cloud.classList.remove('packed'); buildFiles(); stage(0);
    pipelineStatus.textContent = `Получено ${sets[source.value].length} учебных файлов. Проверяем содержимое…`;
    await wait(reducedMotion.matches ? 250 : 850);
    if (current !== pipelineEpoch) return;
    stage(1);
    const seen = new Set(); let duplicate = 0, small = 0, kept = 0;
    [...cloud.children].forEach((tile, index) => {
      const file = sets[source.value][index];
      if (file.size === 'small') { small++; tile.classList.add('excluded'); tile.querySelector('small').textContent = 'малый размер'; }
      else if (seen.has(file.id)) { duplicate++; tile.classList.add('excluded'); tile.querySelector('small').textContent = 'повтор'; }
      else { seen.add(file.id); kept++; tile.classList.add('accepted'); tile.querySelector('small').textContent = 'подходит ✓'; }
    });
    pipelineStatus.textContent = `Проверка: повторов — ${duplicate}, мелких файлов — ${small}. Подходит: ${kept}.`;
    await wait(reducedMotion.matches ? 250 : 1100);
    if (current !== pipelineEpoch) return;
    stage(2); cloud.classList.add('packed');
    pipelineStatus.textContent = `Готово: ${kept} уникальных изображений в подборке. Повторов: ${duplicate}, мелких файлов: ${small}. Это симуляция, архив не скачивается.`;
    steps[2].classList.add('done'); run.textContent = 'Запустить ещё раз ↻'; run.disabled = false; source.disabled = false; running = false;
  });
  source.addEventListener('change', () => resetPipeline());
  again.addEventListener('click', () => resetPipeline());
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    if (running) resetPipeline('Процесс остановлен при переключении вкладки. Можно запустить снова.');
  });
  buildFiles();
})();
