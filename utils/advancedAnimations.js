/**
 * Advanced Animation Utilities for BetAnalytix
 * Professional, subtle animations that enhance UX without sacrificing readability
 */

// Apply main ethereal effects to the UI
export function applyEtherealEffects() {
  console.log('Applying subtle ethereal effects');
  
  // Apply to all cards
  document.querySelectorAll('.card, .bet-card, .metric-card, .chart-card, .insight-card').forEach(card => {
    // Subtle hover animation
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
      card.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      card.style.transition = 'all 0.3s ease';
    });
  });
  
  // Apply shimmer effect to buttons
  document.querySelectorAll('.button-primary, .gradient-button').forEach(button => {
    button.classList.add('shimmer-effect');
  });
  
  // Add subtle animation to results when they change
  observeResultChanges();
}

// Create subtle particle effect
export function createParticleEffect(target, options = {}) {
  const defaults = {
    particleCount: 5, // Reduced count
    colors: ['rgba(156, 84, 213, 0.1)', 'rgba(0, 168, 255, 0.1)'], // More transparent
    minSize: 1,
    maxSize: 3, // Smaller particles
    speed: 0.2, // Slower movement
    turbulence: 0.2 // Less turbulence
  };
  
  const settings = { ...defaults, ...options };
  
  // Convert target to element if it's a selector
  const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetEl) return;
  
  // Don't create particles if element is too small (prevents overcrowding)
  if (targetEl.offsetWidth < 100 || targetEl.offsetHeight < 100) return;
  
  // Create particle container
  const particleContainer = document.createElement('div');
  particleContainer.className = 'particle-container';
  particleContainer.style.position = 'absolute';
  particleContainer.style.top = '0';
  particleContainer.style.left = '0';
  particleContainer.style.width = '100%';
  particleContainer.style.height = '100%';
  particleContainer.style.overflow = 'hidden';
  particleContainer.style.pointerEvents = 'none';
  particleContainer.style.zIndex = '1';
  
  // Set container position if target is relative
  if (window.getComputedStyle(targetEl).position === 'static') {
    targetEl.style.position = 'relative';
  }
  
  // Create particles
  for (let i = 0; i < settings.particleCount; i++) {
    createParticle(particleContainer, settings);
  }
  
  targetEl.appendChild(particleContainer);
}

// Helper to create a single particle
function createParticle(container, settings) {
  const particle = document.createElement('div');
  particle.className = 'ethereal-particle';
  
  // Random size
  const size = settings.minSize + Math.random() * (settings.maxSize - settings.minSize);
  
  // Style particle
  particle.style.position = 'absolute';
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.borderRadius = '50%';
  particle.style.background = settings.colors[Math.floor(Math.random() * settings.colors.length)];
  particle.style.opacity = '0';
  
  // Set initial position
  particle.style.top = `${Math.random() * 100}%`;
  particle.style.left = `${Math.random() * 100}%`;
  
  // Add to container
  container.appendChild(particle);
  
  // Animate particle
  setTimeout(() => {
    particle.style.transition = `opacity 1s ease, transform ${20 + Math.random() * 40}s ease`;
    particle.style.opacity = String(0.3 + Math.random() * 0.5); // More subtle opacity
    
    // Start floating animation
    animateParticle(particle, settings);
  }, Math.random() * 1000);
}

// Animate a particle
function animateParticle(particle, settings) {
  const speed = settings.speed || 0.2;
  const turbulence = settings.turbulence || 0.2;
  
  function moveParticle() {
    // Current position
    const currentTop = parseFloat(particle.style.top);
    const currentLeft = parseFloat(particle.style.left);
    
    // Random movement
    const newTop = currentTop + (Math.random() - 0.5) * turbulence;
    const newLeft = currentLeft + (Math.random() - 0.5) * turbulence;
    
    // Keep within bounds
    particle.style.top = `${Math.max(0, Math.min(100, newTop))}%`;
    particle.style.left = `${Math.max(0, Math.min(100, newLeft))}%`;
    
    // Slow transition
    particle.style.transition = `top ${speed * 5}s ease, left ${speed * 5}s ease`;
    
    // Continue animation
    setTimeout(moveParticle, 5000);
  }
  
  moveParticle();
}

// Create subtle ripple effect
export function createRippleEffect(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.addEventListener('click', function(e) {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const ripple = document.createElement('span');
      ripple.className = 'subtle-ripple';
      ripple.style.position = 'absolute';
      ripple.style.width = '10px';
      ripple.style.height = '10px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // More subtle color
      ripple.style.top = y + 'px';
      ripple.style.left = x + 'px';
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = 'all 0.5s ease'; // Faster animation
      
      element.appendChild(ripple);
      
      setTimeout(() => {
        ripple.style.transform = 'scale(10)';
        ripple.style.opacity = '0';
        
        setTimeout(() => {
          ripple.remove();
        }, 500);
      }, 10);
    });
  });
}

// Create subtle 3D card effect
export function create3DCardEffect(selector) {
  const cards = document.querySelectorAll(selector);
  
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      
      // Get mouse position relative to card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position (keep subtle)
      const tiltX = ((y / rect.height) - 0.5) * 5; // Reduced tilt amount
      const tiltY = ((x / rect.width) - 0.5) * -5;
      
      // Apply transformation
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });
    
    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });
    
    // Remove transition on mouse enter for smooth movement
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// Subtle magnetic button effect
export function createMagneticEffect(selector) {
  const buttons = document.querySelectorAll(selector);
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', e => {
      const rect = button.getBoundingClientRect();
      
      // Get mouse position relative to button
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate distance from center (normalized)
      const distanceX = (x - centerX) / centerX;
      const distanceY = (y - centerY) / centerY;
      
      // Apply subtle magnetic pull
      const pull = 3; // Reduced pull amount
      button.style.transform = `translate(${distanceX * pull}px, ${distanceY * pull}px)`;
    });
    
    // Reset on mouse leave
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0, 0)';
      button.style.transition = 'transform 0.3s ease';
    });
    
    // Remove transition on mouse enter for smooth movement
    button.addEventListener('mouseenter', () => {
      button.style.transition = 'transform 0.1s ease';
    });
  });
}

