export const MOLO_SVG = `<svg class="molo-char" viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">
  <!-- Body glow -->
  <defs>
    <filter id="moloBgGlow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Main character body (simplified geometric shape) -->
  <circle cx="60" cy="80" r="35" fill="#c9a84c" opacity="0.8" filter="url(#moloBgGlow)"/>

  <!-- Head -->
  <circle cx="60" cy="50" r="20" fill="#d4b45e" opacity="0.9"/>

  <!-- Eyes -->
  <circle cx="52" cy="48" r="3" fill="#060608"/>
  <circle cx="68" cy="48" r="3" fill="#060608"/>

  <!-- Smile -->
  <path d="M 52 52 Q 60 55 68 52" stroke="#060608" stroke-width="2" fill="none" stroke-linecap="round"/>

  <!-- Arms (relaxed position) -->
  <rect x="25" y="75" width="12" height="30" rx="6" fill="#d4b45e" opacity="0.8"/>
  <rect x="83" y="75" width="12" height="30" rx="6" fill="#d4b45e" opacity="0.8"/>

  <!-- Base shine effect -->
  <ellipse cx="60" cy="115" rx="30" ry="8" fill="#fff" opacity="0.1"/>
</svg>`;

export const MOLO_CHAT_SVG = `<svg class="molo-chat-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>`;
