// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"b9XL":[function(require,module,exports) {
function _typeof(o) {
  "@babel/helpers - typeof";

  return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{}],"BvG2":[function(require,module,exports) {
var _typeof = require("./typeof.js")["default"];
function toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
module.exports = toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":"b9XL"}],"GBoX":[function(require,module,exports) {
var _typeof = require("./typeof.js")["default"];
var toPrimitive = require("./toPrimitive.js");
function toPropertyKey(t) {
  var i = toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
module.exports = toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./typeof.js":"b9XL","./toPrimitive.js":"BvG2"}],"IxO8":[function(require,module,exports) {
var toPropertyKey = require("./toPropertyKey.js");
function _defineProperty(e, r, t) {
  return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
},{"./toPropertyKey.js":"GBoX"}],"mJcT":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyEtherealEffects = applyEtherealEffects;
exports.applyGlassMorphism = applyGlassMorphism;
exports.create3DCardEffect = create3DCardEffect;
exports.createCosmicDustEffect = createCosmicDustEffect;
exports.createFlowingGradient = createFlowingGradient;
exports.createMagneticEffect = createMagneticEffect;
exports.createParallaxEffect = createParallaxEffect;
exports.createParticleEffect = createParticleEffect;
exports.createRippleEffect = createRippleEffect;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2.default)(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
/**
 * Advanced Animation Utilities for BetAnalytix
 * Professional, subtle animations that enhance UX without sacrificing readability
 */

// Apply main ethereal effects to the UI
function applyEtherealEffects() {
  console.log('Applying subtle ethereal effects');

  // Apply to all cards
  document.querySelectorAll('.card, .bet-card, .metric-card, .chart-card, .insight-card').forEach(function (card) {
    // Subtle hover animation
    card.addEventListener('mouseenter', function () {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
      card.style.transition = 'all 0.3s ease';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
      card.style.transition = 'all 0.3s ease';
    });
  });

  // Apply shimmer effect to buttons
  document.querySelectorAll('.button-primary, .gradient-button').forEach(function (button) {
    button.classList.add('shimmer-effect');
  });

  // Add subtle animation to results when they change
  observeResultChanges();
}

// Create subtle particle effect
function createParticleEffect(target) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var defaults = {
    particleCount: 5,
    // Reduced count
    colors: ['rgba(156, 84, 213, 0.1)', 'rgba(0, 168, 255, 0.1)'],
    // More transparent
    minSize: 1,
    maxSize: 3,
    // Smaller particles
    speed: 0.2,
    // Slower movement
    turbulence: 0.2 // Less turbulence
  };
  var settings = _objectSpread(_objectSpread({}, defaults), options);

  // Convert target to element if it's a selector
  var targetEl = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetEl) return;

  // Don't create particles if element is too small (prevents overcrowding)
  if (targetEl.offsetWidth < 100 || targetEl.offsetHeight < 100) return;

  // Create particle container
  var particleContainer = document.createElement('div');
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
  for (var i = 0; i < settings.particleCount; i++) {
    createParticle(particleContainer, settings);
  }
  targetEl.appendChild(particleContainer);
}

// Helper to create a single particle
function createParticle(container, settings) {
  var particle = document.createElement('div');
  particle.className = 'ethereal-particle';

  // Random size
  var size = settings.minSize + Math.random() * (settings.maxSize - settings.minSize);

  // Style particle
  particle.style.position = 'absolute';
  particle.style.width = "".concat(size, "px");
  particle.style.height = "".concat(size, "px");
  particle.style.borderRadius = '50%';
  particle.style.background = settings.colors[Math.floor(Math.random() * settings.colors.length)];
  particle.style.opacity = '0';

  // Set initial position
  particle.style.top = "".concat(Math.random() * 100, "%");
  particle.style.left = "".concat(Math.random() * 100, "%");

  // Add to container
  container.appendChild(particle);

  // Animate particle
  setTimeout(function () {
    particle.style.transition = "opacity 1s ease, transform ".concat(20 + Math.random() * 40, "s ease");
    particle.style.opacity = String(0.3 + Math.random() * 0.5); // More subtle opacity

    // Start floating animation
    animateParticle(particle, settings);
  }, Math.random() * 1000);
}

