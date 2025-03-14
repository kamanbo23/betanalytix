// This file provides React compatibility for Preact components
import * as preact from 'preact';
import React from './react';

// Create global React reference
window.React = React;

// Re-export preact for convenience
export * from 'preact';
export * from 'preact/hooks';
export default preact; 