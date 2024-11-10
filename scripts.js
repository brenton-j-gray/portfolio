// Function to fetch repository data from GitHub
// DOMContentLoaded event ensures the script runs after the HTML has been parsed
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubRepos();
});

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

// function to move the screen after a nav link is clicked
// also adds a flash effect to the target section
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

