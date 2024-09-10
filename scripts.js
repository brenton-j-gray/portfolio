
// Function to fetch repository data from GitHub
async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/gray-skull/repos`);
        const repos = await response.json();

        // Get the list element where we will display the projects
        const projectList = document.getElementById('github-projects');

        // filter out forked repos
        const myRepos = repos.filter(repo => !repo.fork);

        myRepos.forEach(repo => {
            // Create a list item for each repository
            const listItem = document.createElement('li');

            // Add a link to the repository
            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.textContent = repo.name;

            // Add the repository description
            const description = document.createElement('p');
            description.textContent = repo.description;

            // Append the link and description to the list item
            listItem.appendChild(repoLink);
            listItem.appendChild(description);

            // Append the list item to the project list
            projectList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
    }
}



document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        targetSection.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            targetSection.classList.add('flash');
        }, 500);

        setTimeout(() => {
            targetSection.classList.remove('flash');
        }, 1500);
    });
});

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
