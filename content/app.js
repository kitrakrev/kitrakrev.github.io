// Portfolio Application JavaScript
class PortfolioApp {
    constructor() {
        this.data = null;
        this.currentSection = 'home';
        this.searchQuery = '';
        this.currentFilter = 'all';
        this.currentTag = 'all';
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
            experience: [],
            skills: {
                technical: {
                    programming_languages: [],
                    machine_learning: [],
                    frameworks: [],
                    libraries: [],
                    tools: [],
                    distributed_computing: []
                },
                research_areas: [],
                soft_skills: [],
                certifications: []
            },
            open_source: {
                repositories: [],
                packages: [],
                contributions: [],
                community: []
            }
        };
    }

    setupEventListeners() {
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

        // Tag filter buttons (will be added dynamically)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tag-filter-btn')) {
                this.currentTag = e.target.getAttribute('data-tag');
                this.updateTagFilterButtons();
                this.filterContent();
            }
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
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
            case 'skills':
                this.renderSkillsPage();
                break;
            case 'open_source':
                this.renderOpenSourcePage();
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
                            <i class="fas fa-briefcase"></i>
                            <h3>4+</h3>
                            <p>Years Experience</p>
                        </div>
                        <div class="highlight-card">
                            <i class="fas fa-book"></i>
                            <h3>13</h3>
                            <p>Publications</p>
                        </div>
                        <div class="highlight-card">
                            <i class="fas fa-building"></i>
                            <h3>${(this.data.career_experience || []).length + (this.data.research_experience || []).length}</h3>
                            <p>Roles & Positions</p>
                        </div>
                        <div class="highlight-card">
                            <i class="fas fa-trophy"></i>
                            <h3>${this.data.achievements ? this.data.achievements.length : 0}</h3>
                            <p>Awards & Honors</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="career-experience" class="experience-section career">
                <div class="container">
                    <div class="section-header">
                        <h2><i class="fas fa-briefcase"></i> Career Experience</h2>
                        <p class="section-subtitle">Industry & Professional Roles</p>
                    </div>
                    <div class="experience-grid">
                        ${(this.data.career_experience || []).map(exp => `
                            <div class="exp-card">
                                <div class="exp-card-header">
                                    <div class="exp-main-info">
                                        <h3 class="exp-title">${exp.title}</h3>
                                        <h4 class="exp-company">${exp.company}</h4>
                                    </div>
                                    <div class="exp-meta-info">
                                        <span class="exp-duration"><i class="far fa-calendar-alt"></i> ${exp.duration}</span>
                                        <span class="exp-location"><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
                                    </div>
                                </div>
                                
                                ${exp.impact ? `
                                <div class="exp-impact">
                                    <i class="fas fa-chart-line"></i>
                                    <span>${exp.impact}</span>
                                </div>
                                ` : ''}
                                
                                <div class="exp-achievements">
                                    ${exp.achievements.slice(0, 3).map(achievement => `
                                        <div class="achievement-item">
                                            <i class="fas fa-check-circle"></i>
                                            <span>${achievement}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="exp-tech-stack">
                                    ${exp.technologies.slice(0, 8).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                                    ${exp.technologies.length > 8 ? `<span class="tech-badge tech-more">+${exp.technologies.length - 8}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <section id="research-experience" class="experience-section research">
                <div class="container">
                    <div class="section-header">
                        <h2><i class="fas fa-flask"></i> Research Experience</h2>
                        <p class="section-subtitle">Academic Research & Publications</p>
                    </div>
                    <div class="experience-grid">
                        ${(this.data.research_experience || []).map(exp => `
                            <div class="exp-card ${exp.award ? 'has-award' : ''}">
                                ${exp.award ? `
                                <div class="award-ribbon">
                                    <i class="fas fa-trophy"></i>
                                    <span>${exp.award}</span>
                                </div>
                                ` : ''}
                                
                                <div class="exp-card-header">
                                    <div class="exp-main-info">
                                        <h3 class="exp-title">${exp.title}</h3>
                                        <h4 class="exp-company">${exp.company}</h4>
                                        ${exp.focus ? `<p class="research-focus"><i class="fas fa-bullseye"></i> ${exp.focus}</p>` : ''}
                                    </div>
                                    <div class="exp-meta-info">
                                        <span class="exp-duration"><i class="far fa-calendar-alt"></i> ${exp.duration}</span>
                                        <span class="exp-location"><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>
                                        ${exp.publications ? `<span class="pub-count"><i class="fas fa-book"></i> ${exp.publications} Publications</span>` : ''}
                                    </div>
                                </div>
                                
                                <div class="exp-achievements">
                                    ${exp.achievements.slice(0, 3).map(achievement => `
                                        <div class="achievement-item">
                                            <i class="fas fa-check-circle"></i>
                                            <span>${achievement}</span>
                                        </div>
                                    `).join('')}
                                </div>
                                
                                <div class="exp-tech-stack">
                                    ${exp.technologies.slice(0, 8).map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                                    ${exp.technologies.length > 8 ? `<span class="tech-badge tech-more">+${exp.technologies.length - 8}</span>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <section id="skills-preview" class="skills-preview-section">
                <div class="container">
                    <h2>Key Technical Skills</h2>
                    <div class="skills-preview-grid">
                        <div class="skill-preview-category">
                            <h3><i class="fas fa-code"></i> Programming</h3>
                            <div class="skill-preview-tags">
                                ${this.data.skills.technical.programming_languages.slice(0, 3).map(skill => 
                                    `<span class="skill-preview-tag" style="border-color: ${skill.color}; color: ${skill.color}">${skill.name}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="skill-preview-category">
                            <h3><i class="fas fa-brain"></i> Machine Learning</h3>
                            <div class="skill-preview-tags">
                                ${this.data.skills.technical.machine_learning.slice(0, 3).map(skill => 
                                    `<span class="skill-preview-tag" style="border-color: ${skill.color}; color: ${skill.color}">${skill.name}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="skill-preview-category">
                            <h3><i class="fas fa-language"></i> Frameworks</h3>
                            <div class="skill-preview-tags">
                                ${this.data.skills.technical.frameworks.slice(0, 3).map(skill => 
                                    `<span class="skill-preview-tag" style="border-color: ${skill.color}; color: ${skill.color}">${skill.name}</span>`
                                ).join('')}
                            </div>
                        </div>
                        <div class="skill-preview-category">
                            <h3><i class="fas fa-cloud"></i> Distributed Computing</h3>
                            <div class="skill-preview-tags">
                                ${this.data.skills.technical.distributed_computing.slice(0, 3).map(skill => 
                                    `<span class="skill-preview-tag" style="border-color: ${skill.color}; color: ${skill.color}">${skill.name}</span>`
                                ).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="section-footer">
                        <a href="#" class="btn btn-outline" data-section="skills">View All Skills</a>
                    </div>
                </div>
            </section>
                            `+
            // <section id="open-source-preview" class="open-source-preview-section">
            //     <div class="container">
            //         <h2>Open Source Contributions</h2>
            //         <div class="open-source-preview-grid">
            //             <div class="open-source-preview-category">
            //                 <h3><i class="fab fa-github"></i> Repositories</h3>
            //                 <div class="open-source-preview-stats">
            //                     <div class="preview-stat">
            //                         <span class="stat-number">${this.data.open_source.repositories.length}</span>
            //                         <span class="stat-label">Active Repos</span>
            //                     </div>
            //                     <div class="preview-stat">
            //                         <span class="stat-number">${this.data.open_source.repositories.reduce((sum, repo) => sum + repo.stars, 0)}</span>
            //                         <span class="stat-label">Total Stars</span>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div class="open-source-preview-category">
            //                 <h3><i class="fas fa-box"></i> Packages</h3>
            //                 <div class="open-source-preview-stats">
            //                     <div class="preview-stat">
            //                         <span class="stat-number">${this.data.open_source.packages.length}</span>
            //                         <span class="stat-label">Published</span>
            //                     </div>
            //                     <div class="preview-stat">
            //                         <span class="stat-number">${this.data.open_source.packages.reduce((sum, pkg) => sum + parseInt(pkg.downloads.replace('k', '000')), 0).toLocaleString()}</span>
            //                         <span class="stat-label">Downloads</span>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div class="open-source-preview-category">
            //                 <h3><i class="fas fa-handshake"></i> Contributions</h3>
            //                 <div class="open-source-preview-stats">
            //                     <div class="preview-stat">
            //                         <span class="stat-number">${this.data.open_source.contributions.length}</span>
            //                         <span class="stat-label">PRs Merged</span>
            //                     </div>
            //                     <div class="preview-stat">
            //                         <span class="stat-number">${this.data.open_source.contributions.filter(c => c.organization).length}</span>
            //                         <span class="stat-label">Organizations</span>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //         <div class="section-footer">
            //             <a href="#" class="btn btn-outline" data-section="open_source">View All Contributions</a>
            //         </div>
            //     </div>
            // </section>

            // <section id="featured-projects" class="featured-section">
            //     <div class="container">
            //         <h2>Featured Projects</h2>
            //         <div class="projects-grid">
            //             ${this.data.projects.slice(0, 3).map(project => this.renderProjectCard(project)).join('')}
            //         </div>
            //         <div class="section-footer">
            //             <a href="#" class="btn btn-outline" data-section="projects">View All Projects</a>
            //         </div>
            //     </div>
            // </section>

            // <section id="latest-blogs" class="featured-section">
            //     <div class="container">
            //         <h2>Latest Blog Posts</h2>
            //         <div class="blogs-grid">
            //             ${this.data.blogs.slice(0, 3).map(blog => this.renderBlogCard(blog)).join('')}
            //         </div>
            //         <div class="section-footer">
            //             <a href="#" class="btn btn-outline" data-section="blogs">View All Blogs</a>
            //         </div>
            //     </div>
            // </section>
`
            <section id="cta" class="cta-section">
                <div class="container">
                    <div class="cta-content">
                        <h2>Ready to Collaborate?</h2>
                        <p>I'm always interested in new opportunities, research collaborations, and challenging projects in AI and machine learning.</p>
                        <div class="cta-actions">
                            <a href="#" class="btn btn-primary" data-section="contact">
                                <i class="fas fa-envelope"></i> Get In Touch
                            </a>
                            <a href="${this.data.profile.links.resume}" class="btn btn-secondary" download>
                                <i class="fas fa-download"></i> Download Resume
                            </a>
                            <a href="${this.data.profile.links.linkedin}" class="btn btn-outline" target="_blank">
                                <i class="fab fa-linkedin"></i> Connect on LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Add event listeners for the new buttons
        this.addSectionButtonListeners();
    }

    renderProjectsPage() {
        const mainContent = document.getElementById('main-content');
        const projects = this.data.projects;
        
        // Get all unique tags from projects
        const allTags = [...new Set(projects.flatMap(project => project.tags))];
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Projects</h1>
                <p>Explore my research projects and implementations in AI and machine learning.</p>
            </div>
            
            <div class="search-filter-section">
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="Search projects..." />
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="filter-section">
                    <h4>Filter by Category:</h4>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="research">Research</button>
                        <button class="filter-btn" data-filter="development">Development</button>
                        <button class="filter-btn" data-filter="tutorial">Tutorial</button>
                    </div>
                </div>
                
                <div class="tag-filter-section">
                    <h4>Filter by Tags:</h4>
                    <div class="tag-filter-buttons">
                        <button class="tag-filter-btn active" data-tag="all">All Tags</button>
                        ${allTags.map(tag => `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="projects-grid">
                ${projects.map(project => this.renderProjectCard(project)).join('')}
            </div>
        `;
        
        this.setupSearchAndFilter();
    }

    renderPublicationsPage() {
        const mainContent = document.getElementById('main-content');
        const publications = this.data.publications;
        
        // Get all unique tags from publications
        const allTags = [...new Set(publications.flatMap(pub => pub.tags))];
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Publications</h1>
                <p>My research publications in conferences and journals.</p>
            </div>
            
            <div class="search-filter-section">
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="Search publications..." />
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="filter-section">
                    <h4>Filter by Category:</h4>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="conference">Conference</button>
                        <button class="filter-btn" data-filter="journal">Journal</button>
                        <button class="filter-btn" data-filter="workshop">Workshop</button>
                    </div>
                </div>
                
                <div class="tag-filter-section">
                    <h4>Filter by Tags:</h4>
                    <div class="tag-filter-buttons">
                        <button class="tag-filter-btn active" data-tag="all">All Tags</button>
                        ${allTags.map(tag => `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="publications-grid">
                ${publications.map(pub => this.renderPublicationCard(pub)).join('')}
            </div>
        `;
        
        this.setupSearchAndFilter();
    }

    renderResearchPage() {
        const mainContent = document.getElementById('main-content');
        const researchAreas = this.data.skills.research_areas;
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Research Areas</h1>
                <p>My current research areas and expertise domains.</p>
            </div>
            
            <div class="research-grid">
                ${researchAreas.map(area => this.renderResearchSkillCard(area)).join('')}
            </div>
        `;
    }

    renderSkillsPage() {
        const mainContent = document.getElementById('main-content');
        const skills = this.data.skills;
        
        // Calculate skills statistics
        const totalSkills = Object.values(skills.technical).flat().length;
        const expertSkills = Object.values(skills.technical).flat().filter(skill => skill.level === 'Expert').length;
        const advancedSkills = Object.values(skills.technical).flat().filter(skill => skill.level === 'Advanced').length;
        const researchAreas = skills.research_areas.length;
        const certifications = skills.certifications.length;
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Skills & Expertise</h1>
                <p>Comprehensive overview of my technical skills, research expertise, and professional competencies.</p>
            </div>
            
            <!-- Skills Summary Section -->
            <section class="skills-summary-section">
                <div class="container">
                    <h2>Skills Overview</h2>
                    <div class="skills-summary-grid">
                        <div class="summary-card">
                            <div class="summary-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${totalSkills}</h3>
                                <p>Technical Skills</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon expert">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${expertSkills}</h3>
                                <p>Expert Level</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon advanced">
                                <i class="fas fa-rocket"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${advancedSkills}</h3>
                                <p>Advanced Level</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon research">
                                <i class="fas fa-microscope"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${researchAreas}</h3>
                                <p>Research Areas</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon cert">
                                <i class="fas fa-certificate"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${certifications}</h3>
                                <p>Certifications</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Key Expertise Areas -->
                    <div class="key-expertise">
                        <h3>Key Expertise Areas</h3>
                        <div class="expertise-tags">
                            <span class="expertise-tag primary">Python & ML</span>
                            <span class="expertise-tag secondary">AI & NLP</span>
                            <span class="expertise-tag accent">Multimodal AI</span>
                            <span class="expertise-tag success">RAG Systems</span>
                            <span class="expertise-tag warning">Cloud & DevOps</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Technical Skills Section -->
            <section class="skills-section">
                <h2>Technical Skills</h2>
                
                <!-- Programming Languages -->
                <div class="skill-category">
                    <h3><i class="fas fa-code"></i> Programming Languages</h3>
                    <div class="skills-grid">
                        ${skills.technical.programming_languages.map(skill => this.renderSkillCard(skill)).join('')}
                    </div>
                </div>
                
                <!-- Machine Learning -->
                <div class="skill-category">
                    <h3><i class="fas fa-brain"></i> Machine Learning & AI</h3>
                    <div class="skills-grid">
                        ${skills.technical.machine_learning.map(skill => this.renderSkillCard(skill)).join('')}
                    </div>
                </div>
                
                <!-- Frameworks -->
                <div class="skill-category">
                    <h3><i class="fas fa-language"></i> Frameworks & Libraries</h3>
                    <div class="skills-grid">
                        ${skills.technical.frameworks.map(skill => this.renderSkillCard(skill)).join('')}
                    </div>
                </div>
                
                <!-- Libraries -->
                <div class="skill-category">
                    <h3><i class="fas fa-chart-bar"></i> Libraries & Tools</h3>
                    <div class="skills-grid">
                        ${skills.technical.libraries.map(skill => this.renderSkillCard(skill)).join('')}
                    </div>
                </div>
                
                <!-- Tools -->
                <div class="skill-category">
                    <h3><i class="fas fa-database"></i> Development Tools</h3>
                    <div class="skills-grid">
                        ${skills.technical.tools.map(skill => this.renderSkillCard(skill)).join('')}
                    </div>
                </div>
                
                <!-- Distributed Computing -->
                <div class="skill-category">
                    <h3><i class="fas fa-cloud"></i> Distributed Computing</h3>
                    <div class="skills-grid">
                        ${skills.technical.distributed_computing.map(skill => this.renderSkillCard(skill)).join('')}
                    </div>
                </div>
                

            </section>
            
            <!-- Research Areas Section -->
            <section class="skills-section">
                <h2>Research Expertise</h2>
                <div class="research-skills-grid">
                    ${skills.research_areas.map(area => this.renderResearchSkillCard(area)).join('')}
                </div>
            </section>
            
            <!-- Soft Skills Section -->
            <section class="skills-section">
                <h2>Professional Skills</h2>
                <div class="soft-skills-grid">
                    ${skills.soft_skills.map(skill => this.renderSoftSkillCard(skill)).join('')}
                </div>
            </section>
            
            <!-- Certifications Section -->
            <section class="skills-section">
                <h2>Certifications</h2>
                <div class="certifications-grid">
                    ${skills.certifications.map(cert => this.renderCertificationCard(cert)).join('')}
                </div>
            </section>
        `;
    }

    renderOpenSourcePage() {
        const mainContent = document.getElementById('main-content');
        const openSource = this.data.open_source;
        
        // Calculate statistics
        const totalStars = openSource.repositories.reduce((sum, repo) => sum + repo.stars, 0);
        const totalForks = openSource.repositories.reduce((sum, repo) => sum + repo.forks, 0);
        const totalContributions = openSource.contributions.length;
        const totalPackages = openSource.packages.length;
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Open Source Contributions</h1>
                <p>My contributions to the open source community through repositories, packages, and community involvement.</p>
            </div>
            
            <!-- Open Source Summary -->
            <section class="open-source-summary-section">
                <div class="container">
                    <h2>Open Source Impact</h2>
                    <div class="open-source-summary-grid">
                        <div class="summary-card">
                            <div class="summary-icon">
                                <i class="fab fa-github"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${openSource.repositories.length}</h3>
                                <p>Repositories</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon stars">
                                <i class="fas fa-star"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${totalStars}</h3>
                                <p>Total Stars</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon forks">
                                <i class="fas fa-code-branch"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${totalForks}</h3>
                                <p>Total Forks</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon contributions">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${totalContributions}</h3>
                                <p>Contributions</p>
                            </div>
                        </div>
                        <div class="summary-card">
                            <div class="summary-icon packages">
                                <i class="fas fa-box"></i>
                            </div>
                            <div class="summary-content">
                                <h3>${totalPackages}</h3>
                                <p>Packages</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Repositories Section -->
            <section class="open-source-section">
                <h2>Featured Repositories</h2>
                <div class="repositories-grid">
                    ${openSource.repositories.map(repo => this.renderRepositoryCard(repo)).join('')}
                </div>
            </section>
            
            <!-- Packages Section -->
            <section class="open-source-section">
                <h2>Published Packages</h2>
                <div class="packages-grid">
                    ${openSource.packages.map(pkg => this.renderPackageCard(pkg)).join('')}
                </div>
            </section>
            
            <!-- Contributions Section -->
            <section class="open-source-section">
                <h2>Community Contributions</h2>
                <div class="contributions-grid">
                    ${openSource.contributions.map(contribution => this.renderContributionCard(contribution)).join('')}
                </div>
            </section>
            
            <!-- Community Involvement Section -->
            <section class="open-source-section">
                <h2>Community Involvement</h2>
                <div class="community-grid">
                    ${openSource.community.map(community => this.renderCommunityCard(community)).join('')}
                </div>
            </section>
        `;
    }

    renderBlogsPage() {
        const mainContent = document.getElementById('main-content');
        const blogs = this.data.blogs;
        
        // Get all unique tags from blogs
        const allTags = [...new Set(blogs.flatMap(blog => blog.tags))];
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Blog</h1>
                <p>Thoughts, tutorials, and insights on AI research and development.</p>
            </div>
            
            <div class="search-filter-section">
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="Search blog posts..." />
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="filter-section">
                    <h4>Filter by Category:</h4>
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="ai research">AI Research</button>
                        <button class="filter-btn" data-filter="tutorial">Tutorial</button>
                        <button class="filter-btn" data-filter="analysis">Analysis</button>
                    </div>
                </div>
                
                <div class="tag-filter-section">
                    <h4>Filter by Tags:</h4>
                    <div class="tag-filter-buttons">
                        <button class="tag-filter-btn active" data-tag="all">All Tags</button>
                        ${allTags.map(tag => `<button class="tag-filter-btn" data-tag="${tag}">${tag}</button>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="blogs-grid">
                ${blogs.map(blog => this.renderBlogCard(blog)).join('')}
            </div>
        `;
        
        this.setupSearchAndFilter();
    }

    renderExperiencePage() {
        const mainContent = document.getElementById('main-content');
        const experience = this.data.experience;
        
        // Get all unique technologies from experience
        const allTechnologies = [...new Set(experience.flatMap(exp => exp.technologies))];
        
        mainContent.innerHTML = `
            <div class="page-header">
                <h1>Experience</h1>
                <p>Professional experience and research positions.</p>
            </div>
            
            <div class="search-filter-section">
                <div class="search-box">
                    <input type="text" id="search-input" placeholder="Search experience..." />
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="tag-filter-section">
                    <h4>Filter by Technologies:</h4>
                    <div class="tag-filter-buttons">
                        <button class="tag-filter-btn active" data-tag="all">All Technologies</button>
                        ${allTechnologies.map(tech => `<button class="tag-filter-btn" data-tag="${tech}">${tech}</button>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="timeline">
                ${experience.map(exp => this.renderExperienceCard(exp)).join('')}
            </div>
        `;
        
        this.setupSearchAndFilter();
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
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-actions">
                        ${project.github ? `<a href="${project.github}" target="_blank" class="btn btn-small"><i class="fab fa-github"></i> Code</a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" target="_blank" class="btn btn-small"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
                        <button class="btn btn-small" onclick="portfolioApp.showProjectDetails('${project.id}')">Details</button>
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
            <div class="experience-card" data-tags="${exp.technologies.join(' ').toLowerCase()}">
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

    renderSkillCard(skill) {
        const levelClass = skill.level.toLowerCase().replace(' ', '-');
        return `
            <div class="skill-card ${levelClass}">
                <div class="skill-icon" style="color: ${skill.color}">
                    <i class="${skill.icon}"></i>
                </div>
                <div class="skill-content">
                    <h4>${skill.name}</h4>
                    <div class="skill-level">
                        <span class="level-badge ${levelClass}">${skill.level}</span>
                    </div>
                    <p>${skill.description}</p>
                </div>
            </div>
        `;
    }

    renderResearchSkillCard(area) {
        const expertiseClass = area.expertise.toLowerCase().replace(' ', '-');
        return `
            <div class="research-skill-card ${expertiseClass}">
                <div class="skill-icon" style="color: ${area.color}">
                    <i class="${area.icon}"></i>
                </div>
                <div class="skill-content">
                    <h4>${area.name}</h4>
                    <div class="skill-level">
                        <span class="level-badge ${expertiseClass}">${area.expertise}</span>
                    </div>
                    <p>${area.description}</p>
                </div>
            </div>
        `;
    }

    renderSoftSkillCard(skill) {
        return `
            <div class="soft-skill-card">
                <div class="skill-icon" style="color: ${skill.color}">
                    <i class="${skill.icon}"></i>
                </div>
                <div class="skill-content">
                    <h4>${skill.name}</h4>
                    <p>${skill.description}</p>
                </div>
            </div>
        `;
    }

    renderCertificationCard(cert) {
        return `
            <div class="certification-card">
                <div class="cert-icon" style="color: ${cert.color}">
                    <i class="${cert.icon}"></i>
                </div>
                <div class="cert-content">
                    <h4>${cert.name}</h4>
                    <p class="cert-issuer">${cert.issuer}</p>
                    <p class="cert-date">${cert.date}</p>
                </div>
            </div>
        `;
    }

    renderRepositoryCard(repo) {
        return `
            <div class="repository-card">
                <div class="repo-header">
                    <div class="repo-icon">
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="repo-stats">
                        <span class="repo-stat">
                            <i class="fas fa-star"></i>
                            ${repo.stars}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-code-branch"></i>
                            ${repo.forks}
                        </span>
                    </div>
                </div>
                <div class="repo-content">
                    <h4>${repo.name}</h4>
                    <p>${repo.description}</p>
                    <div class="repo-meta">
                        <span class="repo-language">${repo.language}</span>
                        <span class="repo-status ${repo.status.toLowerCase()}">${repo.status}</span>
                    </div>
                    <div class="repo-topics">
                        ${repo.topics.map(topic => `<span class="repo-topic">${topic}</span>`).join('')}
                    </div>
                    <div class="repo-actions">
                        <a href="${repo.url}" target="_blank" class="btn btn-small">
                            <i class="fab fa-github"></i> View Repository
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderPackageCard(pkg) {
        return `
            <div class="package-card">
                <div class="package-header">
                    <div class="package-icon">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="package-stats">
                        <span class="package-stat">
                            <i class="fas fa-download"></i>
                            ${pkg.downloads}
                        </span>
                    </div>
                </div>
                <div class="package-content">
                    <h4>${pkg.name}</h4>
                    <p>${pkg.description}</p>
                    <div class="package-meta">
                        <span class="package-language">${pkg.language}</span>
                        <span class="package-version">v${pkg.version}</span>
                        <span class="package-status ${pkg.status.toLowerCase()}">${pkg.status}</span>
                    </div>
                    <div class="package-actions">
                        <a href="${pkg.url}" target="_blank" class="btn btn-small">
                            <i class="fas fa-external-link-alt"></i> View Package
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderContributionCard(contribution) {
        const typeClass = contribution.type.toLowerCase().replace(' ', '-');
        return `
            <div class="contribution-card ${typeClass}">
                <div class="contribution-header">
                    <div class="contribution-icon">
                        <i class="fab fa-github"></i>
                    </div>
                    <div class="contribution-meta">
                        <span class="contribution-type ${typeClass}">${contribution.type}</span>
                        <span class="contribution-status ${contribution.status.toLowerCase()}">${contribution.status}</span>
                    </div>
                </div>
                <div class="contribution-content">
                    <h4>${contribution.repository}</h4>
                    <p class="contribution-org">${contribution.organization}</p>
                    <p class="contribution-desc">${contribution.description}</p>
                    <div class="contribution-date">${contribution.date}</div>
                    <div class="contribution-actions">
                        <a href="${contribution.url}" target="_blank" class="btn btn-small">
                            <i class="fab fa-github"></i> View PR
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderCommunityCard(community) {
        return `
            <div class="community-card">
                <div class="community-header">
                    <div class="community-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="community-role">
                        <span class="role-badge">${community.role}</span>
                    </div>
                </div>
                <div class="community-content">
                    <h4>${community.name}</h4>
                    <p class="community-platform">${community.platform}</p>
                    <p class="community-desc">${community.description}</p>
                    <div class="community-impact">
                        <strong>Impact:</strong> ${community.impact}
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

    updateTagFilterButtons() {
        document.querySelectorAll('.tag-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tag') === this.currentTag) {
                btn.classList.add('active');
            }
        });
    }

    filterContent() {
        const items = document.querySelectorAll('.project-card, .publication-card, .blog-card, .experience-card');
        
        items.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const tags = item.getAttribute('data-tags') || '';
            const category = item.getAttribute('data-category') || '';
            
            // Text search matching
            const matchesSearch = this.searchQuery === '' || 
                title.includes(this.searchQuery) || 
                tags.includes(this.searchQuery);
            
            // Category filter matching (only for items with categories)
            const matchesFilter = this.currentFilter === 'all' || 
                category.includes(this.currentFilter) ||
                !item.hasAttribute('data-category');
            
            // Tag filter matching
            const matchesTag = this.currentTag === 'all' || 
                tags.includes(this.currentTag.toLowerCase());
            
            // All conditions must be met
            if (matchesSearch && matchesFilter && matchesTag) {
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