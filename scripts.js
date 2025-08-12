'use strict';

// ----- Dynamic single-panel app bootstrap -----
document.addEventListener('DOMContentLoaded', () => {
    initDynamicTabs(); // renders initial tab from hash
    initKonami();
    initCTA();
    adjustFooterReserve();
    window.addEventListener('resize', adjustFooterReserve);
});

function adjustFooterReserve(){
    const footer = document.querySelector('footer');
    if(!footer) return;
    const h = footer.getBoundingClientRect().height;
    // add small extra breathing room
    const reserve = Math.ceil(h + 12);
    document.documentElement.style.setProperty('--footer-reserve', reserve + 'px');
}

// ----- Templates for each tab (wrapped with an ID so existing CSS keeps working) -----
const TAB_TEMPLATES = {
    projects: () => `
<div id="projects">
  <h3 class="panel-title" data-icon="🗂️">Projects <span style="font-size:0.6rem; font-weight:500; letter-spacing:4px; opacity:1;">(From GitHub)</span></h3>
  <ul class="projectList" id="github-projects" aria-live="polite"></ul>
</div>`,
    skills: () => `
<div id="skills">
  <h3 class="panel-title" data-icon="🛠️">Skills</h3>
  <div class="skills-filters" role="toolbar" aria-label="Skill filters">
    <button class="chip active" type="button" data-filter="all" aria-pressed="true">All</button>
    <button class="chip" type="button" data-filter="language" aria-pressed="false">Languages</button>
    <button class="chip" type="button" data-filter="frontend" aria-pressed="false">Frontend</button>
    <button class="chip" type="button" data-filter="backend" aria-pressed="false">Backend</button>
    <button class="chip" type="button" data-filter="database" aria-pressed="false">Databases</button>
    <button class="chip" type="button" data-filter="tools" aria-pressed="false">Tools</button>
    <button class="chip" type="button" data-filter="soft" aria-pressed="false">Soft</button>
  </div>
  <ul class="skills-list" id="skills-list">
    <li class="skill-item" data-tags="language backend">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="cpp">C++</span><span class="skill-name">C++</span><span class="skill-meta">3 yrs</span></div>
      <div class="skill-bar" aria-label="C++ proficiency 70%"><div class="skill-fill" data-level="70"></div></div>
    </li>
    <li class="skill-item" data-tags="language backend">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="java">Jv</span><span class="skill-name">Java</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="Java proficiency 55%"><div class="skill-fill" data-level="55"></div></div>
    </li>
    <li class="skill-item" data-tags="language frontend backend">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="js">JS</span><span class="skill-name">JavaScript</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="JavaScript proficiency 65%"><div class="skill-fill" data-level="65"></div></div>
    </li>
    <li class="skill-item" data-tags="language backend tools">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="python">Py</span><span class="skill-name">Python</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="Python proficiency 55%"><div class="skill-fill" data-level="55"></div></div>
    </li>
    <li class="skill-item" data-tags="backend tools">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="node">Nd</span><span class="skill-name">Node.js</span><span class="skill-meta">Projects</span></div>
      <div class="skill-bar" aria-label="Node.js proficiency 55%"><div class="skill-fill" data-level="55"></div></div>
    </li>
    <li class="skill-item" data-tags="backend tools">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="express">Ex</span><span class="skill-name">Express.js</span><span class="skill-meta">Projects</span></div>
      <div class="skill-bar" aria-label="Express.js proficiency 50%"><div class="skill-fill" data-level="50"></div></div>
    </li>
    <li class="skill-item" data-tags="frontend">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="html">H</span><span class="skill-name">HTML</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="HTML proficiency 75%"><div class="skill-fill" data-level="75"></div></div>
    </li>
    <li class="skill-item" data-tags="frontend">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="css">C</span><span class="skill-name">CSS</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="CSS proficiency 70%"><div class="skill-fill" data-level="70"></div></div>
    </li>
    <li class="skill-item" data-tags="database">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="sql">SQ</span><span class="skill-name">SQL</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="SQL proficiency 60%"><div class="skill-fill" data-level="60"></div></div>
    </li>
    <li class="skill-item" data-tags="database">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="mysql">My</span><span class="skill-name">MySQL</span><span class="skill-meta">Academic + projects</span></div>
      <div class="skill-bar" aria-label="MySQL proficiency 55%"><div class="skill-fill" data-level="55"></div></div>
    </li>
    <li class="skill-item" data-tags="database">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="mongodb">Mg</span><span class="skill-name">MongoDB</span><span class="skill-meta">Projects</span></div>
      <div class="skill-bar" aria-label="MongoDB proficiency 50%"><div class="skill-fill" data-level="50"></div></div>
    </li>
    <li class="skill-item" data-tags="tools">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="git">Gt</span><span class="skill-name">Git</span><span class="skill-meta">Projects</span></div>
      <div class="skill-bar" aria-label="Git proficiency 65%"><div class="skill-fill" data-level="65"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="collaboration">Co</span><span class="skill-name">Collaboration</span><span class="skill-meta">Strong</span></div>
      <div class="skill-bar" aria-label="Collaboration 85%"><div class="skill-fill" data-level="85"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="problem-solving">Ps</span><span class="skill-name">Problem Solving</span><span class="skill-meta">Strong</span></div>
      <div class="skill-bar" aria-label="Problem Solving 85%"><div class="skill-fill" data-level="85"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="adaptability">Ad</span><span class="skill-name">Adaptability</span><span class="skill-meta">Proficient</span></div>
      <div class="skill-bar" aria-label="Adaptability 75%"><div class="skill-fill" data-level="75"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="critical-thinking">Ct</span><span class="skill-name">Critical Thinking</span><span class="skill-meta">Strong</span></div>
      <div class="skill-bar" aria-label="Critical Thinking 85%"><div class="skill-fill" data-level="85"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="empathy">Em</span><span class="skill-name">Empathy</span><span class="skill-meta">Strong</span></div>
      <div class="skill-bar" aria-label="Empathy 80%"><div class="skill-fill" data-level="80"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="leadership">Ld</span><span class="skill-name">Leadership</span><span class="skill-meta">Strong</span></div>
      <div class="skill-bar" aria-label="Leadership 85%"><div class="skill-fill" data-level="85"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="systems-troubleshooting">St</span><span class="skill-name">Systems Troubleshooting</span><span class="skill-meta">Proficient</span></div>
      <div class="skill-bar" aria-label="Systems Troubleshooting 80%"><div class="skill-fill" data-level="80"></div></div>
    </li>
    <li class="skill-item" data-tags="soft">
      <div class="skill-row"><span class="skill-icon" aria-hidden="true" data-skill="project-management">Pm</span><span class="skill-name">Project Management</span><span class="skill-meta">Strong</span></div>
      <div class="skill-bar" aria-label="Project Management 80%"><div class="skill-fill" data-level="80"></div></div>
    </li>
  </ul>
</div>`,
    interests: () => `
<div id="interests">
  <h3 class="panel-title" data-icon="🎮">Current Interests</h3>
  <div id="interests-carousel" class="carousel" role="region" aria-roledescription="carousel" aria-label="Interests carousel" tabindex="0">
    <div class="carousel-viewport">
      <ul class="carousel-track">
        <li id="slide-1" class="carousel-slide is-active" role="group" aria-roledescription="slide" aria-label="1 of 6">
          <div class="interest-card"><div class="interest-icon" aria-hidden="true"><img src="images/frontend.svg" alt=""></div><div class="interest-content"><h4 class="interest-title">Frontend Craft</h4><p class="interest-text">JavaScript, HTML, CSS — building playful, fast UIs.</p></div></div>
        </li>
        <li id="slide-2" class="carousel-slide" role="group" aria-roledescription="slide" aria-label="2 of 6">
          <div class="interest-card"><div class="interest-icon" aria-hidden="true"><img src="images/game.svg" alt=""></div><div class="interest-content"><h4 class="interest-title">Games & Design</h4><p class="interest-text">Designing and playing games; systems, loops, and juice.</p></div></div>
        </li>
        <li id="slide-3" class="carousel-slide" role="group" aria-roledescription="slide" aria-label="3 of 6">
          <div class="interest-card"><div class="interest-icon" aria-hidden="true"><img src="images/learning.svg" alt=""></div><div class="interest-content"><h4 class="interest-title">Always Learning</h4><p class="interest-text">New tech, patterns, and neat tricks every week.</p></div></div>
        </li>
        <li id="slide-4" class="carousel-slide" role="group" aria-roledescription="slide" aria-label="4 of 6">
          <div class="interest-card"><div class="interest-icon" aria-hidden="true"><img src="images/music.svg" alt=""></div><div class="interest-content"><h4 class="interest-title">Writing & Music</h4><p class="interest-text">Creative writing and making music in spare cycles.</p></div></div>
        </li>
        <li id="slide-5" class="carousel-slide" role="group" aria-roledescription="slide" aria-label="5 of 6">
          <div class="interest-card"><div class="interest-icon" aria-hidden="true"><img src="images/writing.svg" alt=""></div><div class="interest-content"><h4 class="interest-title">Story & Narrative</h4><p class="interest-text">Short stories, game lore, and world-building.</p></div></div>
        </li>
        <li id="slide-6" class="carousel-slide" role="group" aria-roledescription="slide" aria-label="6 of 6">
          <div class="interest-card"><div class="interest-icon" aria-hidden="true"><img src="images/travel.svg" alt=""></div><div class="interest-content"><h4 class="interest-title">Travel</h4><p class="interest-text">Exploring new places with family — collecting memories.</p></div></div>
        </li>
      </ul>
    </div>
    <button class="carousel-btn prev" type="button" aria-label="Previous slide">‹</button>
    <button class="carousel-btn next" type="button" aria-label="Next slide">›</button>
    <div class="carousel-dots" role="tablist" aria-label="Slide navigation">
      <button class="dot is-active" type="button" role="tab" aria-controls="slide-1" aria-selected="true" aria-label="Go to slide 1"></button>
      <button class="dot" type="button" role="tab" aria-controls="slide-2" aria-selected="false" aria-label="Go to slide 2"></button>
      <button class="dot" type="button" role="tab" aria-controls="slide-3" aria-selected="false" aria-label="Go to slide 3"></button>
      <button class="dot" type="button" role="tab" aria-controls="slide-4" aria-selected="false" aria-label="Go to slide 4"></button>
      <button class="dot" type="button" role="tab" aria-controls="slide-5" aria-selected="false" aria-label="Go to slide 5"></button>
      <button class="dot" type="button" role="tab" aria-controls="slide-6" aria-selected="false" aria-label="Go to slide 6"></button>
    </div>
  </div>
</div>`,
    about: () => `
<div id="about">
  <h3 class="panel-title" data-icon="👤">About Me</h3>
  <p>I'm a transitioning U.S. Marine with decades of experience as a technical leader, and a plethora of skills in project management, problem-solving, and cross-team collaboration. I'm drawn to innovation and creativity, and have a lifelong learning and growth mindset. With a solid knowledge base in Computer Science, a unique military background, and a lifelong love for programming, I'm very eager to channel my technical skills and experience into a career in Software Engineering.</p>
  <p>I'm also into music production, art design, and video game design. When I'm not on a computer, you'll find me enjoying the great outdoors with my wife, three kids, and our dog.</p>
  <p>I'm excited to bring my discipline, attitude, and technical prowess to the tech world. I'm ready to create some amazing things, solve meaningful problems, and have a amazing time doing it!</p>
  <p>Reach out if you have a opportunity or just want to chat. Thanks for stopping by!</p>
  <div class="terminal" role="group" aria-label="whoami terminal snapshot">
    <div class="terminal-header" aria-hidden="true">
      <span class="term-dot term-red"></span>
      <span class="term-dot term-yellow"></span>
      <span class="term-dot term-green"></span>
      <span class="terminal-title">portfolio — bash</span>
    </div>
    <div class="terminal-body" aria-live="polite">
      <div class="term-line"><span class="prompt">$</span> <span class="command">whoami</span></div>
      <div class="term-line output">brenton-j-gray</div>
      <div class="term-line"><span class="prompt">$</span> <span class="command">role</span></div>
      <div class="term-line output">Software Engineer</div>
      <div class="term-line"><span class="prompt">$</span> <span class="command">status</span></div>
      <div class="term-line output">U.S. Marine (transitioning) · Active Secret Clearance</div>
      <div class="term-line"><span class="prompt">$</span> <span class="command">stack</span></div>
      <div class="term-line output">C++, JavaScript, HTML, CSS</div>
      <div class="term-line"><span class="prompt">$</span> <span class="command">interests</span></div>
      <div class="term-line output">games, music, writing, travel</div>
      <div class="term-line"><span class="prompt">$</span> <span class="command">hint</span></div>
      <div class="term-line output">psst… try the Konami code: ↑ ↑ ↓ ↓ ← → ← → b a</div>
      <div class="term-line output">It unlocks something fun!</div>
      <div class="term-line"><span class="prompt">$</span> <span class="command">_</span><span class="caret" aria-hidden="true"></span></div>
    </div>
  </div>
</div>`,
    contact: () => `
<div id="contact">
  <h3 class="panel-title" data-icon="✉️">Contact Me</h3>
    <p class="contact-intro">Have an opportunity, collaboration, or just want to say hi? Drop a line below or use a quick link.</p>
    <div class="contact-layout">
        <div class="contact-form-card">
            <form id="contact-form" method="POST" action="https://formspree.io/f/mvgpnlrg" novalidate>
                <div class="form-inner">
                    <div class="field">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required minlength="2" maxlength="50" pattern="[A-Za-z .'-]+" autocomplete="name" placeholder="Your name" title="Letters, spaces, periods, apostrophes, and hyphens allowed.">
                    </div>
                    <div class="field">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required autocomplete="email" placeholder="you@example.com">
                    </div>
                    <div class="field">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" required minlength="10" maxlength="500" aria-describedby="char-count" placeholder="Ask me a question or share your thoughts..."></textarea>
                        <div class="char-progress" aria-hidden="true"><div class="char-progress-bar"></div></div>
                        <p id="char-count" role="status" aria-live="polite">500 characters remaining</p>
                    </div>
                    <input type="hidden" name="_subject" value="Portfolio Contact Form Submission">
                    <button type="submit" class="send-btn"><span class="btn-label">Send Message</span><span class="plane" aria-hidden="true">✈</span></button>
                    <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
                </div>
                <div class="form-success" hidden>
                    <div class="success-icon" aria-hidden="true">✔</div>
                    <h4 class="success-title" tabindex="-1">Message Sent!</h4>
                    <p class="success-text">Thanks for reaching out! I'll get back to you soon.</p>
                    <button type="button" class="reset-form">Send Another</button>
                </div>
            </form>
        </div>
        <aside class="contact-side" aria-label="Alternate ways to connect">
            <div class="contact-blurb">Prefer a direct channel?<br> These are instant:</div>
            <ul class="contact-quick">
                <li><a class="quick-link" href="mailto:brenton.j.gray@outlook.com?subject=Regarding%20Your%20Portfolio&body=Hello%20Brenton,%20" aria-label="Compose email to Brenton J. Gray about portfolio">📧 Email</a></li>
                <li><a class="quick-link" href="https://www.linkedin.com/in/brenton-j-gray" target="_blank" rel="noopener" aria-label="LinkedIn profile">💼 LinkedIn</a></li>
                <li><a class="quick-link" href="https://github.com/brenton-j-gray" target="_blank" rel="noopener" aria-label="GitHub profile">🐙 GitHub</a></li>
            </ul>
            <p class="contact-note">I usually reply within 24 hours.</p>
        </aside>
    </div>
</div>`,
    secret: () => `
<div id="secret">
  <h3 class="panel-title" data-icon="🎁">Secret Level Unlocked!</h3>
  <figure class="secret-figure" style="margin: 8px auto 12px; text-align:center;">
    <img src="pixel.png" alt="Pixel art avatar of Brenton" style="max-width:160px; width:100%; height:auto; image-rendering: pixelated; border: var(--border-3); border-radius: var(--radius-12); box-shadow: var(--shadow-elev-16);">
    <figcaption style="color:#9af7e6; font-size:0.85rem; margin-top:6px;">My pixel personification in 16-bit glory!</figcaption>
  </figure>
  <p><strong>About the pixel art:</strong> I created this little sprite as a nod to the games that first got me curious about how software worlds are built. Limited palette, chunky shading, and deliberate outlines force clarity of shape, the same way good engineering constraints force clear design.</p>
  <p>Welcome to the hidden room. Since you dug this up, here’s some deeper, human stuff beyond the normal portfolio gloss.</p>
  <section aria-labelledby="trivia-hdr" style="margin-top:14px;">
    <h4 id="trivia-hdr" style="margin:4px 0 6px; color: var(--tertiary-color);">Quick Trivia</h4>
    <ul class="itemList" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:6px;">
      <li><span style="color:var(--secondary-color);">Origin:</span> Grew up moving often; learned to adapt fast and build tight-knit teams quickly.</li>
      <li><span style="color:var(--secondary-color);">Deployments / Moves:</span> 10+ global locations; every new environment = new problem space.</li>
      <li><span style="color:var(--secondary-color);">Favorite CS Concept:</span> Small, composable abstractions > giant frameworks. (Also: pathfinding + heuristics.)</li>
      <li><span style="color:var(--secondary-color);">Most-used Dev Ritual:</span> Sketch architecture on paper before touching a keyboard.</li>
      <li><span style="color:var(--secondary-color);">Learning Loop:</span> Read → build tiny prototype → refactor → explain it back to someone.</li>
      <li><span style="color:var(--secondary-color);">Coffee Style:</span> Strong + Black; ship first, polish after.</li>
      <li><span style="color:var(--secondary-color);">Favorite Game Genres:</span> MMORPG, Team-Based Shooters, Survival, FPS.</li>
      <li><span style="color:var(--secondary-color);">Current Playlist:</span> Lo-fi beats, synthwave, classic rock, progressive metal.</li>
      <li><span style="color:var(--secondary-color);">Pet:</span> Matcha, a Pomeranian-Corgi mix who thinks she’s a lap dog.</li>
    </ul>
  </section>
  <section aria-labelledby="tidbits-hdr" style="margin-top:18px;">
    <h4 id="tidbits-hdr" style="margin:4px 0 6px; color: var(--tertiary-color);">Personal Tidbits</h4>
    <p style="margin:0 0 8px;">A few snapshots about how I think, work, and recharge:</p>
    <ul class="itemList" style="list-style:disc inside; padding:0; margin:0 0 10px; display:flex; flex-direction:column; gap:4px;">
      <li>Teach-first mindset: if I can’t explain it simply, I don’t understand it yet.</li>
      <li>Prefer deleting code over adding more: clarity > clever.</li>
      <li>Side interests in procedural generation & lightweight game engines.</li>
      <li>Music production keeps my pattern recognition sharp in a different modality.</li>
      <li>Believe small morale boosters (quick wins, visible progress) unlock team momentum.</li>
    </ul>
  </section>
  <section aria-labelledby="service-hdr" style="margin-top:18px;">
    <h4 id="service-hdr" style="margin:4px 0 6px; color: var(--tertiary-color);">Service & Resilience</h4>
    <p style="margin:6px 0 10px; line-height:1.6;">I spent years splitting time between raising a young family and deploying to places like <strong>Iraq</strong>, <strong>Kuwait</strong>, <strong>Djibouti</strong>, <strong>Yemen</strong>, <strong>Oman</strong>, and <strong>Somalia</strong>. That pace forces you to grow up fast: learn what actually matters, stay calm when context shifts hourly, and build trust quickly with people who may rotate out tomorrow. We scraped by, improvised when support lagged, and kept moving; adapt, stabilize, then improve.</p>
    <p style="margin:6px 0 10px; line-height:1.6;">Those cycles of constraint → ambiguity → iteration feel a lot like engineering: assess the situation, isolate the critical path, reduce noise, and deliver something reliable under pressure. The through-line: adversity is a training loop, you either get brittle or you get better at refactoring yourself.</p>
    <p style="margin:6px 0 0; font-size:0.9rem; color:#9af7e6;">If you want the longer story or how that maps to team velocity & incident response, just ask.</p>
  </section>
  <details style="margin-top:14px;">
    <summary><strong>Why constraints matter</strong></summary>
    <p style="margin:6px 0 0;">Whether in code, art, or leadership, constraints create focus. The pixel avatar is built with that philosophy: fewer colors, stronger intent.</p>
  </details>
  <details>
    <summary><strong>Favorite small refactor</strong></summary>
    <p style="margin:6px 0 0;">Replacing a nested conditional ladder with a data-driven map + small strategy objects. Fewer branches, easier extension.</p>
  </details>
  <details>
    <summary><strong>What motivates me</strong></summary>
    <p style="margin:6px 0 0;">Turning ambiguity into a clear plan, then watching team stress drop as structure appears.</p>
  </details>
  <p style="margin-top:16px; font-size:0.85rem; color:#9af7e6;">(Spotted something you want to dig into? Feel free to reach out, I love trading notes.)</p>
</div>`
};

