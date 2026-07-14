// theme.js -- Theme preference normalization and DOM application.
//
// The persisted preference may be light, dark, or system. Components should
// consume the resolved light/dark value when they need concrete colors (for
// example xterm.js), while controls should display the persisted preference.

export const THEME_PREFERENCES = ['system', 'light', 'dark']
export const TERMINAL_FONT_OPTIONS = [
  { id: 'jetbrains', label: 'JetBrains Mono' },
  { id: 'ibm', label: 'IBM Plex Mono' },
  { id: 'fira', label: 'Fira Code' },
  { id: 'source', label: 'Source Code Pro' },
  { id: 'hasklug', label: 'Hasklug Nerd Font' },
  { id: 'ubuntu', label: 'Ubuntu Mono' },
  { id: 'system', label: 'System Mono' },
]

export function normalizeThemePreference(value) {
  return THEME_PREFERENCES.includes(value) ? value : 'system'
}

export function resolveTheme(preference, prefersDark = false) {
  const normalized = normalizeThemePreference(preference)
  if (normalized === 'system') return prefersDark ? 'dark' : 'light'
  return normalized
}

export function normalizeTerminalFont(value) {
  return TERMINAL_FONT_OPTIONS.some(option => option.id === value) ? value : 'jetbrains'
}

export function terminalFontFamily(value) {
  // The fallback order covers macOS (SFMono/Menlo), Windows browsers used
  // with WSL (Cascadia/Consolas), and Linux (Liberation/DejaVu).
  const portableFallback = "ui-monospace, 'SFMono-Regular', 'Cascadia Code', 'Cascadia Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'DejaVu Sans Mono', monospace"
  switch (normalizeTerminalFont(value)) {
    case 'ibm':
      return `'IBM Plex Mono', ${portableFallback}`
    case 'fira':
      return `'Fira Code', ${portableFallback}`
    case 'source':
      return `'Source Code Pro', ${portableFallback}`
    case 'hasklug':
      return `'Hasklug Nerd Font Mono', 'Hasklug Nerd Font', ${portableFallback}`
    case 'ubuntu':
      return `'Ubuntu Mono', ${portableFallback}`
    case 'system':
      return portableFallback
    default:
      return `'JetBrains Mono', ${portableFallback}`
  }
}

export function applyThemeToDocument(preference, prefersDark = false, doc = document) {
  const normalized = normalizeThemePreference(preference)
  const resolved = resolveTheme(normalized, prefersDark)
  const root = doc.documentElement

  root.dataset.theme = resolved
  root.dataset.themePreference = normalized
  root.classList.toggle('dark', resolved === 'dark')
  root.classList.toggle('light', resolved === 'light')
  root.style.colorScheme = resolved

  const themeColor = doc.querySelector('meta[name="theme-color"]')
  if (themeColor) themeColor.setAttribute('content', resolved === 'dark' ? '#1a1b26' : '#f4f6f8')

  return resolved
}

export function terminalTheme(resolvedTheme) {
  if (resolvedTheme === 'light') {
    return {
      background: '#ffffff',
      foreground: '#263043',
      cursor: '#2959aa',
      cursorAccent: '#ffffff',
      selectionBackground: 'rgba(41, 89, 170, 0.22)',
      black: '#263043', red: '#c73650', green: '#147d64', yellow: '#9a6700',
      blue: '#2959aa', magenta: '#7759b8', cyan: '#087e8b', white: '#e7ebf0',
      brightBlack: '#667085', brightRed: '#dd405d', brightGreen: '#168a6e',
      brightYellow: '#ad7500', brightBlue: '#356bc3', brightMagenta: '#8868cc',
      brightCyan: '#0a8f9e', brightWhite: '#ffffff',
    }
  }

  return {
    background: '#0b0f1a',
    foreground: '#c0caf5',
    cursor: '#7aa2f7',
    cursorAccent: '#0b0f1a',
    selectionBackground: 'rgba(122, 162, 247, 0.28)',
    black: '#15161e', red: '#f7768e', green: '#73daca', yellow: '#e0af68',
    blue: '#7aa2f7', magenta: '#bb9af7', cyan: '#7dcfff', white: '#a9b1d6',
    brightBlack: '#565f89', brightRed: '#ff8da1', brightGreen: '#8be8d8',
    brightYellow: '#f0c27b', brightBlue: '#8db0ff', brightMagenta: '#c9a9ff',
    brightCyan: '#91dcff', brightWhite: '#c0caf5',
  }
}
