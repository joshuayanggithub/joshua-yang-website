// Fetch last commit date from GitHub
function fetchLastCommitDate() {
  const dateSpan = document.getElementById('last-commit-date');
  if (!dateSpan) return;
  
  fetch('https://api.github.com/repos/joshuayanggithub/joshua-yang-website/commits?per_page=1')
    .then(response => response.json())
    .then(data => {
      if (data && data[0] && data[0].commit) {
        const date = new Date(data[0].commit.committer.date);
        const formatted = date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        dateSpan.textContent = formatted;
      }
    })
    .catch(() => {
      dateSpan.textContent = 'Dec 2025';
    });
}

// Load map widget
function loadMapWidget() {
  const container = document.getElementById('map-container');
  if (!container) return;
  
  // Check if script already exists
  if (container.querySelector('#mapmyvisitors')) return;
  
  // Load widget with compact size 150px
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'mapmyvisitors';
  script.src = 'https://mapmyvisitors.com/map.js?cl=808080&w=150&t=m&d=KMxR9NVcW71vGpV3wmMFn8pC6w7uC5iVTjCmW408ejE&co=f0f0f0&cmo=3acc3a&cmn=ff5353&ct=808080';
  
  container.appendChild(script);
}

// Email Scramble Effect
function initEmailScramble() {
  const emailSpan = document.querySelector('.email-text');
  if (!emailSpan) return;
  
  const realEmail = emailSpan.dataset.email;
  let currentScrambled = '';
  
  // Shuffle letters (permutation) keeping @ and . in place
  function permute(text) {
    const chars = text.split('');
    const letters = chars.filter(c => c !== '@' && c !== '.');
    
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    // Reconstruct with @ and . in original positions
    let letterIndex = 0;
    return chars.map(c => {
      if (c === '@' || c === '.') return c;
      return letters[letterIndex++];
    }).join('');
  }
  
  // Set scrambled state once on load
  currentScrambled = permute(realEmail);
  emailSpan.textContent = currentScrambled;
  
  // Reveal on hover with animation
  const emailLink = emailSpan.closest('.email-link');
  
  emailLink.addEventListener('mouseenter', () => {
    let iterations = 0;
    const decodeInterval = setInterval(() => {
      emailSpan.textContent = realEmail.split('').map((char, index) => {
        if (index < iterations) return char;
        return currentScrambled[index];
      }).join('');
      
      iterations += 1;
      if (iterations > realEmail.length) {
        clearInterval(decodeInterval);
      }
    }, 25);
  });
  
  emailLink.addEventListener('mouseleave', () => {
    currentScrambled = permute(realEmail);
    emailSpan.textContent = currentScrambled;
  });
}

// Mouse Trailer Light Effect
// This creates a light that follows the cursor around the page

window.addEventListener("load", function() {
  // Fetch last commit date
  fetchLastCommitDate();
  
  // Load map widget
  loadMapWidget();
  
  // Initialize email scramble
  initEmailScramble();
  
  const mouseTrailer = document.querySelector("#mouse-trailer");

  if (mouseTrailer) {
    // Track mouse movement and animate the light trailer
    window.addEventListener("pointermove", function(event) {
      const x = event.clientX;
      const y = event.clientY;

      // Animate the mouse trailer to follow cursor with smooth delay
      mouseTrailer.animate(
        {
          left: `${x}px`,
          top: `${y}px`,
        },
        { 
          duration: 1400, 
          fill: "forwards" 
        }
      );
    });
  }

  // Optional: Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Only prevent default for internal hash links
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});
