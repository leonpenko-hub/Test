// This is the 'backend' of the Figma plugin.
// It handles the creation of the UI window.

figma.showUI(__html__, { 
  width: 400, 
  height: 700,
  themeColors: true // Allows the plugin to adapt to Figma's light/dark mode if configured
});

// Handle messages from the UI if needed in the future
figma.ui.onmessage = (msg) => {
  if (msg.type === 'close') {
    figma.closePlugin();
  }
};