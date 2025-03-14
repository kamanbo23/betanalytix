/**
 * Professional UI Initializer
 * Ensures clarity and readability while maintaining visual appeal
 */

// Import helper functions - handle potential missing imports
let applyEtherealEffects, createParticleEffect, createRippleEffect, applyGlassMorphism;

try {
  const utils = require('./utils/advancedAnimations');
  applyEtherealEffects = utils.applyEtherealEffects;
  createParticleEffect = utils.createParticleEffect;
  createRippleEffect = utils.createRippleEffect;
  applyGlassMorphism = utils.applyGlassMorphism;
} catch (error) {
  console.warn('Warning: Could not load animation utilities:', error);
  // Create empty functions as fallbacks
  applyEtherealEffects = () => console.log('Mock applyEtherealEffects called');
  createParticleEffect = () => console.log('Mock createParticleEffect called');
  createRippleEffect = () => console.log('Mock createRippleEffect called');
  applyGlassMorphism = () => console.log('Mock applyGlassMorphism called');
}

console.log('🌟 Professional UI initializer loaded');

// Initialize all professional effects AFTER React has rendered
window.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 DOM Content Loaded - Will initialize professional UI after React renders');
  
  // Wait until React has had time to render
  setTimeout(() => {
    try {
      // Make sure React has rendered content
      const appElement = document.getElementById('app');
      const rootElement = document.getElementById('root');
      
      if ((appElement && appElement.children.length > 1) || 
          (rootElement && rootElement.children.length > 1)) {
        console.log('React appears to have rendered, initializing UI effects');
        initializeEtherealUI();
      } else {
        console.log('Delaying ethereal UI initialization as React may not have rendered yet');
        // Try again after a longer delay
        setTimeout(initializeEtherealUI, 1000);
      }
    } catch (error) {
      console.error('Error checking React render status:', error);
    }
  }, 500);
});

// Set up proper full-page layout
function ensureFullPageLayout() {
  // Ensure full page coverage
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.minHeight = '100vh';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden auto';
  
  // Make app container full page
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.style.width = '100%';
    appElement.style.minHeight = '100vh';
    appElement.style.display = 'flex';
    appElement.style.flexDirection = 'column';
  }
  
  // Ensure container elements use full width
  document.querySelectorAll('.container, .dashboard, .tools-container, .ai-assistant').forEach(container => {
    container.style.width = '100%';
    container.style.maxWidth = '100%';
    container.style.boxSizing = 'border-box';
  });
}

function initializeEtherealUI() {
  console.log('🌟 Starting to initialize professional UI');
  
  try {
    // Add professional background to the entire page
    document.body.classList.add('ethereal-bg');
    
    // Set up proper layout
    ensureFullPageLayout();
    
    // Create subtle star field if it doesn't exist yet
    if (!document.querySelector('.star-field')) {
      const starField = document.createElement('div');
      starField.className = 'star-field';
      document.body.appendChild(starField);
    }
    
    try {
      // Apply core effects
      applyEtherealEffects();
      
      // Apply glass morphism to containers
      applyGlassMorphism('.calculator-container, .card, .insight-card');
      
      // Add subtle particle effects to header
      createParticleEffect('.header', { 
        particleCount: 3, // Minimal particles for subtle effect
        colors: [
          'rgba(156, 84, 213, 0.1)', 
          'rgba(0, 168, 255, 0.1)'
        ],
        minSize: 1,
        maxSize: 3
      });
      
      // Add ripple effect to primary buttons
      createRippleEffect('.button-primary, .gradient-button');
    } catch (error) {
      console.warn('Could not apply some visual effects:', error);
    }
    
    // Improve text contrast
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
      el.style.color = 'white';
      el.style.textShadow = 'none';
    });
    
    document.querySelectorAll('p, span, div, label').forEach(el => {
      if (!el.closest('.gradient-text, .main-gradient-text')) {
        // Only apply to elements that don't already have special styling
        el.style.color = 'rgba(255, 255, 255, 0.9)';
      }
    });
    
    // Ensure important metrics are clearly visible
    document.querySelectorAll('.result-value, .metric-value, .stat-value').forEach(el => {
      el.style.color = 'white';
      el.style.fontWeight = '700';
    });
    
    // Add subtle background gradient
    createSubtleBackground();
    
    console.log('🌟 All professional UI enhancements initialized!');
  } catch (error) {
    console.error('❌ Error initializing professional UI:', error);
  }
}

// Create subtle background gradient
function createSubtleBackground() {
  // Check if background already exists
  if (document.querySelector('.subtle-background')) {
    return;
  }
  
  const subtleBackground = document.createElement('div');
  subtleBackground.className = 'subtle-background';
  subtleBackground.style.position = 'fixed';
  subtleBackground.style.top = '0';
  subtleBackground.style.left = '0';
  subtleBackground.style.width = '100%';
  subtleBackground.style.height = '100%';
  subtleBackground.style.background = 'radial-gradient(circle at 80% 10%, rgba(156, 84, 213, 0.02) 0%, transparent 50%), radial-gradient(circle at 20% 70%, rgba(0, 168, 255, 0.02) 0%, transparent 50%)';
  subtleBackground.style.opacity = '0.5';
  subtleBackground.style.pointerEvents = 'none';
  subtleBackground.style.zIndex = '-2';
  document.body.prepend(subtleBackground);
} 