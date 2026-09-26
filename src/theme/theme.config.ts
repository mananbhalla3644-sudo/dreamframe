// src/theme/theme.config.ts
// Single source of design tokens for DREAMFRAME

export const themeConfig = {
  // Palette derived from theme: "Dreamlike cosmic glass, soft violet nebulae, iridescent surfaces"
  // Mood: premium, dreamy, futuristic
  palette: {
    bg: "#0a0a1a",           // Deep indigo/black base
    surface: "#1a1a2e",      // Slightly lighter for cards/panels
    surfaceAlt: "#252542",   // Alternative surface for variation
    primary: "#8a2be2",      // Violet - main accent
    secondary: "#e6e6fa",    // Lavender - secondary accent
    accent: "#ff69b4",       // Pink glow - for highlights and effects
    text: "#ffffff",         // Primary text
    textMuted: "#b0b0c0",    // Muted text
    glow: "#ff4500",         // Warm orange CTA - for conversion elements
  },

  // Typography: Display font "Orbitron" (futuristic, techno) with body font "Inter" (highly legible)
  typography: {
    display: {
      fontFamily: '"Orbitron", system-ui, sans-serif',
      fontWeight: 400,
    },
    body: {
      fontFamily: '"Inter", system-ui, sans-serif',
      fontWeight: 400,
    },
    // Fluid type scale using clamp() will be implemented in CSS/utilities
  },

  // Motion personality: Premium feel with expo-out easing
  motion: {
    ease: "expo-out",
    durFast: 0.6,
    durBase: 1.2,
    durSlow: 1.8,
    stagger: 0.08,
  },

  // 3D motif: Procedural noise-displaced sphere (metaball-style) as primary object
  // Supporting element: floating particle field
  three: {
    primaryMotif: "metaball",
    supportingElement: "particleField",
    // Shader mood: Color ramp shifting from deep violet to pink, low-speed noise distortion
    shaderMood: {
      colorRamp: ["#8a2be2", "#ff69b4"], // Violet to pink
      noiseSpeed: 0.3,
      distortionStrength: 0.15,
      chromaticAberration: 0.002, // Subtle
    },
  },

  // Copy voice guidelines
  copyVoice: {
    tone: [
      "Benefit-focused language",
      "Avoid tech jargon", 
      "Use cosmic/wonder metaphors"
    ],
    bannedCliches: [
      "next generation",
      "cutting edge",
      "game changer"
    ],
    headlinePatterns: [
      "Verb a noun into cosmic result",
      "Transform your idea into reality",
      "From concept to cosmos"
    ],
  },

  // Section order: Educational flow that builds desire before conversion
  sectionOrder: [
    "hero",
    "story", 
    "features",
    "showcase",
    "proof",
    "contact"
  ],

  // Cursor and micro-interactions
  cursor: {
    size: 24,
    color: "#ff69b4", // Pink glow
    hoverScale: 1.4,
    magneticStrength: 0.3,
  },
};

// Helper function to get CSS variable values for use in JSX
export const getCssVariable = (variableName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
};