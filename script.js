
// ===== 手機版漢堡選單 =====
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
if (menuButton && navigation) { const closeMenu = () => { navigation.classList.remove('is-open'); menuButton.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '開啟導覽選單') }; menuButton.addEventListener('click', () => { const open = navigation.classList.toggle('is-open'); menuButton.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單') }); navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu)); document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeMenu(); menuButton.focus() } }) }

// ===== 背景音樂 =====
const music = document.querySelector('#background-music'), playButton = document.querySelector('#music-toggle'), playIcon = document.querySelector('.music-icon'), playLabel = document.querySelector('.music-label'), loopButton = document.querySelector('#loop-toggle'), loopLabel = document.querySelector('.loop-label'), volumeSlider = document.querySelector('#volume-slider'), musicStatus = document.querySelector('#music-status');
if (music && playButton && loopButton && volumeSlider) { const saved = localStorage.getItem('portfolioMusicVolume'); music.volume = saved === null ? .25 : Math.min(1, Math.max(0, Number(saved))); volumeSlider.value = music.volume; music.loop = true; const playing = v => { playIcon.textContent = v ? '❚❚' : '▶'; playLabel.textContent = v ? '暫停' : '播放'; playButton.setAttribute('aria-pressed', String(v)) }; const looping = v => { music.loop = v; loopButton.classList.toggle('is-active', v); loopButton.setAttribute('aria-pressed', String(v)); loopLabel.textContent = v ? '循環中' : '循環' }; looping(true); const auto = async () => { try { await music.play(); playing(true); musicStatus.textContent = '' } catch (e) { playing(false); musicStatus.textContent = '瀏覽器已阻擋自動播放，點擊頁面後將再次嘗試' } }; auto(); document.addEventListener('pointerdown', () => { if (music.paused) auto() }, { once: true }); playButton.addEventListener('click', async () => { if (!music.paused) { music.pause(); playing(false) } else { try { await music.play(); playing(true); musicStatus.textContent = '' } catch (e) { musicStatus.textContent = '無法播放音樂檔案' } } }); loopButton.addEventListener('click', () => looping(!music.loop)); volumeSlider.addEventListener('input', () => { music.volume = Number(volumeSlider.value); localStorage.setItem('portfolioMusicVolume', volumeSlider.value) }); music.addEventListener('error', () => musicStatus.textContent = '尚未載入此頁面的背景音樂') }
// ===== Portfolio 專案分類篩選 =====
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach(button => button.addEventListener('click', () => { const filter = button.dataset.filter; filterButtons.forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false') }); button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); projectCards.forEach(card => { card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter) }) }));

// ===== 專案內容展開與收合 =====
document.querySelectorAll('.detail-toggle').forEach(button => button.addEventListener('click', () => { const panel = document.getElementById(button.getAttribute('aria-controls')); const expanded = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!expanded)); panel.hidden = expanded; button.lastElementChild.textContent = expanded ? '＋' : '−' }));

// ===== 捲動進場效果 =====
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) { revealItems.forEach(item => item.classList.add('is-visible')) } else { const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: .12 }); revealItems.forEach(item => observer.observe(item)) }

// ===== 閱讀進度條與返回頁首 =====
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');
const updateScrollUI = () => { const scrollable = document.documentElement.scrollHeight - window.innerHeight; const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0; if (progressBar) progressBar.style.width = `${Math.min(percent, 100)}%`; if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500) };
window.addEventListener('scroll', updateScrollUI, { passive: true }); updateScrollUI();
if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

// ===== 自動顯示目前年份 =====
document.querySelectorAll('.current-year').forEach(item => item.textContent = new Date().getFullYear());
// ===== Reading 頁面互動 =====
const bookToggles = [...document.querySelectorAll('.book-toggle')];
function setBookState(button, expanded) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (!panel) return;
    button.setAttribute('aria-expanded', String(expanded));
    panel.hidden = !expanded;
    const icon = button.querySelector('span');
    if (icon) icon.textContent = expanded ? '−' : '＋';
    button.childNodes[0].nodeValue = expanded ? '收合內容 ' : '深入閱讀 ';
}
bookToggles.forEach(button => button.addEventListener('click', () => {
    setBookState(button, button.getAttribute('aria-expanded') !== 'true');
    updateExpandAllButton();
}));
const expandAllBooks = document.querySelector('#expand-all-books');
function updateExpandAllButton() {
    if (!expandAllBooks || !bookToggles.length) return;
    const allExpanded = bookToggles.every(button => button.getAttribute('aria-expanded') === 'true');
    expandAllBooks.textContent = allExpanded ? '收合全部內容' : '展開全部內容';
    expandAllBooks.setAttribute('aria-pressed', String(allExpanded));
}
if (expandAllBooks) expandAllBooks.addEventListener('click', () => {
    const shouldExpand = !bookToggles.every(button => button.getAttribute('aria-expanded') === 'true');
    bookToggles.forEach(button => setBookState(button, shouldExpand));
    updateExpandAllButton();
});
const tocLinks = [...document.querySelectorAll('.reading-toc nav a')];
const bookArticles = [...document.querySelectorAll('.book-article')];
if ('IntersectionObserver' in window && tocLinks.length && bookArticles.length) {
    const tocObserver = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        tocLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, .25, .5] });
    bookArticles.forEach(article => tocObserver.observe(article));
}

