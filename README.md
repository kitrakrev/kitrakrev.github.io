# Karthik Raja Anandan - AI Researcher Portfolio

A modern, responsive portfolio website showcasing research in AI, Machine Learning, and related technologies. Built with vanilla HTML, CSS, and JavaScript with a focus on accessibility, performance, and user experience.

## 🌟 Features

### Core Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Dynamic Content**: JSON-based content management for easy updates
- **Search & Filter**: Advanced search and filtering capabilities across all sections
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Sections
- **Home**: Hero section with research highlights and featured content
- **Projects**: Research projects with detailed descriptions and links
- **Publications**: Academic papers and research publications
- **Research**: Current research areas and ongoing work
- **Blogs**: Technical articles and insights
- **Experience**: Professional experience and achievements
- **Contact**: Contact form and social links

### Technical Features
- **Modern CSS**: CSS Grid, Flexbox, and CSS Variables
- **Smooth Animations**: CSS transitions and micro-interactions
- **Performance Optimized**: Lazy loading, efficient rendering
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Quick Start

### Prerequisites
- A modern web browser
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kitrakrev/kitrakrev.github.io.git
   cd kitrakrev.github.io
   ```

2. Open `index.html` in your browser or serve it using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000` in your browser

## 📁 Project Structure

```
kitrakrev.github.io/
├── index.html                 # Main HTML file
├── content/
│   ├── data.json             # Portfolio data (projects, publications, etc.)
│   └── app.js                # Main JavaScript application
├── styles/
│   └── styles.css            # Main stylesheet with themes
├── assets/
│   ├── profile.jpg           # Profile image
│   └── resume.pdf            # Resume/CV
├── latest/
│   ├── blog-posts/           # Individual blog post HTML files
│   │   ├── multimodal-rag.html
│   │   ├── mechanistic-interpretability.html
│   │   └── multi-agent-systems.html
│   └── ...                   # Legacy files
└── README.md                 # This file
```

## 📝 Content Management

### Adding New Projects
Edit `content/data.json` and add a new project object:

```json
{
  "id": "project-6",
  "title": "New Research Project",
  "description": "Brief description of the project",
  "longDescription": "Detailed description of the project...",
  "image": "https://via.placeholder.com/400x250/4a90e2/ffffff?text=New+Project",
  "tags": ["AI", "Research", "Python"],
  "category": "Research",
  "github": "https://github.com/username/project",
  "demo": "https://demo.example.com",
  "date": "2024-02"
}
```

### Adding New Publications
Add a new publication object to the `publications` array:

```json
{
  "id": "pub-3",
  "title": "New Research Paper",
  "authors": "Karthik Raja Anandan, et al.",
  "venue": "Conference Name",
  "year": "2024",
  "abstract": "Abstract of the paper...",
  "pdf": "https://arxiv.org/abs/example",
  "code": "https://github.com/username/code",
  "tags": ["AI", "Research"],
  "category": "Conference"
}
```

### Adding New Blog Posts
1. Create a new HTML file in `latest/blog-posts/`
2. Add the blog entry to `content/data.json`:

```json
{
  "id": "blog-4",
  "title": "New Blog Post",
  "excerpt": "Brief excerpt...",
  "content": "blog-posts/new-blog-post.html",
  "image": "https://via.placeholder.com/400x250/4a90e2/ffffff?text=Blog+Post",
  "tags": ["AI", "Tutorial"],
  "category": "AI Research",
  "date": "2024-02-01",
  "readTime": "5 min read"
}
```

## 🎨 Customization

### Changing Colors
Modify CSS variables in `styles/styles.css`:

```css
:root {
    --primary-color: #4a90e2;    /* Main brand color */
    --secondary-color: #50c878;  /* Secondary color */
    --accent-color: #ff6b35;     /* Accent color */
    /* ... other variables */
}
```

### Adding New Sections
1. Add the section to the navigation in `index.html`
2. Create the section rendering function in `content/app.js`
3. Add corresponding styles in `styles/styles.css`

### Modifying Layout
The layout uses CSS Grid and Flexbox. Main layout classes:
- `.container`: Main content wrapper
- `.grid`: Grid layout container
- `.flex`: Flexbox layout container

## 🔧 Configuration

### Theme Settings
The website supports automatic theme detection based on system preferences. Users can manually toggle between light and dark themes. Theme preference is stored in localStorage.

### Search Configuration
Search functionality works across:
- Project titles and descriptions
- Publication titles and abstracts
- Blog titles and content
- Tags and categories

### Filter Options
Available filters:
- **Projects**: All, Research, Implementation, Multimodal, RAG
- **Publications**: All, Conference, Journal, Workshop
- **Blogs**: All, Tutorial, Analysis, Research

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

### Mobile Features
- Collapsible navigation menu
- Touch-friendly buttons and interactions
- Optimized typography and spacing
- Swipe gestures for navigation

## 🚀 Performance Optimization

### Loading Optimization
- Lazy loading for images
- Efficient CSS and JavaScript loading
- Minimal external dependencies
- Optimized asset sizes

### SEO Optimization
- Semantic HTML structure
- Proper meta tags
- Open Graph tags for social sharing
- Structured data markup

## 🔒 Security

### Best Practices
- No external JavaScript libraries (except Font Awesome)
- Content Security Policy ready
- XSS protection through proper HTML escaping
- Secure external links with `rel="noopener noreferrer"`

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

- **Email**: karthik.raja@ucsc.edu
- **LinkedIn**: [Karthik Raja Anandan](https://www.linkedin.com/in/kitrakrev)
- **GitHub**: [kitrakrev](https://github.com/kitrakrev)
- **Website**: [kitrakrev.github.io](https://kitrakrev.github.io)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Placeholder.com for demo images
- The AI research community for inspiration

---

**Built with ❤️ for AI Research**

*Last updated: February 2024*
