document.getElementById("year").textContent = new Date().getFullYear();

const themeButton = document.querySelector('.theme-toggle');
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
}
try { setTheme(localStorage.getItem('portfolio-theme') === 'dark'); } catch { setTheme(false); }
themeButton.addEventListener('click', () => {
  const dark = document.documentElement.dataset.theme !== 'dark';
  setTheme(dark);
  try { localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light'); } catch {}
});

const projects = [...document.querySelectorAll('[data-category]')];
document.querySelector('.project-toolbar').hidden = false;
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; });
    document.querySelectorAll('.automation-cases, .case-grid').forEach(group => { group.hidden = ![...group.children].some(child => !child.hidden); });
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