// Create subtle cosmic dust effect
export function createCosmicDustEffect(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    // Only add to large enough elements
    if (element.offsetWidth < 200 || element.offsetHeight < 100) return;
    
    // Add subtle dust
    for (let i = 0; i < 3; i++) { // Reduced count
      const dust = document.createElement('div');
      dust.className = 'cosmic-dust';
      dust.style.position = 'absolute';
      dust.style.borderRadius = '50%';
      dust.style.background = 'rgba(255, 255, 255, 0.05)'; // More transparent
      dust.style.pointerEvents = 'none';
      
      // Random size (smaller)
      const size = 2 + Math.random() * 5;
      dust.style.width = `${size}px`;
      dust.style.height = `${size}px`;
      
      // Random position
      dust.style.top = `${Math.random() * 100}%`;
      dust.style.left = `${Math.random() * 100}%`;
      
      // Add to element
      if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      
      element.appendChild(dust);
      
      // Animate dust
      setTimeout(() => {
        dust.style.transition = `top ${30 + Math.random() * 30}s linear, left ${30 + Math.random() * 30}s linear`;
        animateDust(dust);
      }, Math.random() * 1000);
    }
  });
}

// Animate cosmic dust
function animateDust(dust) {
  function moveDust() {
    // Random position
    dust.style.top = `${Math.random() * 100}%`;
    dust.style.left = `${Math.random() * 100}%`;
    
    // Continue animation
    setTimeout(moveDust, 30000);
  }
  
  moveDust();
}

// Create subtle parallax effect
export function createParallaxEffect(selector, intensity = 0.1) {
  const elements = document.querySelectorAll(selector);
  
  window.addEventListener('mousemove', e => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate mouse position as percentage
    const mouseXPercent = (x / windowWidth) - 0.5;
    const mouseYPercent = (y / windowHeight) - 0.5;
    
    // Apply subtle movement to elements
    elements.forEach(element => {
      const moveX = mouseXPercent * intensity * 20; // Reduced movement
      const moveY = mouseYPercent * intensity * 20;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
      element.style.transition = 'transform 0.3s ease-out';
    });
  });
}

// Create subtle flowing gradient effect
export function createFlowingGradient(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    // Don't apply to elements that already have background
    if (window.getComputedStyle(element).background !== 'none' && 
        !window.getComputedStyle(element).background.includes('none') &&
        !element.classList.contains('gradient-text') &&
        !element.classList.contains('main-gradient-text')) {
      return;
    }
    
    // Create gradient background
    element.style.background = 'linear-gradient(90deg, #9c54d5, #00a8ff, #9c54d5)';
    element.style.backgroundSize = '200% 100%';
    element.style.animation = 'subtleGradientFlow 8s ease infinite';
    
    // If it's a text element, make it background clip
    if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || 
        element.tagName === 'H4' || element.tagName === 'H5' || element.tagName === 'H6' ||
        element.tagName === 'SPAN' || element.classList.contains('gradient-text') ||
        element.classList.contains('main-gradient-text')) {
      element.style.webkitBackgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.backgroundClip = 'text';
      element.style.textFillColor = 'transparent';
    }
  });
  
  // Add animation if it doesn't exist
  if (!document.getElementById('subtle-gradient-flow')) {
    const style = document.createElement('style');
    style.id = 'subtle-gradient-flow';
    style.textContent = `
      @keyframes subtleGradientFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Observer for result changes to add subtle animation
function observeResultChanges() {
  // Create a MutationObserver to watch for changes in result values
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        const target = mutation.target.closest('.result-value, .metric-value, .stat-value');
        if (target) {
          // Apply subtle highlight animation
          target.classList.add('result-updated');
          
          // Remove the class after animation completes
          setTimeout(() => {
            target.classList.remove('result-updated');
          }, 1500);
        }
      }
    });
  });
  
  // Observe all result containers
  document.querySelectorAll('.result-value, .metric-value, .stat-value').forEach(element => {
    observer.observe(element, { 
      childList: true, 
      characterData: true, 
      subtree: true 
    });
  });
  
  // Add animation styles if not already present
  if (!document.getElementById('result-update-animation')) {
    const style = document.createElement('style');
    style.id = 'result-update-animation';
    style.textContent = `
      @keyframes resultHighlight {
        0% { text-shadow: 0 0 0px transparent; }
        50% { text-shadow: 0 0 8px rgba(156, 84, 213, 0.6); }
        100% { text-shadow: 0 0 0px transparent; }
      }
      
      .result-updated {
        animation: resultHighlight 1.5s ease;
      }
    `;
    document.head.appendChild(style);
  }
}

// Apply a subtle glass morphism effect to elements
export function applyGlassMorphism(selector) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.style.backgroundColor = 'rgba(30, 38, 64, 0.7)';
    element.style.backdropFilter = 'blur(5px)'; // Reduced blur
    element.style.WebkitBackdropFilter = 'blur(5px)';
    element.style.border = '1px solid rgba(255, 255, 255, 0.05)';
  });
} 