// ----- Dynamic Tabs Controller -----
function initDynamicTabs() {
    const panel = document.getElementById('content-panel');
    const tabs = Array.from(document.querySelectorAll('nav .tab-link'));

    const isHidden = (t) => t.classList.contains('hidden') || t.getAttribute('aria-hidden') === 'true';
    const visibleTabs = () => tabs.filter(t => !isHidden(t));

    function render(id) {
        const tpl = TAB_TEMPLATES[id];
        if (!tpl) { panel.innerHTML = ''; return; }
        panel.innerHTML = tpl();
        panel.setAttribute('aria-labelledby', `${id}-tab`);
        // Post-render hooks
        switch (id) {
            case 'projects': fetchGitHubRepos(); break;
            case 'skills': initSkillFilters(); animateSkillBars(); break;
            case 'about': initWhoamiTyper(); break;
            case 'interests': initInterestsCarousel(); break;
            case 'contact': attachContactFormHandlers(); break;
            case 'secret': /* nothing extra */ break;
        }
    }

    function activateById(id, pushHash = true) {
        let tab = document.querySelector(`nav .tab-link[data-tab="${id}"]`);
        if (!tab || isHidden(tab)) {
            tab = visibleTabs()[0];
            if (!tab) return;
            id = tab.getAttribute('data-tab');
            pushHash = true;
        }
        tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
        tab.setAttribute('aria-selected', 'true');
        if (pushHash) history.replaceState(null, '', `#${id}`);
        render(id);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', e => {
            e.preventDefault();
            if (isHidden(tab)) return;
            activateById(tab.getAttribute('data-tab'));
        });
        tab.addEventListener('keydown', e => {
            const vis = visibleTabs();
            const i = vis.indexOf(tab);
            if (i === -1) return;
            let ni = i;
            if (e.key === 'ArrowRight') ni = (i + 1) % vis.length;
            else if (e.key === 'ArrowLeft') ni = (i - 1 + vis.length) % vis.length;
            else if (e.key === 'Home') ni = 0;
            else if (e.key === 'End') ni = vis.length - 1;
            else return;
            e.preventDefault();
            vis[ni].focus();
            activateById(vis[ni].getAttribute('data-tab'));
        });
    });

    // Initial load
    const initial = (window.location.hash || '#projects').slice(1);
    activateById(initial, false);

    // expose for external activation (secret unlock)
    window.__activateTab = activateById;
    window.__activateTabDynamic = activateById;
}

