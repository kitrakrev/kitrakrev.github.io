// Portfolio Application JavaScript
class PortfolioApp {
    constructor() {
        this.data = null;
        this.currentSection = 'home';
        this.searchQuery = '';
        this.currentFilter = 'all';
    }

    async init() {
        console.log('PortfolioApp initializing...');
        await this.loadData();
        console.log('Data loaded, setting up event listeners...');
        this.setupEventListeners();
        console.log('Event listeners set up, rendering home page...');
        this.renderHomePage();
        console.log('Home page rendered, setting up theme...');
        this.setupTheme();
        console.log('PortfolioApp initialization complete!');
    }

    async loadData() {
        try {
            const response = await fetch('content/data.json');
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            profile: {
                name: "Karthik Raja Anandan",
                title: "AI Researcher & Machine Learning Engineer",
                description: "Loading...",
                links: {
                    linkedin: "https://www.linkedin.com/in/kitrakrev",
                    github: "https://github.com/kitrakrev"
                }
            },
            projects: [],
            publications: [],
            research: [],
            blogs: [],
            experience: []
        };
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Mobile navigation links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
                // Close mobile menu after navigation
                this.closeMobileMenu();
            });
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterContent();
            });
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.getAttribute('data-filter');
                this.updateFilterButtons();
                this.filterContent();
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        console.log('Menu toggle element:', menuToggle);
        if (menuToggle) {
            console.log('Adding click listener to menu toggle');
            menuToggle.addEventListener('click', () => {
                console.log('Menu toggle clicked!');
                this.toggleMobileMenu();
            });
        } else {
            console.error('Menu toggle element not found!');
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuToggle = document.getElementById('menu-toggle');
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
    }

    setupTheme() {
        console.log('Setting up theme...');
        const savedTheme = localStorage.getItem('theme') || 'system';
        console.log('Saved theme:', savedTheme);
        this.applyTheme(savedTheme);
    }

    applyTheme(theme) {
        console.log('Applying theme:', theme);
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        console.log('Theme toggle element:', themeToggle);
        console.log('Current body attributes:', body.getAttribute('data-theme'));
        
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            console.log('Applying dark theme');
            body.setAttribute('data-theme', 'dark');
            body.classList.remove('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                console.log('Set theme toggle to sun icon');
            }
        } else {
            console.log('Applying light theme');
            body.removeAttribute('data-theme');
            body.classList.add('light-mode');
            if (themeToggle) {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                console.log('Set theme toggle to moon icon');
            }
        }
        
        console.log('Final body attributes:', body.getAttribute('data-theme'));
    }

    toggleTheme() {
        console.log('toggleTheme called');
        const body = document.body;
        const isDark = body.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';
        
        console.log('Current theme is dark:', isDark);
        console.log('Switching to theme:', newTheme);
        
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        console.log('Theme saved to localStorage:', newTheme);
    }

    toggleMobileMenu() {
        console.log('toggleMobileMenu called');
        const menu = document.getElementById('mobile-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        console.log('Mobile menu element:', menu);
        console.log('Menu toggle element:', menuToggle);
        
        if (menu && menuToggle) {
            console.log('Before toggle - Menu classes:', menu.className);
            console.log('Before toggle - Toggle classes:', menuToggle.className);
            
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            console.log('After toggle - Menu classes:', menu.className);
            console.log('After toggle - Toggle classes:', menuToggle.className);
        } else {
            console.error('Mobile menu or toggle not found!');
        }
    }

    closeMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (menu && menuToggle) {
            menu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }

    navigateToSection(section) {
        this.currentSection = section;
        this.updateNavigation();
        
        switch(section) {
            case 'home':
                this.renderHomePage();
                break;
            case 'projects':
                this.renderProjectsPage();
                break;
            case 'publications':
                this.renderPublicationsPage();
                break;
            case 'research':
                this.renderResearchPage();
                break;
            case 'blogs':
                this.renderBlogsPage();
                break;
            case 'experience':
                this.renderExperiencePage();
                break;
            case 'contact':
                this.renderContactPage();
                break;
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    renderHomePage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        const profile = this.data.profile;
        
        mainContent.innerHTML = `
            <section id="hero" class="hero-section">
                <div class="hero-container">
                    <div class="hero-image">
                        <img src="${profile.profileImage}" alt="${profile.name}" />
                    </div>
                    <div class="hero-content">
                        <h1>${profile.name}</h1>
                        <h2>${profile.title}</h2>
                        <p>${profile.description}</p>
                        <p>${profile.longDescription}</p>
                        
                        <div class="research-areas">
                            <h3>Research Areas:</h3>
                            <div class="tags">
                                ${profile.researchAreas.map(area => `<span class="tag">${area}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="hero-actions">
                            <a href="${profile.links.resume}" class="btn btn-primary" download>
                                <i class="fas fa-download"></i> Download Resume
                            </a>
                            <a href="${profile.links.linkedin}" class="btn btn-secondary" target="_blank">
                                <i class="fab fa-linkedin"></i> LinkedIn
                            </a>
                            <a href="${profile.links.github}" class="btn btn-secondary" target="_blank">
                                <i class="fab fa-github"></i> GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="highlights" class="highlights-section">
                <div class="container">
                    <h2>Highlights</h2>
                    <div class="highlights-grid">
                        <div class="highlight-card">
                            <i class="fas fa-project-diagram"></i>
                            <h3>${this.data.projects.length}</h3>
                            <p>Research Projects</p>
                        </div>
                        <div class="highlight-card">
                            <i class="fas fa-book"></i>
                            <h3>${this.data.publications.length}</h3>
                            <p>Publications</p>
                        </div>
                        <div class="highlight-card">
                            <i class="fas fa-microscope"></i>
                            <h3>${this.data.research.length}</h3>
                            <p>Research Areas</p>
                        </div>
                        <div class="highlight-card">
                            <i class="fas fa-briefcase"></i>
                            <h3>${this.data.experience.length}</h3>
                            <p>Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="featured-projects" class="featured-section">
                <div class="container">
                    <h2>Featured Projects</h2>
                    <div class="projects-grid">
                        ${this.data.projects.slice(0, 3).map(project => this.renderProjectCard(project)).join('')}
                    </div>
                    <div class="section-footer">
                        <a href="#" class="btn btn-outline" data-section="projects">View All Projects</a>
                    </div>
                </div>
            </section>

            <section id="latest-blogs" class="featured-section">
                <div class="container">
                    <h2>Latest Blog Posts</h2>
                    <div class="blogs-grid">
                        ${this.data.blogs.slice(0, 3).map(blog => this.renderBlogCard(blog)).join('')}
                    </div>
                    <div class="section-footer">
                        <a href="#" class="btn btn-outline" data-section="blogs">View All Blogs</a>
                    </div>
                </div>
            </section>
        `;

        // Add event listeners for the new buttons
        this.addSectionButtonListeners();
    }

    renderProjectsPage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        mainContent.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <h1>Projects</h1>
                    <p>Research projects and implementations in AI and Machine Learning</p>
                </div>
            </section>

            <section class="search-filter-section">
                <div class="container">
                    <div class="search-box">
                        <input type="text" id="search-input" placeholder="Search projects..." />
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="research">Research</button>
                        <button class="filter-btn" data-filter="implementation">Implementation</button>
                        <button class="filter-btn" data-filter="multimodal">Multimodal</button>
                        <button class="filter-btn" data-filter="rag">RAG</button>
                    </div>
                </div>
            </section>

            <section class="projects-section">
                <div class="container">
                    <div id="projects-grid" class="projects-grid">
                        ${this.data.projects.map(project => this.renderProjectCard(project, true)).join('')}
                    </div>
                </div>
            </section>
        `;

        this.setupSearchAndFilter();
    }

    renderPublicationsPage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        mainContent.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <h1>Publications</h1>
                    <p>Research papers and publications in AI and Machine Learning</p>
                </div>
            </section>

            <section class="search-filter-section">
                <div class="container">
                    <div class="search-box">
                        <input type="text" id="search-input" placeholder="Search publications..." />
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="conference">Conference</button>
                        <button class="filter-btn" data-filter="journal">Journal</button>
                        <button class="filter-btn" data-filter="workshop">Workshop</button>
                    </div>
                </div>
            </section>

            <section class="publications-section">
                <div class="container">
                    <div id="publications-grid" class="publications-grid">
                        ${this.data.publications.map(pub => this.renderPublicationCard(pub)).join('')}
                    </div>
                </div>
            </section>
        `;

        this.setupSearchAndFilter();
    }

    renderResearchPage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        mainContent.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <h1>Research</h1>
                    <p>Current research areas and ongoing projects</p>
                </div>
            </section>

            <section class="research-section">
                <div class="container">
                    <div class="research-grid">
                        ${this.data.research.map(research => this.renderResearchCard(research)).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    renderBlogsPage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        mainContent.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <h1>Blog Posts</h1>
                    <p>Thoughts, tutorials, and insights on AI research</p>
                </div>
            </section>

            <section class="search-filter-section">
                <div class="container">
                    <div class="search-box">
                        <input type="text" id="search-input" placeholder="Search blogs..." />
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="tutorial">Tutorial</button>
                        <button class="filter-btn" data-filter="analysis">Analysis</button>
                        <button class="filter-btn" data-filter="research">Research</button>
                    </div>
                </div>
            </section>

            <section class="blogs-section">
                <div class="container">
                    <div id="blogs-grid" class="blogs-grid">
                        ${this.data.blogs.map(blog => this.renderBlogCard(blog, true)).join('')}
                    </div>
                </div>
            </section>
        `;

        this.setupSearchAndFilter();
    }

    renderExperiencePage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        mainContent.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <h1>Experience</h1>
                    <p>Professional experience and research positions</p>
                </div>
            </section>

            <section class="experience-section">
                <div class="container">
                    <div class="timeline">
                        ${this.data.experience.map(exp => this.renderExperienceCard(exp)).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    renderContactPage() {
        const mainContent = document.getElementById('main-content');
        if (!mainContent || !this.data) return;

        mainContent.innerHTML = `
            <section class="page-header">
                <div class="container">
                    <h1>Contact</h1>
                    <p>Get in touch for collaborations, questions, or opportunities</p>
                </div>
            </section>

            <section class="contact-section">
                <div class="container">
                    <div class="contact-grid">
                        <div class="contact-info">
                            <h2>Get In Touch</h2>
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <h3>Email</h3>
                                    <p>karthik.raja@ucsc.edu</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <div>
                                    <h3>Location</h3>
                                    <p>Santa Cruz, California</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-university"></i>
                                <div>
                                    <h3>Institution</h3>
                                    <p>University of California, Santa Cruz</p>
                                </div>
                            </div>
                            
                            <div class="social-links">
                                <a href="${this.data.profile.links.linkedin}" target="_blank" class="social-link">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                                <a href="${this.data.profile.links.github}" target="_blank" class="social-link">
                                    <i class="fab fa-github"></i>
                                </a>
                                <a href="${this.data.profile.links.githubPages}" target="_blank" class="social-link">
                                    <i class="fas fa-globe"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div class="contact-form">
                            <h2>Send Message</h2>
                            <form id="contact-form">
                                <div class="form-group">
                                    <input type="text" id="name" name="name" placeholder="Your Name" required />
                                </div>
                                <div class="form-group">
                                    <input type="email" id="email" name="email" placeholder="Your Email" required />
                                </div>
                                <div class="form-group">
                                    <input type="text" id="subject" name="subject" placeholder="Subject" required />
                                </div>
                                <div class="form-group">
                                    <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        `;

        this.setupContactForm();
    }

    renderProjectCard(project, fullView = false) {
        return `
            <div class="project-card" data-category="${project.category.toLowerCase()}" data-tags="${project.tags.join(' ').toLowerCase()}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" />
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${fullView ? project.longDescription : project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-small"><i class="fab fa-github"></i> Code</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-small"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                        <button class="btn btn-small btn-outline" onclick="portfolioApp.showProjectDetails('${project.id}')">Details</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderPublicationCard(pub) {
        return `
            <div class="publication-card" data-category="${pub.category.toLowerCase()}" data-tags="${pub.tags.join(' ').toLowerCase()}">
                <div class="publication-content">
                    <h3>${pub.title}</h3>
                    <p class="authors">${pub.authors}</p>
                    <p class="venue">${pub.venue} (${pub.year})</p>
                    <p class="abstract">${pub.abstract}</p>
                    <div class="publication-tags">
                        ${pub.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="publication-actions">
                        ${pub.pdf ? `<a href="${pub.pdf}" target="_blank" class="btn btn-small"><i class="fas fa-file-pdf"></i> PDF</a>` : ''}
                        ${pub.code ? `<a href="${pub.code}" target="_blank" class="btn btn-small"><i class="fab fa-github"></i> Code</a>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderResearchCard(research) {
        return `
            <div class="research-card">
                <div class="research-content">
                    <h3>${research.title}</h3>
                    <p>${research.description}</p>
                    <div class="research-details">
                        <p><strong>Focus:</strong> ${research.focus}</p>
                        <p><strong>Institution:</strong> ${research.institution}</p>
                        <p><strong>Supervisor:</strong> ${research.supervisor}</p>
                        <p><strong>Status:</strong> <span class="status ${research.status.toLowerCase()}">${research.status}</span></p>
                    </div>
                </div>
            </div>
        `;
    }

    renderBlogCard(blog, fullView = false) {
        return `
            <div class="blog-card" data-category="${blog.category.toLowerCase()}" data-tags="${blog.tags.join(' ').toLowerCase()}">
                <div class="blog-image">
                    <img src="${blog.image}" alt="${blog.title}" />
                </div>
                <div class="blog-content">
                    <h3>${blog.title}</h3>
                    <p>${blog.excerpt}</p>
                    <div class="blog-meta">
                        <span class="date">${blog.date}</span>
                        <span class="read-time">${blog.readTime}</span>
                    </div>
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="${blog.content}" class="btn btn-small">Read More</a>
                </div>
            </div>
        `;
    }

    renderExperienceCard(exp) {
        return `
            <div class="experience-card">
                <div class="experience-content">
                    <h3>${exp.title}</h3>
                    <div class="company-info">
                        <h4>${exp.company}</h4>
                        <span class="location">${exp.location}</span>
                        <span class="duration">${exp.duration}</span>
                    </div>
                    <p>${exp.description}</p>
                    <div class="technologies">
                        ${exp.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="achievements">
                        <h5>Key Achievements:</h5>
                        <ul>
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    setupSearchAndFilter() {
        const searchInput = document.getElementById('search-input');
        const filterButtons = document.querySelectorAll('.filter-btn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterContent();
            });
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.getAttribute('data-filter');
                this.updateFilterButtons();
                this.filterContent();
            });
        });
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === this.currentFilter) {
                btn.classList.add('active');
            }
        });
    }

    filterContent() {
        const items = document.querySelectorAll('.project-card, .publication-card, .blog-card');
        
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const tags = item.getAttribute('data-tags') || '';
            const category = item.getAttribute('data-category') || '';
            
            const matchesSearch = this.searchQuery === '' || 
                title.includes(this.searchQuery) || 
                tags.includes(this.searchQuery);
            
            const matchesFilter = this.currentFilter === 'all' || 
                category.includes(this.currentFilter);
            
            if (matchesSearch && matchesFilter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    addSectionButtonListeners() {
        document.querySelectorAll('[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(e.target);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Contact form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    }

    showProjectDetails(projectId) {
        const project = this.data.projects.find(p => p.id === projectId);
        if (!project) return;

        // Create modal or navigate to detailed view
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="project-details">
                    <img src="${project.image}" alt="${project.title}" />
                    <h2>${project.title}</h2>
                    <p>${project.longDescription}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        ${project.github ? `<a href="${project.github}" target="_blank" class="btn">View Code</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn">Live Demo</a>` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal functionality
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    }
}

// Initialize the portfolio app
let portfolioApp;
document.addEventListener('DOMContentLoaded', () => {
    portfolioApp = new PortfolioApp();
    portfolioApp.init();
}); 