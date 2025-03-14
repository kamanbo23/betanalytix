// Safely initialize UI enhancements after React has rendered

// Wait for React to render before applying custom enhancements
console.log('🌟 Professional UI initializer loaded');

// Listen for custom React rendered event
document.addEventListener('reactRendered', () => {
  console.log('🌟 React has rendered, initializing professional UI');
  setTimeout(enhanceUI, 500); // Small delay to ensure all React components are fully rendered
});

// Fallback: Check if React has already rendered
if (window.reactRendered) {
  console.log('🌟 React already rendered, initializing professional UI');
  setTimeout(enhanceUI, 500);
}

// Fallback: Wait for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌟 DOM Content Loaded - Waiting for React rendering');
  // Wait longer to ensure React has time to render
  setTimeout(() => {
    if (!window.reactRendered) {
      console.log('🌟 React not detected yet, proceeding with UI enhancements anyway');
      enhanceUI();
    }
  }, 2000);
});

function enhanceUI() {
  try {
    console.log('🌟 Starting to initialize professional UI');
    
    // Apply non-intrusive enhancements here
    applySubtleEffects();
    
    console.log('🌟 All professional UI enhancements initialized!');
  } catch (error) {
    console.error('Error initializing professional UI:', error);
  }
}

function applySubtleEffects() {
  // Apply subtle animations to elements that don't interfere with React
  console.log('Applying subtle ethereal effects');
  
  // Example: Add hover effects to cards
  setTimeout(() => {
    const cards = document.querySelectorAll('div[style*="backgroundColor: rgba(20, 20, 20, 0.7)"]');
    cards.forEach(card => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });
  }, 1000);
} 