// ----- Data: GitHub repos (cached) -----
let reposCache = null;
async function fetchGitHubRepos() {
    try {
        const projectList = document.getElementById('github-projects');
        if (!projectList) return;
        if (!reposCache) {
            const response = await fetch('https://api.github.com/users/brenton-j-gray/repos');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            reposCache = await response.json();
        }
        const myRepos = reposCache
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        projectList.innerHTML = '';
        if (myRepos.length === 0) {
            const listItem = document.createElement('li');
            listItem.textContent = 'No repositories found.';
            projectList.appendChild(listItem);
            return;
        }
        myRepos.forEach(repo => {
            const li = document.createElement('li');
            li.className = 'project-card';
            const header = document.createElement('div');
            header.className = 'project-card-header';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            const link = document.createElement('a');
            link.href = repo.html_url;
            link.textContent = repo.name;
            link.target = '_blank';
            link.className = 'project-title';
            header.appendChild(link);
            li.appendChild(header);

            // Badges container
            const badges = document.createElement('div');
            badges.className = 'project-badges';

            // Stars badge
            const stars = document.createElement('span');
            stars.className = 'badge badge-stars';
            stars.textContent = `${repo.stargazers_count}★`;
            stars.setAttribute('aria-label', `${repo.stargazers_count} stars`);
            badges.appendChild(stars);

            // Language badge (if available)
            if (repo.language) {
                const lang = document.createElement('span');
                lang.className = 'badge badge-lang';
                lang.textContent = repo.language;
                lang.setAttribute('aria-label', `Primary language ${repo.language}`);
                badges.appendChild(lang);
            }

            // Updated date badge
            const updated = document.createElement('span');
            updated.className = 'badge badge-updated';
            const dateStr = new Date(repo.pushed_at).toLocaleDateString();
            updated.textContent = dateStr;
            updated.setAttribute('aria-label', `Last updated ${dateStr}`);
            badges.appendChild(updated);

            li.appendChild(badges);

            const description = document.createElement('p');
            description.className = 'project-card-desc';
            description.textContent = repo.description || 'No description available';
            li.appendChild(description);
            projectList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
        const projectList = document.getElementById('github-projects');
        if (projectList) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p style="color: #666; font-style: italic;">
                    Unable to load GitHub projects at this time.
                    <br>Please visit <a href="https://github.com/brenton-j-gray" target="_blank">my GitHub profile</a> to view my repositories.
                </p>`;
            projectList.appendChild(listItem);
        }
    }
}

// ----- Skills: progress bars -----
function animateSkillBars() {
    const fills = document.querySelectorAll('#skills .skill-fill');
    fills.forEach(fill => {
        const level = parseInt(fill.getAttribute('data-level'), 10) || 0;
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        fill.classList.remove('sheen-active');
        fill.addEventListener('transitionend', function handler(e){
            if (e.propertyName === 'width') {
                fill.classList.add('sheen-active');
                fill.removeEventListener('transitionend', handler);
            }
        });
    });
}

// Re-run animation from 0% each time filters change
function reanimateSkillBars() {
    const fills = document.querySelectorAll('#skills .skill-fill');
    fills.forEach(fill => { fill.style.width = '0%'; fill.classList.remove('sheen-active'); });
    requestAnimationFrame(() => {
        fills.forEach(fill => {
            const level = parseInt(fill.getAttribute('data-level'), 10) || 0;
            fill.style.width = level + '%';
            fill.addEventListener('transitionend', function handler(e){
                if (e.propertyName === 'width') {
                    fill.classList.add('sheen-active');
                    fill.removeEventListener('transitionend', handler);
                }
            });
        });
    });
}

// ----- About: terminal typer -----
function initWhoamiTyper() {
    const body = document.querySelector('#about .terminal-body');
    if (!body) return;

    // Lock in final height so the terminal doesn't visually grow while typing
    if (!body.__lockedHeight) {
        const preHeight = body.getBoundingClientRect().height;
        body.style.minHeight = preHeight + 'px';
        body.style.height = preHeight + 'px';
        body.__lockedHeight = preHeight;
    }

    // If already typed once this page load, just ensure final state with blinking caret
    if (window.__whoamiTyped) {
        // Remove placeholder underscore if present and ensure prompt symbols visible
        body.querySelectorAll('.term-line').forEach(line => {
            const prompt = line.querySelector('.prompt');
            if (prompt && prompt.textContent.trim() === '') prompt.textContent = '$';
            const cmd = line.querySelector('.command');
            if (cmd && cmd.textContent.trim() === '_') cmd.textContent = '';
        });
        let caret = body.querySelector('.caret');
        if (!caret) {
            caret = document.createElement('span');
            caret.className = 'caret';
        } else if (caret.parentElement) {
            caret.parentElement.removeChild(caret);
        }
        // Append caret to trailing command span (last line) or create one
        let lastCmd = body.querySelector('.term-line:last-child .command');
        if (!lastCmd) {
            const lastLine = document.createElement('div');
            lastLine.className = 'term-line';
            lastLine.innerHTML = '<span class="prompt">$</span> <span class="command"></span>';
            body.appendChild(lastLine);
            lastCmd = lastLine.querySelector('.command');
        }
        if (lastCmd) lastCmd.appendChild(caret);
        return; // Skip re-animation
    }

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { window.__whoamiTyped = true; return; }

    let caret = body.querySelector('.caret');
    if (!caret) {
        caret = document.createElement('span');
        caret.className = 'caret';
        body.appendChild(caret);
    }

    const lines = Array.from(body.querySelectorAll('.term-line'));

    let trailingLine = null, trailingPrompt = null, trailingCmd = null;
    for (const line of lines) {
        const cmdSpan = line.querySelector('.command');
        if (cmdSpan && cmdSpan.textContent.trim() === '_') {
            trailingLine = line;
            trailingPrompt = line.querySelector('.prompt');
            trailingCmd = cmdSpan;
            break;
        }
    }

    const sequence = [];
    lines.forEach(line => {
        if (line === trailingLine) return;
        const isOutput = line.classList.contains('output');
        const cmd = line.querySelector('.command');
        if (cmd && !isOutput) {
            sequence.push({ el: cmd, line, text: cmd.textContent, kind: 'cmd' });
        } else if (isOutput) {
            sequence.push({ el: line, line, text: line.textContent, kind: 'out' });
        }
    });

    const prompts = body.querySelectorAll('.term-line .prompt');
    prompts.forEach(p => { p.textContent = ''; });

    sequence.forEach(item => { item.el.textContent = ''; });
    if (trailingCmd) trailingCmd.textContent = '';

    const charDelay = 28;
    const lineDelay = 150;
    const promptToOutputDelay = 320;
    const getPreInputDelay = () => Math.round(500 + Math.random() * 1500);

    function placeCaret(el) { el.appendChild(caret); }

    function typeText(el, text, afterDelay, onDone, moveCaret) {
        let i = 0;
        (function step(){
            if (i <= text.length) {
                el.textContent = text.slice(0, i);
                if (moveCaret) placeCaret(el);
                i++;
                setTimeout(step, charDelay);
            } else {
                onDone && setTimeout(onDone, afterDelay);
            }
        })();
    }

    let idx = 0;
    (function next(){
        if (idx >= sequence.length) {
            if (trailingLine && trailingPrompt && trailingCmd) {
                trailingPrompt.textContent = '$';
                trailingCmd.textContent = '';
                placeCaret(trailingCmd);
            }
            window.__whoamiTyped = true; // mark done globally
            return;
        }
        const current = sequence[idx++];
        const nextItem = sequence[idx];
        const afterDelay = (current.kind === 'cmd' && nextItem && nextItem.kind === 'out') ? promptToOutputDelay : lineDelay;
        if (current.kind === 'cmd') {
            // Show prompt and caret immediately, then pause (waiting state), then type
            const linePrompt = current.line.querySelector('.prompt');
            if (linePrompt) linePrompt.textContent = '$';
            placeCaret(current.el); // caret blinks while "waiting"
            setTimeout(() => { typeText(current.el, current.text, afterDelay, next, true); }, getPreInputDelay());
        } else { // output
            typeText(current.el, current.text, afterDelay, next, false);
        }
    })();
}

// ----- Skills: filters -----
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
            // Refill bars after filtering
            reanimateSkillBars();
        });
    });
}

// ----- Touch hover shim for .fancy-border (legacy) -----
function simulateHoverOnTouch() {
    const elements = document.querySelectorAll('.fancy-border');
    elements.forEach(element => {
        element.addEventListener('touchstart', () => {
            if (!element.classList.contains('hover-active')) {
                element.classList.add('hover-active');
                setTimeout(() => { element.classList.remove('hover-active'); }, 300);
            }
        });
    });
}
if ('ontouchstart' in window) simulateHoverOnTouch();

// ----- Contact form (attach after render) -----
function attachContactFormHandlers() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form) return;

    const successPanel = form.querySelector('.form-success');
    // Defensive: ensure success panel starts hidden
    if(successPanel){ successPanel.hidden = true; }
    const sendBtn = form.querySelector('.send-btn');
    const resetBtn = form.querySelector('.reset-form');
    const charCountDisplay = document.getElementById('char-count');
    const messageInput = document.getElementById('message');
    const progressWrap = form.querySelector('.char-progress');
    const progressBar = form.querySelector('.char-progress-bar');
    const maxChars = 500;
    function updateCharCount(){
        if(!messageInput || !charCountDisplay) return;
        const used = messageInput.value.length;
        const remaining = maxChars - used;
        charCountDisplay.textContent = `${remaining} characters remaining`;
        if(progressBar){
            const pct = Math.min(100, (used / maxChars) * 100);
            progressBar.style.setProperty('--pct', pct.toFixed(2));
            progressBar.style.width = pct + '%';
        }
        charCountDisplay.style.color = remaining < 50 ? 'var(--secondary-color)' : '';
    }
    if(messageInput){
        messageInput.addEventListener('input', updateCharCount);
        updateCharCount();
    }

    form.addEventListener('submit', async (e)=>{
        e.preventDefault();
        if(!sendBtn) return;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        if(status) status.textContent='';
        const invalid = (field, msg)=>{ if(status){ status.textContent = msg; } field.focus(); field.classList.add('field-error'); setTimeout(()=> field.classList.remove('field-error'), 1600); return true; };
    if (!name || name.value.trim() === '' || !/^[A-Za-z .'-]+$/.test(name.value)) { if(invalid(name,"Enter a valid name (letters, spaces, . ' -).")) return; }
        if (!email || email.value.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { if(invalid(email,'Enter a valid email.')) return; }
        if (!message || message.value.trim().length < 10 || message.value.trim().length > 500) { if(invalid(message,'Message must be 10-500 chars.')) return; }
        const formData = new FormData(form);
        sendBtn.disabled = true;
        form.classList.add('is-sending');
        try {
            const response = await fetch('https://formspree.io/f/mvgpnlrg', { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
            form.classList.remove('is-sending');
            if (response.ok) {
                if(successPanel){
                    const inner = form.querySelector('.form-inner');
                    if(inner) inner.hidden = true;
                    successPanel.hidden = false;
                    successPanel.querySelector('.success-title')?.focus();
                }
                form.reset();
                updateCharCount();
            } else {
                if(status) status.textContent = 'Send failed. Please try again.';
            }
        } catch(err){
            if(status) status.textContent = 'Network error. Please try again.';
            console.error(err);
        } finally {
            sendBtn.disabled = false;
        }
    });

    resetBtn?.addEventListener('click', ()=>{
        const inner = form.querySelector('.form-inner');
        if(inner) inner.hidden = false;
        if(successPanel) successPanel.hidden = true;
        form.querySelector('#name')?.focus();
    });

    // (Removed quick-copy buttons; email now a direct mailto link)
}

// ----- Konami Code unlocks Secret tab -----
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
    if (secretTab) {
        secretTab.classList.remove('hidden');
        secretTab.removeAttribute('aria-hidden');
        secretTab.removeAttribute('tabindex');
        if (window.__activateTabDynamic) {
            window.__activateTabDynamic('secret');
        }
    }
}

// ----- Recruiter CTA -----
function initCTA() {
    const copyBtn = document.getElementById('cta-copy-email');
    const bookLink = document.getElementById('cta-book-call');
    const resumeLink = document.getElementById('cta-download-resume');

    function applyCTALabels(){
        const compact = window.matchMedia('(max-width:700px)').matches;
        [copyBtn, bookLink, resumeLink].forEach(btn => {
            if(!btn) return;
            const full = btn.getAttribute('data-full');
            const short = btn.getAttribute('data-short');
            if (compact) {
                btn.textContent = short;
            } else {
                btn.textContent = full;
            }
        });
    }
    window.addEventListener('resize', applyCTALabels);
    applyCTALabels();

    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText('brenton.j.gray@outlook.com');
                copyBtn.textContent = window.matchMedia('(max-width:700px)').matches ? 'Copied' : 'Email Copied!';
                setTimeout(() => applyCTALabels(), 1500);
            } catch {
                copyBtn.textContent = window.matchMedia('(max-width:700px)').matches ? 'Ctrl+C' : 'Press Ctrl+C';
                setTimeout(() => applyCTALabels(), 1500);
            }
        });
    }
    if (bookLink) { bookLink.href = 'https://calendly.com/brenton-j-gray'; }
}

// ----- Interests carousel (call after render) -----
function initInterestsCarousel(){
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
        slides.forEach((s, si)=>{ s.classList.toggle('is-active', si === index); s.setAttribute('aria-label', `${si+1} of ${slides.length}`); });
        dots.forEach((d, di)=>{ const active = di === index; d.classList.toggle('is-active', active); d.setAttribute('aria-selected', String(active)); d.setAttribute('tabindex', active ? '0' : '-1'); });
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
}

// Parallax for carousel active slide
function enableCarouselParallax(root){
    const activeCard = root.querySelector('.carousel-slide.is-active .interest-card');
    if (!activeCard) return;
    activeCard.classList.add('parallax-active');
    let rect = null;
    function handleMove(x, y){
        if (!rect) rect = activeCard.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (x - cx) / rect.width; // -0.5..0.5 ish
        const dy = (y - cy) / rect.height;
        const maxTilt = 10;
        const rx = (-dy * maxTilt).toFixed(2);
        const ry = (dx * maxTilt).toFixed(2);
        activeCard.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
    }
    function reset(){ activeCard.style.transform=''; }
    function onPointer(e){ if(e.touches){ handleMove(e.touches[0].clientX, e.touches[0].clientY); } else { handleMove(e.clientX, e.clientY); } }
    root.addEventListener('mousemove', onPointer);
    root.addEventListener('touchmove', onPointer,{passive:true});
    root.addEventListener('mouseleave', reset);
    root.addEventListener('touchend', reset);
}

// Patch initInterestsCarousel to hook parallax after activation
const _origInitCarousel = typeof initInterestsCarousel === 'function' ? initInterestsCarousel : null;
if (_origInitCarousel) {
    window.initInterestsCarousel = function(){
        _origInitCarousel();
        const root = document.getElementById('interests-carousel');
        if (!root) return;
        enableCarouselParallax(root);
        // Re-enable parallax whenever slide changes
        root.addEventListener('transitionend', (e)=>{
            if (e.target && e.target.classList.contains('carousel-track')) {
                enableCarouselParallax(root);
            }
        }, { passive:true });
    };
}

