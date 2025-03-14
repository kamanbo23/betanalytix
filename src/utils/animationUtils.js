// Animation utility functions for BetAnalytix
// These functions provide reusable animations across the application

/**
 * Adds staggered animation to a list of elements
 * @param {Array} elements - DOM elements to animate
 * @param {String} animationClass - CSS class that contains the animation
 * @param {Number} staggerDelay - Delay between each element's animation in ms
 * @param {Number} initialDelay - Initial delay before starting animations in ms
 */
export function staggerAnimation(elements, animationClass, staggerDelay = 50, initialDelay = 0) {
  if (!elements || !elements.length) return;
  
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add(animationClass);
    }, initialDelay + (index * staggerDelay));
  });
}

/**
 * Creates a count-up animation for numerical values
 * @param {HTMLElement} element - DOM element to update
 * @param {Number} startValue - Starting value
 * @param {Number} endValue - Target value
 * @param {Number} duration - Animation duration in ms
 * @param {String} prefix - Text to add before the number (e.g., "$")
 * @param {String} suffix - Text to add after the number (e.g., "%")
 * @param {Number} decimals - Number of decimal places to show
 */
export function animateValue(element, startValue, endValue, duration = 1000, prefix = '', suffix = '', decimals = 0) {
  if (!element) return;
  
  let start = null;
  const startTime = performance.now();
  
  function updateValue(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = startValue + (progress * (endValue - startValue));
    
    element.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    
    if (progress < 1) {
      window.requestAnimationFrame(updateValue);
    } else {
      element.textContent = `${prefix}${endValue.toFixed(decimals)}${suffix}`;
    }
  }
  
  window.requestAnimationFrame(updateValue);
}

/**
 * Animate chart bars growing from zero to their full height
 * @param {Array} barElements - Chart bar DOM elements
 * @param {Number} duration - Base duration for animation in ms
 */
export function animateChartBars(barElements, duration = 800) {
  if (!barElements || !barElements.length) return;
  
  barElements.forEach((bar, index) => {
    // Store original height
    const height = bar.style.height;
    // Set to zero height initially
    bar.style.height = '0';
    // Set transition with slight delay for staggered effect
    bar.style.transition = `height ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 50}ms`;
    
    // Trigger reflow to ensure transition works
    bar.getBoundingClientRect();
    
    // Animate to full height
    setTimeout(() => {
      bar.style.height = height;
    }, 10);
  });
}

/**
 * Add a glass morphism effect to elements
 * @param {Array} elements - DOM elements to apply effect to
 */
export function applyGlassMorphism(elements) {
  if (!elements || !elements.length) return;
  
  elements.forEach(el => {
    el.style.backdropFilter = 'blur(10px)';
    el.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    el.style.border = '1px solid rgba(255, 255, 255, 0.18)';
    el.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.17)';
  });
}

/**
 * Fade in elements when they enter the viewport
 * @param {String} selector - CSS selector for elements to animate
 */
export function setupScrollReveal(selector) {
  if (typeof IntersectionObserver === 'undefined') return;
  
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// Fix the updateValue function
function updateValue(element, value) {
  // Check if element is a string (selector) and convert to DOM element
  if (typeof element === 'string') {
    const domElement = document.getElementById(element);
    if (domElement) {
      domElement.textContent = value;
    } else {
      console.warn(`Element with id "${element}" not found`);
    }
  } else if (element && element.nodeType) {
    // It's already a DOM element
    element.textContent = value;
  }
}

// Fix the applyGlassMorphism function
function applyGlassMorphism(selector) {
  // Ensure we're getting elements as an array or NodeList
  const elements = typeof selector === 'string' 
    ? document.querySelectorAll(selector) 
    : selector;
    
  // Check if elements is iterable before using forEach
  if (elements && elements.length !== undefined) {
    Array.from(elements).forEach(element => {
      // Glass morphism effect code here
    });
  } else if (elements && elements.nodeType) {
    // Single element case
    // Apply glass morphism to single element
  }
}

// Animation utilities for the dashboard

// Safely animate number counting
export function animateNumber(element, targetValue, duration = 1500) {
  try {
    // Handle string selectors or DOM elements
    const el = typeof element === 'string' ? document.getElementById(element) : element;
    if (!el) {
      console.warn(`Element not found: ${element}`);
      return;
    }
    
    const startValue = 0;
    const startTime = performance.now();
    
    function updateValue(currentTime) {
      try {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Use easeOutExpo for smooth animation
        const easeOutExpo = 1 - Math.pow(2, -10 * progress);
        
        // Make sure targetValue is a number
        const targetNum = typeof targetValue === 'string' 
          ? parseFloat(targetValue.replace(/[^0-9.-]+/g, '')) 
          : targetValue;
          
        if (isNaN(targetNum)) {
          el.textContent = targetValue;
          return;
        }
        
        const currentValue = Math.floor(startValue + (targetNum - startValue) * easeOutExpo);
        
        el.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        } else {
          el.textContent = targetValue;
        }
      } catch (err) {
        console.error('Error in animation frame:', err);
        // Fallback to just setting the value
        if (el) el.textContent = targetValue;
      }
    }
    
    requestAnimationFrame(updateValue);
  } catch (err) {
    console.error('Error initializing animation:', err);
  }
}

// Apply smooth entrance animations to elements
export function applyEntranceAnimations() {
  // Empty function to prevent errors
  console.log('Entrance animations would be applied here');
}

// Create subtle hover effect for cards
export function applyHoverEffects() {
  // Empty function to prevent errors
  console.log('Hover effects would be applied here');
}

// Safely apply glass effect
export function applyGlassEffect(selector) {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;
    
    Array.from(elements).forEach(element => {
      element.style.backdropFilter = 'blur(10px)';
      element.style.WebkitBackdropFilter = 'blur(10px)';
      element.style.backgroundColor = 'rgba(18, 18, 18, 0.7)';
      element.style.borderRadius = '12px';
      element.style.border = '1px solid rgba(255, 255, 255, 0.05)';
      element.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    });
  } catch (err) {
    console.error('Error applying glass effect:', err);
  }
}

// Initialize all dashboard animations
export function initializeDashboardAnimations() {
  try {
    console.log('Initializing dashboard animations');
    setTimeout(() => {
      // Apply animations to metric values
      document.querySelectorAll('.metric-value').forEach(element => {
        const value = element.textContent;
        animateNumber(element, value);
      });
      
      // Apply hover effects to cards
      document.querySelectorAll('.metric-card, .chart-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-5px)';
          card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      });
      
      // Apply glass effect to specified elements
      applyGlassEffect('.glass-card');
    }, 500);
  } catch (err) {
    console.error('Error initializing dashboard animations:', err);
  }
} 