// ===== FINAL V5 controls =====
const musicDock = document.querySelector('.music-dock'), musicPeek = document.querySelector('.music-peek'); let dockTimer; function closeDock() { if (!musicDock) return; musicDock.classList.remove('is-open'); musicDock.classList.add('is-retracting'); musicPeek?.setAttribute('aria-expanded', 'false'); setTimeout(() => musicDock.classList.remove('is-retracting'), 320) } if (musicDock && musicPeek) { musicPeek.addEventListener('click', e => { e.stopPropagation(); musicDock.classList.toggle('is-open'); musicPeek.setAttribute('aria-expanded', String(musicDock.classList.contains('is-open'))) }); musicDock.addEventListener('mouseenter', () => { clearTimeout(dockTimer); musicDock.classList.remove('is-retracting') }); musicDock.addEventListener('mouseleave', () => { clearTimeout(dockTimer); dockTimer = setTimeout(closeDock, 180) }); document.addEventListener('pointerdown', e => { if (!musicDock.contains(e.target)) closeDock() }) }
const noteSearch = document.querySelector('#note-search'), noteCards = [...document.querySelectorAll('.note-card')], noteFilters = [...document.querySelectorAll('.note-filter')], noteGroups = [...document.querySelectorAll('.note-group')]; let activeNoteFilter = 'all'; function filterNotes() { const q = (noteSearch?.value || '').trim().toLowerCase(); noteCards.forEach(c => { c.hidden = !((activeNoteFilter === 'all' || c.dataset.noteCategory === activeNoteFilter) && (!q || `${c.textContent} ${c.dataset.noteKeywords || ''}`.toLowerCase().includes(q))) }); noteGroups.forEach(g => { g.hidden = !((activeNoteFilter === 'all' || g.dataset.noteGroup === activeNoteFilter) && [...g.querySelectorAll('.note-card')].some(c => !c.hidden)) }) } noteFilters.forEach(b => b.addEventListener('click', () => { activeNoteFilter = b.dataset.noteFilter; noteFilters.forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)) }); filterNotes() })); noteSearch?.addEventListener('input', filterNotes); document.querySelectorAll('.note-open').forEach(b => b.addEventListener('click', () => { const r = document.getElementById(b.dataset.noteTarget); if (r) { r.hidden = false; document.body.style.overflow = 'hidden' } })); document.querySelectorAll('.note-close').forEach(b => b.addEventListener('click', () => { b.closest('.note-reader').hidden = true; document.body.style.overflow = '' })); document.querySelectorAll('.note-reader').forEach(r => r.addEventListener('click', e => { if (e.target === r) { r.hidden = true; document.body.style.overflow = '' } })); document.querySelectorAll('.reader-tab').forEach(t => t.addEventListener('click', () => { const s = t.closest('.note-reader-shell'); s.querySelectorAll('.reader-tab').forEach(x => x.classList.toggle('active', x === t)); s.querySelector('.junior-content').hidden = t.dataset.level !== 'junior'; s.querySelector('.intermediate-content').hidden = t.dataset.level !== 'intermediate' })); document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.note-reader:not([hidden])').forEach(r => { r.hidden = true; document.body.style.overflow = '' }) }); filterNotes();


// ===== Reading Effectiveness System V7 =====
const principleCards = [...document.querySelectorAll('[data-principle]')];
function setPrincipleState(card, expanded) {
    const trigger = card.querySelector('.principle-trigger');
    const detail = document.getElementById(trigger?.getAttribute('aria-controls'));
    if (!trigger || !detail) return;
    card.classList.toggle('is-expanded', expanded);
    trigger.setAttribute('aria-expanded', String(expanded));
    detail.hidden = !expanded;
    const icon = trigger.querySelector('.principle-plus');
    if (icon) icon.textContent = expanded ? '−' : '＋';
}
function closeOtherPrinciples(current) {
    principleCards.forEach(card => { if (card !== current) setPrincipleState(card, false); });
}
principleCards.forEach(card => {
    const trigger = card.querySelector('.principle-trigger');
    trigger?.addEventListener('click', () => {
        const next = trigger.getAttribute('aria-expanded') !== 'true';
        closeOtherPrinciples(card);
        setPrincipleState(card, next);
    });
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        card.addEventListener('mouseenter', () => { closeOtherPrinciples(card); setPrincipleState(card, true); });
        card.addEventListener('mouseleave', () => { if (!card.matches(':focus-within')) setPrincipleState(card, false); });
    }
});
