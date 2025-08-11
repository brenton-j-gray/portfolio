// DOMContentLoaded event ensures the script runs after the HTML has been parsed
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
    initTabs();
    initKonami();
    initCTA();
});

// Function to fetch repository data from GitHub
async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/brenton-j-gray/repos`);
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const repos = await response.json();
        const projectList = document.getElementById('github-projects');
        const myRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));

        if (myRepos.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No repositories found.';
            projectList.appendChild(listItem);
            return;
        }

        myRepos.forEach(repo => {
            const li = document.createElement('li');

            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';

            const link = document.createElement('a');
            link.href = repo.html_url;
            link.textContent = repo.name;
            link.target = '_blank';

            const meta = document.createElement('div');
            meta.style.fontSize = '0.85rem';
            meta.style.color = '#9af7e6';
            meta.textContent = `${repo.stargazers_count} ★ · ${repo.language ?? 'N/A'} · Updated ${new Date(repo.pushed_at).toLocaleDateString()}`;

            header.appendChild(link);
            header.appendChild(meta);

            const description = document.createElement('p');
            description.textContent = repo.description || 'No description available';

            // Language bar (simple)
            const langBar = document.createElement('div');
            langBar.style.height = '6px';
            langBar.style.border = '1px solid #000';
            langBar.style.borderRadius = '6px';
            langBar.style.background = 'linear-gradient(90deg, rgba(100,255,218,0.3), rgba(230,57,70,0.3))';

            li.appendChild(header);
            li.appendChild(description);
            li.appendChild(langBar);
            projectList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        
        // Display error message to user
        const projectList = document.getElementById('github-projects');
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p style="color: #666; font-style: italic;">
                Unable to load GitHub projects at this time. 
                <br>This may be due to network restrictions or API rate limits.
                <br>Please visit <a href="https://github.com/brenton-j-gray" target="_blank">my GitHub profile</a> to view my repositories.
            </p>
        `;
        projectList.appendChild(listItem);
    }
}

// Tab logic
function initTabs() {
    const tabs = document.querySelectorAll('nav .tab-link');
    const panels = document.querySelectorAll('.tab-content');

    const isHidden = (el) => el.classList.contains('hidden') || el.getAttribute('aria-hidden') === 'true';
    const getVisibleTabs = () => Array.from(document.querySelectorAll('nav .tab-link')).filter(t => !isHidden(t));

    function onTabActivated(id) {
        if (id === 'skills') {
            animateSkillBars();
        }
    }

    function activate(targetId, pushHash = true) {
        const allTabs = document.querySelectorAll('nav .tab-link');
        const allPanels = document.querySelectorAll('.tab-content');
        const visibleTabs = getVisibleTabs();

        allTabs.forEach(tab => { tab.setAttribute('aria-selected', 'false'); });
        allPanels.forEach(panel => panel.classList.remove('active'));

        let activeTab = document.querySelector(`nav .tab-link[aria-controls="${targetId}"]`);
        if (!activeTab || isHidden(activeTab)) {
            // Fallback to first visible tab if target is hidden/locked or missing
            activeTab = visibleTabs[0];
            if (!activeTab) return; // nothing to activate
            targetId = activeTab.getAttribute('aria-controls');
            pushHash = true; // ensure URL reflects the visible tab
        }
        const activePanel = document.getElementById(targetId);
        if (activeTab && activePanel) {
            activeTab.setAttribute('aria-selected', 'true');
            activePanel.classList.add('active');
            if (pushHash) { history.replaceState(null, '', `#${targetId}`); }
            onTabActivated(targetId);
        }
    }

    // expose activate so other functions (e.g., unlockSecret) can call it
    window.__activateTab = activate;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('aria-controls');
            // Ignore clicks on hidden/locked tabs
            if (tab.classList.contains('hidden') || tab.getAttribute('aria-hidden') === 'true') return;
            activate(targetId);
        });

        // keyboard interaction per ARIA tabs pattern, skipping hidden tabs
        tab.addEventListener('keydown', (e) => {
            const visibleTabs = getVisibleTabs();
            const currentIndex = visibleTabs.indexOf(tab);
            if (currentIndex === -1) return; // hidden or not in flow
            let newIndex = currentIndex;
            if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % visibleTabs.length;
            else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + visibleTabs.length) % visibleTabs.length;
            else if (e.key === 'Home') newIndex = 0;
            else if (e.key === 'End') newIndex = visibleTabs.length - 1;
            if (newIndex !== currentIndex) {
                e.preventDefault();
                visibleTabs[newIndex].focus();
                activate(visibleTabs[newIndex].getAttribute('aria-controls'));
            }
        });
    });

    // initialize based on hash or default to first visible tab
    const hashId = window.location.hash ? window.location.hash.substring(1) : undefined;
    const initial = hashId || (getVisibleTabs()[0]?.getAttribute('aria-controls'));
    if (initial) activate(initial, false);
}

