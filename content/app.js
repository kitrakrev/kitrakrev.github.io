// Portfolio Application — 3-View System (Overview / SDE / Data Science)
// Editorial design: high readability, recruiter-optimized
class PortfolioApp {
    constructor() {
        this.data = null;
        this.currentSection = 'home';
        this.currentView = 'overview';
    }

    async init() {
        await this.loadData();
        this.detectViewFromHash();
        this.setupEventListeners();
        this.renderCurrentView();
        this.setupTheme();
    }

    detectViewFromHash() {
        const hash = window.location.hash.replace('#', '');
        if (['sde', 'datascience', 'overview'].includes(hash)) {
            this.currentView = hash;
            this.currentSection = 'home';
        }
    }

    async loadData() {
        try {
            const response = await fetch('content/data.json?v=20260618c');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    setupEventListeners() {
        // Nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('target') === '_blank') return;
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) this.navigateToSection(section);
            });
        });

        // Mobile nav
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('target') === '_blank') return;
                e.preventDefault();
                const section = link.getAttribute('data-section');
                if (section) this.navigateToSection(section);
                this.closeMobileMenu();
            });
        });

        // Theme toggle
        document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggleTheme());

        // Mobile menu
        document.getElementById('menu-toggle')?.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile on outside click
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('mobile-menu');
            const btn = document.getElementById('menu-toggle');
            if (menu?.classList.contains('active') && !menu.contains(e.target) && !btn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Delegated: view switcher + section links
        document.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-view]');
            if (viewBtn) { e.preventDefault(); this.switchView(viewBtn.getAttribute('data-view')); return; }
            const secBtn = e.target.closest('[data-section]');
            if (secBtn && !secBtn.classList.contains('nav-link') && !secBtn.classList.contains('mobile-nav-link')) {
                e.preventDefault();
                this.navigateToSection(secBtn.getAttribute('data-section'));
            }
        });

        window.addEventListener('hashchange', () => { this.detectViewFromHash(); this.renderCurrentView(); });
    }

    switchView(view) {
        this.currentView = view;
        this.currentSection = 'home';
        window.location.hash = view;
        this.renderCurrentView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderCurrentView() {
        if (!this.data) return;
        switch (this.currentSection) {
            case 'home':
                if (this.currentView === 'sde') this.renderSDEPage();
                else if (this.currentView === 'datascience') this.renderDataSciencePage();
                else this.renderOverviewPage();
                break;
            case 'skills': this.renderSkillsPage(); break;
            case 'contact': this.renderContactPage(); break;
            default: this.renderOverviewPage();
        }
        this.updateNavigation();
    }

    // Theme
    setupTheme() {
        const saved = localStorage.getItem('theme') || 'system';
        this.applyTheme(saved);
    }
    applyTheme(theme) {
        const body = document.body;
        const toggle = document.getElementById('theme-toggle');
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            body.setAttribute('data-theme', 'dark');
            if (toggle) toggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            body.removeAttribute('data-theme');
            if (toggle) toggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
    toggleTheme() {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    // Mobile menu
    toggleMobileMenu() {
        document.getElementById('mobile-menu')?.classList.toggle('active');
        document.getElementById('menu-toggle')?.classList.toggle('active');
    }
    closeMobileMenu() {
        document.getElementById('mobile-menu')?.classList.remove('active');
        document.getElementById('menu-toggle')?.classList.remove('active');
    }

    // Navigation
    navigateToSection(section) {
        this.currentSection = section;
        this.renderCurrentView();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === this.currentSection);
        });
    }

    // ===== VIEW SWITCHER =====
    viewSwitcher() {
        return `
        <div class="view-switcher">
            <p class="view-switcher-label">View portfolio as</p>
            <div class="view-switcher-inner">
                <button class="view-switcher-btn ${this.currentView === 'overview' ? 'active' : ''}" data-view="overview">
                    <i class="fas fa-user"></i> Overview
                </button>
                <button class="view-switcher-btn ${this.currentView === 'sde' ? 'active' : ''}" data-view="sde">
                    <i class="fas fa-code"></i> Software Engineer
                </button>
                <button class="view-switcher-btn ${this.currentView === 'datascience' ? 'active' : ''}" data-view="datascience">
                    <i class="fas fa-brain"></i> AI / ML
                </button>
            </div>
        </div>`;
    }

    // ===== SHARED COMPONENTS =====
    heroBlock(subtitle, summary, extraButtons = '') {
        const p = this.data.profile;
        return `
        <section class="hero-section">
            <div class="hero-container">
                <div class="hero-image">
                    <img src="${p.profileImage}" alt="${p.name}" />
                </div>
                <div class="hero-content">
                    <h1>${p.name}</h1>
                    <h2>${subtitle}</h2>
                    <p class="hero-summary">${summary}</p>
                    <div class="contact-bar">
                        <span><i class="fas fa-map-marker-alt"></i> ${p.contact.location}</span>
                        <span><i class="fas fa-envelope"></i> ${p.contact.email}</span>
                    </div>
                    <div class="hero-actions">
                        <a href="${p.links.resume}" class="btn btn-primary" download><i class="fas fa-download"></i> Resume</a>
                        <a href="${p.links.linkedin}" class="btn btn-secondary" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
                        <a href="${p.links.github}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                        ${extraButtons}
                    </div>
                </div>
            </div>
        </section>`;
    }

    educationBlock() {
        return `
        <section class="education-section">
            <div class="container">
                <p class="section-label"><i class="fas fa-graduation-cap"></i> Education</p>
                <div class="education-grid">
                    ${this.data.education.map(edu => `
                    <div class="edu-card">
                        <h3>${edu.degree}</h3>
                        <h4>${edu.institution}</h4>
                        <div class="edu-meta">
                            <span>${edu.duration}</span>
                            <span class="gpa-badge">GPA: ${edu.gpa}</span>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
    }

    expCard(exp) {
        return `
        <div class="exp-card ${exp.award ? 'has-award' : ''}">
            ${exp.award ? `<div class="award-ribbon"><i class="fas fa-trophy"></i> ${exp.award}</div>` : ''}
            <div class="exp-card-header">
                <div class="exp-main-info">
                    <h3 class="exp-title">${exp.title}</h3>
                    <h4 class="exp-company">${exp.company}</h4>
                    ${exp.focus ? `<p class="research-focus"><i class="fas fa-bullseye"></i> ${exp.focus}</p>` : ''}
                </div>
                <div class="exp-meta-info">
                    <span class="exp-duration"><i class="far fa-calendar-alt"></i> ${exp.duration}</span>
                    <span class="exp-location"><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
                </div>
            </div>
            ${exp.impact ? `<div class="exp-impact"><i class="fas fa-chart-line"></i> ${exp.impact}</div>` : ''}
            <div class="exp-achievements">
                ${(exp.achievements || []).map(a => `
                <div class="achievement-item"><i class="fas fa-circle"></i><span>${a}</span></div>`).join('')}
            </div>
            <div class="exp-tech-stack">
                ${(exp.technologies || []).map(t => `<span class="tech-badge">${t}</span>`).join('')}
            </div>
        </div>`;
    }

    achievementsBlock(filter) {
        const items = filter ? this.data.achievements.filter(filter) : this.data.achievements;
        if (!items.length) return '';
        return `
        <section class="achievements-section">
            <div class="container">
                <p class="section-label"><i class="fas fa-trophy"></i> Recognition</p>
                <div class="achievements-grid">
                    ${items.map(a => `
                    <div class="achievement-card">
                        <div class="achievement-icon"><i class="fas fa-trophy"></i></div>
                        <div><h4>${a.link ? `<a href="${a.link}" target="_blank" rel="noopener noreferrer">${a.title} <i class="fas fa-external-link-alt" style="font-size:0.65rem;opacity:0.5"></i></a>` : a.title}</h4></div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
    }

    ctaBlock(altViewLabel, altViewKey) {
        const p = this.data.profile;
        return `
        <section class="cta-section">
            <div class="container">
                <div class="cta-actions">
                    <a href="mailto:${p.contact.email}" class="btn btn-primary"><i class="fas fa-envelope"></i> Email Me</a>
                    <a href="${p.links.resume}" class="btn btn-secondary" download><i class="fas fa-download"></i> Resume</a>
                    ${altViewLabel ? `<button class="btn btn-outline" data-view="${altViewKey}"><i class="fas fa-exchange-alt"></i> ${altViewLabel}</button>` : ''}
                </div>
            </div>
        </section>`;
    }

    // ===== OVERVIEW PAGE =====
    renderOverviewPage() {
        const main = document.getElementById('main-content');
        main.innerHTML = `
            ${this.heroBlock(
                'AI / Software Engineer',
                'Founding engineer building and validating production agentic AI systems — test automation, multi-agent routing, and dev infrastructure. M.S. AI @ UC Santa Cruz (3.9). Open-source: Google Tunix, LangChain, Ivy. NVIDIA GTC 2026 · SemEval 2025 Task 4 Winner.'
            )}

            <section class="highlights-section">
                <div class="container">
                    <div class="highlights-grid">
                        <div class="highlight-card"><i class="fas fa-graduation-cap"></i><h3>M.S. AI</h3><p>UC Santa Cruz &mdash; 3.9 GPA</p></div>
                        <div class="highlight-card"><i class="fas fa-briefcase"></i><h3>4 Roles</h3><p>Elas &middot; Samsung &middot; Citi &middot; MultiOn</p></div>
                        <div class="highlight-card"><i class="fas fa-microphone-alt"></i><h3>GTC 2026</h3><p>NVIDIA Demo &mdash; Meta Booth</p></div>
                        <div class="highlight-card"><i class="fas fa-code-branch"></i><h3>Open Source</h3><p>Tunix &middot; LangChain &middot; Ivy</p></div>
                    </div>
                </div>
            </section>

            ${this.educationBlock()}

            <section class="experience-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-briefcase"></i> Experience</p>
                    <div class="experience-grid">
                        ${this.data.career_experience.map(e => `
                        <div class="exp-card">
                            <div class="exp-card-header">
                                <div class="exp-main-info">
                                    <h3 class="exp-title">${e.title}</h3>
                                    <h4 class="exp-company">${e.company}</h4>
                                </div>
                                <div class="exp-meta-info">
                                    <span class="exp-duration">${e.duration}</span>
                                    <span class="exp-location">${e.location}</span>
                                </div>
                            </div>
                            ${e.impact ? `<div class="exp-impact"><i class="fas fa-chart-line"></i> ${e.impact}</div>` : ''}
                            <div class="exp-tech-stack">
                                ${e.technologies.slice(0, 6).map(t => `<span class="tech-badge">${t}</span>`).join('')}
                            </div>
                        </div>`).join('')}
                    </div>
                </div>
            </section>

            <section class="section-block">
                <div class="container">
                    <p class="section-label"><i class="fas fa-tools"></i> Skills</p>
                    <h2>Core Competencies</h2>
                    <div class="competency-grid">
                        <div class="competency-card">
                            <h3><i class="fas fa-server"></i> Backend & Systems</h3>
                            <div class="competency-tags">
                                ${['Distributed Systems', 'Microservices', 'REST APIs', 'Event-Driven', 'System Design'].map(s => `<span class="tag">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="competency-card">
                            <h3><i class="fas fa-brain"></i> AI / ML</h3>
                            <div class="competency-tags">
                                ${['LLM Systems', 'RAG Pipelines', 'Agent Architectures', 'PyTorch', 'NLP'].map(s => `<span class="tag">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="competency-card">
                            <h3><i class="fas fa-cloud"></i> Cloud & DevOps</h3>
                            <div class="competency-tags">
                                ${['AWS (EKS, EC2, S3, SQS)', 'Docker', 'Kubernetes', 'CI/CD'].map(s => `<span class="tag">${s}</span>`).join('')}
                            </div>
                        </div>
                        <div class="competency-card">
                            <h3><i class="fas fa-code"></i> Languages</h3>
                            <div class="competency-tags">
                                ${['Python', 'Java', 'C++', 'Go', 'Rust', 'SQL'].map(s => `<span class="tag">${s}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            ${this.achievementsBlock()}

            <section class="cta-section">
                <div class="container">
                    <div class="cta-actions">
                        <a href="mailto:${this.data.profile.contact.email}" class="btn btn-primary"><i class="fas fa-envelope"></i> Email Me</a>
                        <a href="${this.data.profile.links.resume}" class="btn btn-secondary" download><i class="fas fa-download"></i> Download Resume</a>
                        <a href="${this.data.profile.links.linkedin}" class="btn btn-outline" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
                    </div>
                </div>
            </section>
        `;
    }

    // ===== SDE PAGE =====
    renderSDEPage() {
        const main = document.getElementById('main-content');
        const skills = this.data.sde_skills;

        main.innerHTML = `
            ${this.viewSwitcher()}

            <section class="hero-section">
                <div class="hero-container">
                    <div class="hero-image">
                        <img src="${this.data.profile.profileImage}" alt="${this.data.profile.name}" />
                    </div>
                    <div class="hero-content">
                        <div class="role-target-badge"><i class="fas fa-bullseye"></i> Tailored for Software Engineer roles</div>
                        <h1>${this.data.profile.name}</h1>
                        <h2>Software Engineer</h2>
                        <p class="hero-summary"><strong>Agentic systems, test automation, distributed backends.</strong> Founding engineer at Elas — eval frameworks, multi-agent routing, CI/CD. M.S. AI @ UC Santa Cruz (3.9). Python, C++, Java, Go.</p>
                        <div class="contact-bar">
                            <span><i class="fas fa-map-marker-alt"></i> ${this.data.profile.contact.location}</span>
                            <span><i class="fas fa-envelope"></i> ${this.data.profile.contact.email}</span>
                        </div>
                        <div class="hero-actions">
                            <a href="${this.data.profile.links.resume}" class="btn btn-primary" download><i class="fas fa-download"></i> Resume</a>
                            <a href="${this.data.profile.links.linkedin}" class="btn btn-secondary" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
                            <a href="${this.data.profile.links.github}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="qualifications-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-check-double"></i> Qualifications</p>
                    <div class="qual-grid">
                        ${(this.data.qualifications_sde || []).map(q => `
                        <div class="qual-card">
                            <div class="qual-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="qual-content"><h4>${q.t}</h4><p>${q.d}</p></div>
                        </div>`).join('')}
                    </div>
                </div>
            </section>

            ${this.educationBlock()}

            <section class="experience-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-briefcase"></i> Experience</p>
                    <div class="experience-grid">
                        ${this.data.career_experience.map(e => this.viewExpCard(e, 'sde')).join('')}
                    </div>
                </div>
            </section>

            <section class="projects-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-project-diagram"></i> Projects</p>
                    <div class="sde-projects-grid">
                        <div class="project-card-compact">
                            <h3>Distributed URL Shortener</h3>
                            <p>Consistent hashing, Redis caching, AWS auto-scaling for high throughput.</p>
                            <div class="project-tags">${['Go', 'Redis', 'AWS', 'Docker', 'Kubernetes'].map(t => `<span class="tag">${t}</span>`).join('')}</div>
                        </div>
                        <div class="project-card-compact">
                            <h3>Real-Time Log Pipeline</h3>
                            <p>Fault-tolerant ingestion with Kafka + Spark Streaming, PostgreSQL metrics.</p>
                            <div class="project-tags">${['Kafka', 'Spark Streaming', 'PostgreSQL', 'REST APIs'].map(t => `<span class="tag">${t}</span>`).join('')}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="skills-section-compact">
                <div class="container">
                    <p class="section-label"><i class="fas fa-tools"></i> Technical Skills</p>
                    <div class="skills-table">
                        ${Object.entries(skills).map(([key, vals]) => `
                        <div class="skill-row">
                            <span class="skill-label">${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                            <span class="skill-values">${vals.join('  &middot;  ')}</span>
                        </div>`).join('')}
                    </div>
                </div>
            </section>

            ${this.achievementsBlock(a => ['NVIDIA GTC 2026 Demo — Meta Booth', 'Open-Source Contributor — LangChain', 'ICPC Regionals - Top 300', 'Smart India Hackathon Winner (2023)'].includes(a.title))}

            ${this.ctaBlock('View AI/ML Profile', 'datascience')}
        `;
    }

    // Renders an experience card using view-specific bullets/techs from data
    // view: 'sde' or 'ds'
    viewExpCard(exp, view) {
        const bullets = (view === 'sde' ? exp.sde_bullets : exp.ds_bullets) || exp.achievements || [];
        const techs = (view === 'sde' ? exp.sde_techs : exp.ds_techs) || exp.technologies || [];
        return `
        <div class="exp-card">
            <div class="exp-card-header">
                <div class="exp-main-info">
                    <h3 class="exp-title">${exp.title}</h3>
                    <h4 class="exp-company">${exp.company}</h4>
                </div>
                <div class="exp-meta-info">
                    <span class="exp-duration">${exp.duration}</span>
                    <span class="exp-location">${exp.location}</span>
                </div>
            </div>
            <div class="exp-achievements">
                ${bullets.map(b => `<div class="achievement-item"><i class="fas fa-circle"></i><span>${b}</span></div>`).join('')}
            </div>
            <div class="exp-tech-stack">
                ${techs.map(t => `<span class="tech-badge">${t}</span>`).join('')}
            </div>
        </div>`;
    }

    // ===== DATA SCIENCE PAGE =====
    renderDataSciencePage() {
        const main = document.getElementById('main-content');
        const skills = this.data.ds_skills;

        main.innerHTML = `
            ${this.viewSwitcher()}

            <section class="hero-section">
                <div class="hero-container">
                    <div class="hero-image">
                        <img src="${this.data.profile.profileImage}" alt="${this.data.profile.name}" />
                    </div>
                    <div class="hero-content">
                        <div class="role-target-badge ds"><i class="fas fa-bullseye"></i> Tailored for AI / ML roles</div>
                        <h1>${this.data.profile.name}</h1>
                        <h2>AI / ML Engineer</h2>
                        <p class="hero-summary"><strong>Production AI agents, evals, multi-agent systems.</strong> Founding engineer; open-source Google Tunix, LangChain, Ivy. NVIDIA GTC 2026 · SemEval 2025 Task 4 Winner. M.S. AI @ UC Santa Cruz (3.9).</p>
                        <div class="contact-bar">
                            <span><i class="fas fa-map-marker-alt"></i> ${this.data.profile.contact.location}</span>
                            <span><i class="fas fa-envelope"></i> ${this.data.profile.contact.email}</span>
                        </div>
                        <div class="hero-actions">
                            <a href="${this.data.profile.links.resume}" class="btn btn-primary" download><i class="fas fa-download"></i> Resume</a>
                            <a href="${this.data.profile.links.linkedin}" class="btn btn-secondary" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>
                            <a href="${this.data.profile.links.github}" class="btn btn-secondary" target="_blank"><i class="fab fa-github"></i> GitHub</a>
                            <a href="${this.data.profile.contact.googleScholar}" class="btn btn-outline" target="_blank"><i class="fas fa-book"></i> Scholar</a>
                        </div>
                    </div>
                </div>
            </section>

            ${this.educationBlock()}

            <section class="experience-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-brain"></i> Experience</p>
                    <div class="experience-grid">
                        ${this.data.career_experience.map(e => this.viewExpCard(e, 'ds')).join('')}
                    </div>
                </div>
            </section>

            <section class="experience-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-flask"></i> Research</p>
                    <div class="experience-grid">
                        ${this.data.research_experience.map(e => this.expCard(e)).join('')}
                    </div>
                </div>
            </section>

            <section class="projects-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-project-diagram"></i> Projects</p>
                    <div class="sde-projects-grid">
                        ${this.data.projects.filter(p => p.category === 'Data Science').map(proj => `
                        <div class="project-card-compact">
                            <h3>${proj.title}</h3>
                            <p>${proj.description}</p>
                            <div class="project-tags">${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                        </div>`).join('')}
                    </div>
                </div>
            </section>

            <section class="skills-section-compact">
                <div class="container">
                    <p class="section-label"><i class="fas fa-tools"></i> Technical Skills</p>
                    <div class="skills-table">
                        ${Object.entries(skills).map(([key, vals]) => `
                        <div class="skill-row">
                            <span class="skill-label">${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                            <span class="skill-values">${vals.join('  &middot;  ')}</span>
                        </div>`).join('')}
                    </div>
                </div>
            </section>

            <section class="publications-compact-section">
                <div class="container">
                    <p class="section-label"><i class="fas fa-book"></i> Publications</p>
                    <div class="publications-list">
                        ${this.data.publications.map(pub => `
                        <div class="pub-item">
                            <h4>${pub.title}</h4>
                            <p class="pub-meta">${pub.authors} &mdash; ${pub.venue} (${pub.year})</p>
                        </div>`).join('')}
                    </div>
                </div>
            </section>

            ${this.achievementsBlock()}
            ${this.ctaBlock('View SDE Profile', 'sde')}
        `;
    }

    // ===== SKILLS PAGE =====
    renderSkillsPage() {
        const main = document.getElementById('main-content');
        const skills = this.data.skills;
        const allTech = Object.values(skills.technical).flat();

        main.innerHTML = `
            ${this.viewSwitcher()}
            <div class="page-header"><div class="container">
                <h1>Skills & Expertise</h1>
            </div></div>

            <section class="skills-summary-section">
                <div class="container">
                    <div class="skills-summary-grid">
                        <div class="summary-card"><div class="summary-icon"><i class="fas fa-code"></i></div><div class="summary-content"><h3>${allTech.length}</h3><p>Technical Skills</p></div></div>
                        <div class="summary-card"><div class="summary-icon expert"><i class="fas fa-star"></i></div><div class="summary-content"><h3>${allTech.filter(s=>s.level==='Expert').length}</h3><p>Expert Level</p></div></div>
                        <div class="summary-card"><div class="summary-icon advanced"><i class="fas fa-rocket"></i></div><div class="summary-content"><h3>${allTech.filter(s=>s.level==='Advanced').length}</h3><p>Advanced Level</p></div></div>
                    </div>
                </div>
            </section>

            <section class="skills-section">
                <div class="container">
                ${Object.entries(skills.technical).map(([key, items]) => {
                    if (!items?.length) return '';
                    return `
                    <div class="skill-category">
                        <h3>${key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
                        <div class="skills-grid">
                            ${items.map(s => `
                            <div class="skill-card ${s.level.toLowerCase()}">
                                <div class="skill-icon" style="color:${s.color}"><i class="${s.icon}"></i></div>
                                <div class="skill-content">
                                    <h4>${s.name}</h4>
                                    <div class="skill-level"><span class="level-badge ${s.level.toLowerCase()}">${s.level}</span></div>
                                    <p>${s.description}</p>
                                </div>
                            </div>`).join('')}
                        </div>
                    </div>`;
                }).join('')}
                </div>
            </section>

            <section class="skills-section">
                <div class="container">
                    <h2 style="text-align:center">Research Expertise</h2>
                    <div class="research-skills-grid">
                        ${skills.research_areas.map(a => `
                        <div class="research-skill-card">
                            <div class="skill-icon" style="color:${a.color}"><i class="${a.icon}"></i></div>
                            <div class="skill-content">
                                <h4>${a.name}</h4>
                                <div class="skill-level"><span class="level-badge ${a.expertise.toLowerCase()}">${a.expertise}</span></div>
                                <p>${a.description}</p>
                            </div>
                        </div>`).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    // ===== CONTACT PAGE =====
    renderContactPage() {
        const main = document.getElementById('main-content');
        const p = this.data.profile;
        main.innerHTML = `
            ${this.viewSwitcher()}
            <div class="page-header"><div class="container">
                <h1>Get in Touch</h1>
            </div></div>
            <section class="contact-section">
                <div class="container">
                    <div class="contact-grid">
                        <div class="contact-info">
                            <h2>Contact Information</h2>
                            <div class="contact-item"><i class="fas fa-envelope"></i><div><h3>Email</h3><p>${p.contact.email}</p></div></div>
                            <div class="contact-item"><i class="fas fa-phone"></i><div><h3>Phone</h3><p>${p.contact.phone}</p></div></div>
                            <div class="contact-item"><i class="fas fa-map-marker-alt"></i><div><h3>Location</h3><p>${p.contact.location}</p></div></div>
                            <div class="social-links">
                                <a href="${p.links.linkedin}" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>
                                <a href="${p.links.github}" target="_blank" class="social-link"><i class="fab fa-github"></i></a>
                                <a href="${p.contact.googleScholar}" target="_blank" class="social-link"><i class="fas fa-graduation-cap"></i></a>
                            </div>
                        </div>
                        <div class="contact-form">
                            <h2>Send a Message</h2>
                            <form id="contact-form">
                                <div class="form-group"><input type="text" name="name" placeholder="Your Name" required /></div>
                                <div class="form-group"><input type="email" name="email" placeholder="Your Email" required /></div>
                                <div class="form-group"><input type="text" name="subject" placeholder="Subject" required /></div>
                                <div class="form-group"><textarea name="message" placeholder="Your Message" rows="5" required></textarea></div>
                                <button type="submit" class="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;
        document.getElementById('contact-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            e.target.reset();
        });
    }
}

// Init
let portfolioApp;
document.addEventListener('DOMContentLoaded', () => {
    portfolioApp = new PortfolioApp();
    portfolioApp.init();
});
