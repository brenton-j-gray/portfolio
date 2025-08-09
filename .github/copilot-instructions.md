# Portfolio Website - GitHub Copilot Instructions

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in these instructions is incomplete or found to be in error.**

This is Brenton Gray's personal portfolio website - a static HTML/CSS/JavaScript site that showcases projects, skills, and contact information. The site dynamically fetches GitHub repositories and includes an integrated contact form.

## Working Effectively

### Quick Setup and Validation
- Clone the repository and navigate to the root directory
- Start local development server: `python3 -m http.server 8000`
- Open browser to `http://localhost:8000` to view the site
- **Validation time**: Site loads instantly (static files only)
- **CRITICAL**: Always test functionality after making changes by loading the site in a browser

### No Build Process Required
- This is a **static website** with NO build process, NO package.json, NO npm scripts
- Files are served directly: `index.html`, `styles.css`, `scripts.js`
- Simply edit files and refresh browser to see changes
- **DO NOT** attempt to run `npm install`, `yarn install`, or any build commands
- **DO NOT** look for Makefile, package.json, or build scripts - they don't exist

### Development Workflow
1. Edit HTML, CSS, or JavaScript files directly
2. Start local server: `python3 -m http.server 8000` (takes <2 seconds)
3. Open `http://localhost:8000` in browser to test changes
4. Validate functionality manually (navigation, forms, responsive design)
5. Commit and push changes directly to GitHub

## File Structure and Key Components

### Repository Root
```
.
├── .github/
│   └── copilot-instructions.md
├── fonts/
│   └── PressStart2P-Regular.ttf
├── BrentonGray_Resume.pdf
├── index.html
├── scripts.js
├── styles.css
└── README.md
```

### Core Files
- **`index.html`**: Single-page portfolio with sections for projects, skills, about, CV, and contact
- **`styles.css`**: Custom CSS with CSS variables, responsive design, animations, and mobile-first approach
- **`scripts.js`**: JavaScript for GitHub API integration, smooth scrolling, contact form validation, and character counting
- **`BrentonGray_Resume.pdf`**: Downloadable CV/resume file
- **`fonts/PressStart2P-Regular.ttf`**: Custom pixel font used in headers

## Testing and Validation

### Manual Validation Requirements
**ALWAYS perform these validation steps after making changes:**

1. **Start local server**: `python3 -m http.server 8000`
2. **Load homepage**: Navigate to `http://localhost:8000`
3. **Test navigation**: Click each nav link (Projects, Skills, Interests, About, CV/Resume, Contact) - should smooth scroll to sections
4. **Verify responsiveness**: Resize browser window to test mobile/tablet/desktop layouts
5. **Test contact form**:
   - Fill in name: "Test User"
   - Fill in email: "test@example.com"
   - Fill in message: "Test message for validation"
   - Verify character counter updates as you type
   - Verify form validation (try invalid email, empty fields)
6. **Test CV download**: Click "📄 Download CV (PDF)" button - should download PDF
7. **Check GitHub integration**: Projects section should be populated (may be empty if API blocked)

### JavaScript Syntax Validation
- Validate JavaScript syntax: `node -c scripts.js`
- Should output: "JavaScript syntax is valid" or no output (both indicate success)

### Common Validation Issues
- **GitHub API blocked**: Projects section will be empty if GitHub API calls are blocked
- **Form submission**: Contact form uses Formspree - actual submission won't work in development
- **CORS issues**: May occur when testing locally, but site works normally when deployed

## Key Technologies and Integrations

### External Dependencies
- **GitHub API**: Fetches repositories from `https://api.github.com/users/gray-skull/repos`
- **Formspree**: Contact form submissions via `https://formspree.io/f/mvgpnlrg`
- **Custom font**: Local TTF font file for pixel-style headers

### CSS Features
- **CSS Custom Properties**: Color scheme defined in `:root` variables
- **Responsive Grid**: Different layouts for mobile, tablet, desktop
- **Animations**: Gradient background animation, section flash effects, hover transitions
- **Mobile-first**: Responsive design with mobile breakpoint at 700px

### JavaScript Features
- **Async/Await**: Modern JavaScript for API calls
- **Event Listeners**: Form validation, navigation, character counting
- **DOM Manipulation**: Dynamic project list population
- **Smooth Scrolling**: Custom navigation behavior with visual feedback

## Deployment

### GitHub Pages Hosting
- Site is deployed automatically via GitHub Pages
- **NO GitHub Actions required** - static files are served directly
- Push to main branch triggers automatic deployment
- Live site URL: Based on repository structure, likely hosted at GitHub Pages