// Animate a particle
function animateParticle(particle, settings) {
  var speed = settings.speed || 0.2;
  var turbulence = settings.turbulence || 0.2;
  function moveParticle() {
    // Current position
    var currentTop = parseFloat(particle.style.top);
    var currentLeft = parseFloat(particle.style.left);

    // Random movement
    var newTop = currentTop + (Math.random() - 0.5) * turbulence;
    var newLeft = currentLeft + (Math.random() - 0.5) * turbulence;

    // Keep within bounds
    particle.style.top = "".concat(Math.max(0, Math.min(100, newTop)), "%");
    particle.style.left = "".concat(Math.max(0, Math.min(100, newLeft)), "%");

    // Slow transition
    particle.style.transition = "top ".concat(speed * 5, "s ease, left ").concat(speed * 5, "s ease");

    // Continue animation
    setTimeout(moveParticle, 5000);
  }
  moveParticle();
}

// Create subtle ripple effect
function createRippleEffect(selector) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.addEventListener('click', function (e) {
      var rect = element.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var ripple = document.createElement('span');
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
      setTimeout(function () {
        ripple.style.transform = 'scale(10)';
        ripple.style.opacity = '0';
        setTimeout(function () {
          ripple.remove();
        }, 500);
      }, 10);
    });
  });
}

// Create subtle 3D card effect
function create3DCardEffect(selector) {
  var cards = document.querySelectorAll(selector);
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();

      // Get mouse position relative to card
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Calculate rotation based on mouse position (keep subtle)
      var tiltX = (y / rect.height - 0.5) * 5; // Reduced tilt amount
      var tiltY = (x / rect.width - 0.5) * -5;

      // Apply transformation
      card.style.transform = "perspective(1000px) rotateX(".concat(tiltX, "deg) rotateY(").concat(tiltY, "deg)");
    });

    // Reset on mouse leave
    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      card.style.transition = 'transform 0.5s ease';
    });

    // Remove transition on mouse enter for smooth movement
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// Subtle magnetic button effect
function createMagneticEffect(selector) {
  var buttons = document.querySelectorAll(selector);
  buttons.forEach(function (button) {
    button.addEventListener('mousemove', function (e) {
      var rect = button.getBoundingClientRect();

      // Get mouse position relative to button
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      // Calculate center
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;

      // Calculate distance from center (normalized)
      var distanceX = (x - centerX) / centerX;
      var distanceY = (y - centerY) / centerY;

      // Apply subtle magnetic pull
      var pull = 3; // Reduced pull amount
      button.style.transform = "translate(".concat(distanceX * pull, "px, ").concat(distanceY * pull, "px)");
    });

    // Reset on mouse leave
    button.addEventListener('mouseleave', function () {
      button.style.transform = 'translate(0, 0)';
      button.style.transition = 'transform 0.3s ease';
    });

    // Remove transition on mouse enter for smooth movement
    button.addEventListener('mouseenter', function () {
      button.style.transition = 'transform 0.1s ease';
    });
  });
}

// Create subtle cosmic dust effect
function createCosmicDustEffect(selector) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    // Only add to large enough elements
    if (element.offsetWidth < 200 || element.offsetHeight < 100) return;

    // Add subtle dust
    var _loop = function _loop() {
      // Reduced count
      var dust = document.createElement('div');
      dust.className = 'cosmic-dust';
      dust.style.position = 'absolute';
      dust.style.borderRadius = '50%';
      dust.style.background = 'rgba(255, 255, 255, 0.05)'; // More transparent
      dust.style.pointerEvents = 'none';

      // Random size (smaller)
      var size = 2 + Math.random() * 5;
      dust.style.width = "".concat(size, "px");
      dust.style.height = "".concat(size, "px");

      // Random position
      dust.style.top = "".concat(Math.random() * 100, "%");
      dust.style.left = "".concat(Math.random() * 100, "%");

      // Add to element
      if (window.getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
      }
      element.appendChild(dust);

      // Animate dust
      setTimeout(function () {
        dust.style.transition = "top ".concat(30 + Math.random() * 30, "s linear, left ").concat(30 + Math.random() * 30, "s linear");
        animateDust(dust);
      }, Math.random() * 1000);
    };
    for (var i = 0; i < 3; i++) {
      _loop();
    }
  });
}