function animateSkillBars() {
    const fills = document.querySelectorAll('#skills .skill-fill');
    fills.forEach(fill => {
        const level = parseInt(fill.getAttribute('data-level'), 10) || 0;
        // Use requestAnimationFrame to ensure CSS transition kicks in
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
    });
}

function initSkillFilters() {
    const chips = document.querySelectorAll('#skills .chip');
    const items = document.querySelectorAll('#skills .skill-item, #skills .skill-card');

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.getAttribute('data-filter');
            chips.forEach(c => { c.classList.remove('active'); c.setAttribute('aria-pressed','false'); });
            chip.classList.add('active');
            chip.setAttribute('aria-pressed','true');

            items.forEach(item => {
                const tags = item.getAttribute('data-tags') || '';
                const show = filter === 'all' || tags.split(/\s+/).includes(filter);
                item.style.display = show ? '' : 'none';
            });
        });
    });
}

// initialize filters after DOM ready
document.addEventListener('DOMContentLoaded', initSkillFilters);

// Function to simulate hover effect with timeout on touch devices
function simulateHoverOnTouch() {
    const elements = document.querySelectorAll('.fancy-border');
    
    elements.forEach(element => {
        element.addEventListener('touchstart', () => {
            // Apply the "hover" effect by adding the class
            if (!element.classList.contains('hover-active')) {
                element.classList.add('hover-active');

                // Remove the "hover" effect after a timeout
                setTimeout(() => {
                    element.classList.remove('hover-active');
                }, 300);
            }
        });
    });
}

// Detect touch devices and apply the function
if ('ontouchstart' in window) {
    simulateHoverOnTouch();
}

document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const status = document.getElementById('form-status');
    const formData = new FormData(event.target);
    
    // Form validation logic starts here
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Reset previous error messages
    status.innerHTML = '';

    // Validate the Name
    if (name.value.trim() === '' || !/^[A-Za-z\s]+$/.test(name.value)) {
        status.innerHTML = 'Please enter a valid name (letters and spaces only).';
        name.focus();
        return;
    }

    // Validate the Email
    if (email.value.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        status.innerHTML = 'Please enter a valid email address.';
        email.focus();
        return;
    }

    // Validate the Message
    if (message.value.trim().length < 10 || message.value.trim().length > 500) {
        status.innerHTML = 'Message must be between 10 and 500 characters.';
        message.focus();
        return;
    }

    try {
        const response = await fetch('https://formspree.io/f/mvgpnlrg', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            status.innerHTML = 'Message sent successfully!';
            event.target.reset();
        } else {
            status.innerHTML = 'An error occurred while sending the message.';
        }
    } catch (error) {
        status.innerHTML = 'An error occurred while sending the message.';
        console.error('Error sending message:', error);
    }
});

// Get the message textarea and character count display
const messageInput = document.getElementById('message');
const charCountDisplay = document.getElementById('char-count');
const maxChars = 500;

// Function to update the character count
function updateCharCount() {
    const remainingChars = maxChars - messageInput.value.length;
    charCountDisplay.textContent = `${remainingChars} characters remaining`;

    // Add visual cue when the limit is close
    if (remainingChars < 50) {
        charCountDisplay.style.color = 'red'; // Change text color to red if close to the limit
    } else {
        charCountDisplay.style.color = ''; // Reset to default color
    }
}