### Deployment Validation
- After pushing changes, wait 2-5 minutes for GitHub Pages deployment
- Check live site to ensure changes are reflected
- **DO NOT** set up custom GitHub Actions or build workflows

## Common Development Tasks

### Updating Content
- **Skills section**: Edit the `<ul>` lists in `index.html` skills section
- **About section**: Modify paragraphs in the about section
- **Contact information**: Update meta tags and header information

### Styling Changes
- **Colors**: Modify CSS custom properties in `:root` selector
- **Layout**: Adjust grid templates and responsive breakpoints
- **Animations**: Modify keyframe animations and transitions

### JavaScript Modifications
- **GitHub username**: Change `gray-skull` in `fetchGitHubRepos()` function
- **Form validation**: Modify validation rules in contact form event listener
- **Navigation**: Adjust smooth scrolling behavior

### Adding New Sections
1. Add HTML section with class "fancy-border"
2. Add navigation link in the `<nav>` element
3. Update CSS grid for navigation if needed
4. Test responsive behavior on mobile

## Troubleshooting

### Site Not Loading
- Ensure you're in the correct directory: `/path/to/portfolio`
- Start server: `python3 -m http.server 8000`
- Check browser console for JavaScript errors

### GitHub Projects Not Loading
- **Expected behavior**: API may be blocked in some environments
- Check browser console for network errors
- Site functions normally without GitHub data

### Form Not Working
- Contact form requires internet connection to Formspree
- Validation works offline, submission requires online access

### Responsive Issues
- Test at mobile breakpoint: 700px width
- Check CSS grid definitions for different screen sizes
- Verify viewport meta tag is present

## Performance Considerations

- **Load time**: Instantaneous (static files only)
- **No optimization needed**: Files are already minimal and optimized
- **Font loading**: Custom font may cause brief flash, this is normal
- **API calls**: GitHub API calls are async and won't block page load

## Security and Best Practices

- **No server-side code**: Purely client-side application
- **External dependencies**: Only GitHub API and Formspree
- **No sensitive data**: All code is public and client-side
- **Form validation**: Client-side only, server validation handled by Formspree

## Common Pitfalls to Avoid

- **DO NOT** try to install npm packages or run build commands
- **DO NOT** add complex build tooling - keep it simple
- **DO NOT** modify the font file path without updating CSS
- **DO NOT** change Formspree endpoint without coordinating with site owner
- **ALWAYS** test changes in browser before committing
- **ALWAYS** verify responsive design works on mobile

## Quick Reference - Common File Contents

### Repository Root Directory Structure
```
ls -la /portfolio
total 184
drwxr-xr-x 5 runner docker   4096 Aug  9 19:59 .
drwxr-xr-x 3 runner docker   4096 Aug  9 19:54 ..
drwxr-xr-x 7 runner docker   4096 Aug  9 19:59 .git
drwxr-xr-x 2 runner docker   4096 Aug  9 20:00 .github
-rw-r--r-- 1 runner docker 136079 Aug  9 19:55 BrentonGray_Resume.pdf
-rw-r--r-- 1 runner docker   2010 Aug  9 19:55 README.md
drwxr-xr-x 2 runner docker   4096 Aug  9 19:55 fonts
-rw-r--r-- 1 runner docker   6188 Aug  9 19:55 index.html
-rw-r--r-- 1 runner docker   5511 Aug  9 19:55 scripts.js
-rw-r--r-- 1 runner docker   6430 Aug  9 19:55 styles.css
```

### Key Configuration Constants (from scripts.js)
```javascript
// GitHub API endpoint for fetching repositories
const response = await fetch(`https://api.github.com/users/gray-skull/repos`);

// Formspree contact form endpoint
action="https://formspree.io/f/mvgpnlrg"

// Character limit for contact message
const maxChars = 500;
```

### CSS Custom Properties (from styles.css)
```css
:root {
    --primary-color: #457781;
    --secondary-color: #984444;
    --tertiary-color: #637d82;
    --bright-color: #c3c3c3aa;
    --dark-color: #1b1b1b;
    --pixel-font: 'Press Start 2P', 'Lora', sans-serif;
    --shadow: 4px 4px 8px var(--dark-color);
}
```

### Mobile Breakpoint
```css
@media (max-width: 700px) {
    /* Mobile styles applied here */
}
```

Remember: This is intentionally a simple, static website. Preserve this simplicity and avoid adding unnecessary complexity.