// Animate cosmic dust
function animateDust(dust) {
  function moveDust() {
    // Random position
    dust.style.top = "".concat(Math.random() * 100, "%");
    dust.style.left = "".concat(Math.random() * 100, "%");

    // Continue animation
    setTimeout(moveDust, 30000);
  }
  moveDust();
}

// Create subtle parallax effect
function createParallaxEffect(selector) {
  var intensity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
  var elements = document.querySelectorAll(selector);
  window.addEventListener('mousemove', function (e) {
    var x = e.clientX;
    var y = e.clientY;

    // Get window dimensions
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    // Calculate mouse position as percentage
    var mouseXPercent = x / windowWidth - 0.5;
    var mouseYPercent = y / windowHeight - 0.5;

    // Apply subtle movement to elements
    elements.forEach(function (element) {
      var moveX = mouseXPercent * intensity * 20; // Reduced movement
      var moveY = mouseYPercent * intensity * 20;
      element.style.transform = "translate(".concat(moveX, "px, ").concat(moveY, "px)");
      element.style.transition = 'transform 0.3s ease-out';
    });
  });
}

// Create subtle flowing gradient effect
function createFlowingGradient(selector) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    // Don't apply to elements that already have background
    if (window.getComputedStyle(element).background !== 'none' && !window.getComputedStyle(element).background.includes('none') && !element.classList.contains('gradient-text') && !element.classList.contains('main-gradient-text')) {
      return;
    }

    // Create gradient background
    element.style.background = 'linear-gradient(90deg, #9c54d5, #00a8ff, #9c54d5)';
    element.style.backgroundSize = '200% 100%';
    element.style.animation = 'subtleGradientFlow 8s ease infinite';

    // If it's a text element, make it background clip
    if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'H5' || element.tagName === 'H6' || element.tagName === 'SPAN' || element.classList.contains('gradient-text') || element.classList.contains('main-gradient-text')) {
      element.style.webkitBackgroundClip = 'text';
      element.style.webkitTextFillColor = 'transparent';
      element.style.backgroundClip = 'text';
      element.style.textFillColor = 'transparent';
    }
  });

  // Add animation if it doesn't exist
  if (!document.getElementById('subtle-gradient-flow')) {
    var style = document.createElement('style');
    style.id = 'subtle-gradient-flow';
    style.textContent = "\n      @keyframes subtleGradientFlow {\n        0% { background-position: 0% 50%; }\n        50% { background-position: 100% 50%; }\n        100% { background-position: 0% 50%; }\n      }\n    ";
    document.head.appendChild(style);
  }
}

// Observer for result changes to add subtle animation
function observeResultChanges() {
  // Create a MutationObserver to watch for changes in result values
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        var target = mutation.target.closest('.result-value, .metric-value, .stat-value');
        if (target) {
          // Apply subtle highlight animation
          target.classList.add('result-updated');

          // Remove the class after animation completes
          setTimeout(function () {
            target.classList.remove('result-updated');
          }, 1500);
        }
      }
    });
  });

  // Observe all result containers
  document.querySelectorAll('.result-value, .metric-value, .stat-value').forEach(function (element) {
    observer.observe(element, {
      childList: true,
      characterData: true,
      subtree: true
    });
  });

  // Add animation styles if not already present
  if (!document.getElementById('result-update-animation')) {
    var style = document.createElement('style');
    style.id = 'result-update-animation';
    style.textContent = "\n      @keyframes resultHighlight {\n        0% { text-shadow: 0 0 0px transparent; }\n        50% { text-shadow: 0 0 8px rgba(156, 84, 213, 0.6); }\n        100% { text-shadow: 0 0 0px transparent; }\n      }\n      \n      .result-updated {\n        animation: resultHighlight 1.5s ease;\n      }\n    ";
    document.head.appendChild(style);
  }
}