// Listen for input events on the message field
messageInput.addEventListener('input', updateCharCount);

// Konami Code to reveal Secret tab
function initKonami() {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let progress = 0;
    window.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key === sequence[progress]) {
            progress++;
            if (progress === sequence.length) {
                unlockSecret();
                progress = 0;
            }
        } else {
            progress = key === sequence[0] ? 1 : 0;
        }
    });
}

function unlockSecret() {
    const secretTab = document.getElementById('secret-tab');
    const secretPanel = document.getElementById('secret');
    if (secretTab && secretPanel) {
        secretTab.classList.remove('hidden');
        secretTab.removeAttribute('aria-hidden');
        secretTab.removeAttribute('tabindex');
        secretPanel.classList.remove('hidden');
        secretPanel.removeAttribute('aria-hidden');
        // Activate it immediately using shared activator
        if (window.__activateTab) {
            window.__activateTab('secret');
        } else {
            const tabs = document.querySelectorAll('nav .tab-link');
            const panels = document.querySelectorAll('.tab-content');
            tabs.forEach(t => t.setAttribute('aria-selected','false'));
            panels.forEach(p => p.classList.remove('active'));
            const tab = document.querySelector('nav .tab-link[aria-controls="secret"]');
            const panel = document.getElementById('secret');
            if (tab && panel) {
                tab.setAttribute('aria-selected','true');
                panel.classList.add('active');
                history.replaceState(null, '', '#secret');
            }
        }
    }
}

// Recruiter CTA logic
function initCTA() {
    const copyBtn = document.getElementById('cta-copy-email');
    const resumeLink = document.getElementById('cta-download-resume');
    const bookLink = document.getElementById('cta-book-call');

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('brenton.j.gray@outlook.com');
                copyBtn.textContent = 'Email Copied!';
                setTimeout(() => copyBtn.textContent = 'Copy Email', 1500);
            } catch {
                copyBtn.textContent = 'Press Ctrl+C';
                setTimeout(() => copyBtn.textContent = 'Copy Email', 1500);
            }
        });
    }

    if (resumeLink) {
        // nothing else required; native download works
    }

    if (bookLink) {
        bookLink.href = 'https://calendly.com/your-calendly/intro-call'; // replace with your link
    }
}

// Interests carousel
(function initInterestsCarousel(){
    const root = document.getElementById('interests-carousel');
    if (!root) return;
    const track = root.querySelector('.carousel-track');
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    const prevBtn = root.querySelector('.carousel-btn.prev');
    const nextBtn = root.querySelector('.carousel-btn.next');
    const dots = Array.from(root.querySelectorAll('.dot'));
    let index = 0;

    function setActive(i){
        index = (i + slides.length) % slides.length;
        const offset = -index * 100;
        track.style.transform = `translateX(${offset}%)`;
        slides.forEach((s, si)=>{
            s.classList.toggle('is-active', si === index);
            s.setAttribute('aria-label', `${si+1} of ${slides.length}`);
        });
        dots.forEach((d, di)=>{
            const active = di === index;
            d.classList.toggle('is-active', active);
            d.setAttribute('aria-selected', String(active));
        });
    }

    function next(){ setActive(index + 1); }
    function prev(){ setActive(index - 1); }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);
    dots.forEach((d, di)=> d.addEventListener('click', ()=> setActive(di)));

    // Keyboard control when carousel focused
    root.addEventListener('keydown', (e)=>{
        if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
        else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
        else if (e.key === 'End') { e.preventDefault(); setActive(slides.length-1); }
    });

    // Simple swipe support
    let startX = null;
    root.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
    root.addEventListener('touchmove', (e)=>{
        if (startX == null) return;
        const dx = e.touches[0].clientX - startX;
        if (Math.abs(dx) > 40) {
            dx < 0 ? next() : prev();
            startX = null;
        }
    }, {passive:true});

    // Initialize
    setActive(0);
})();