// Apply a subtle glass morphism effect to elements
function applyGlassMorphism(selector) {
  var elements = document.querySelectorAll(selector);
  elements.forEach(function (element) {
    element.style.backgroundColor = 'rgba(30, 38, 64, 0.7)';
    element.style.backdropFilter = 'blur(5px)'; // Reduced blur
    element.style.WebkitBackdropFilter = 'blur(5px)';
    element.style.border = '1px solid rgba(255, 255, 255, 0.05)';
  });
}
},{"@babel/runtime/helpers/defineProperty":"IxO8"}],"Q69C":[function(require,module,exports) {
/**
 * Professional UI Initializer
 * Ensures clarity and readability while maintaining visual appeal
 */

// Import helper functions - handle potential missing imports
var applyEtherealEffects, createParticleEffect, createRippleEffect, applyGlassMorphism;
try {
  var utils = require('./utils/advancedAnimations');
  applyEtherealEffects = utils.applyEtherealEffects;
  createParticleEffect = utils.createParticleEffect;
  createRippleEffect = utils.createRippleEffect;
  applyGlassMorphism = utils.applyGlassMorphism;
} catch (error) {
  console.warn('Warning: Could not load animation utilities:', error);
  // Create empty functions as fallbacks
  applyEtherealEffects = function applyEtherealEffects() {
    return console.log('Mock applyEtherealEffects called');
  };
  createParticleEffect = function createParticleEffect() {
    return console.log('Mock createParticleEffect called');
  };
  createRippleEffect = function createRippleEffect() {
    return console.log('Mock createRippleEffect called');
  };
  applyGlassMorphism = function applyGlassMorphism() {
    return console.log('Mock applyGlassMorphism called');
  };
}
console.log('🌟 Professional UI initializer loaded');

// Initialize all professional effects AFTER React has rendered
window.addEventListener('DOMContentLoaded', function () {
  console.log('🌟 DOM Content Loaded - Will initialize professional UI after React renders');

  // Wait until React has had time to render
  setTimeout(function () {
    try {
      // Make sure React has rendered content
      var appElement = document.getElementById('app');
      var rootElement = document.getElementById('root');
      if (appElement && appElement.children.length > 1 || rootElement && rootElement.children.length > 1) {
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
  var appElement = document.getElementById('app');
  if (appElement) {
    appElement.style.width = '100%';
    appElement.style.minHeight = '100vh';
    appElement.style.display = 'flex';
    appElement.style.flexDirection = 'column';
  }

  // Ensure container elements use full width
  document.querySelectorAll('.container, .dashboard, .tools-container, .ai-assistant').forEach(function (container) {
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
      var starField = document.createElement('div');
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
        particleCount: 3,
        // Minimal particles for subtle effect
        colors: ['rgba(156, 84, 213, 0.1)', 'rgba(0, 168, 255, 0.1)'],
        minSize: 1,
        maxSize: 3
      });

      // Add ripple effect to primary buttons
      createRippleEffect('.button-primary, .gradient-button');
    } catch (error) {
      console.warn('Could not apply some visual effects:', error);
    }

    // Improve text contrast
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(function (el) {
      el.style.color = 'white';
      el.style.textShadow = 'none';
    });
    document.querySelectorAll('p, span, div, label').forEach(function (el) {
      if (!el.closest('.gradient-text, .main-gradient-text')) {
        // Only apply to elements that don't already have special styling
        el.style.color = 'rgba(255, 255, 255, 0.9)';
      }
    });

    // Ensure important metrics are clearly visible
    document.querySelectorAll('.result-value, .metric-value, .stat-value').forEach(function (el) {
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
  var subtleBackground = document.createElement('div');
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
},{"./utils/advancedAnimations":"mJcT"}]},{},["Q69C"], null)
//# sourceMappingURL=etherealInitializer.bebd8fdd.js.map