import { beforeEach, describe, expect, it } from 'vitest'
import {
  applyThemeToDocument,
  normalizeThemePreference,
  normalizeTerminalFont,
  resolveTheme,
  terminalFontFamily,
  terminalTheme,
} from '../../../internal/web/static/app/theme.js'

describe('theme preference', () => {
  beforeEach(() => {
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-theme-preference')
    document.head.innerHTML = '<meta name="theme-color" content="#000000">'
  })

  it('normalizes invalid persisted values and resolves system preference', () => {
    expect(normalizeThemePreference('light')).toBe('light')
    expect(normalizeThemePreference('sepia')).toBe('system')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('applies the resolved light theme to every DOM compatibility hook', () => {
    expect(applyThemeToDocument('light', true)).toBe('light')
    const root = document.documentElement
    expect(root.dataset.theme).toBe('light')
    expect(root.dataset.themePreference).toBe('light')
    expect(root.classList.contains('light')).toBe(true)
    expect(root.classList.contains('dark')).toBe(false)
    expect(root.style.colorScheme).toBe('light')
    expect(document.querySelector('meta[name="theme-color"]').content).toBe('#f4f6f8')
  })

  it('replaces stale theme classes when switching to dark', () => {
    applyThemeToDocument('light', false)
    expect(applyThemeToDocument('dark', false)).toBe('dark')
    expect(document.documentElement.classList.contains('light')).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('provides contrasting xterm palettes for both resolved themes', () => {
    const light = terminalTheme('light')
    const dark = terminalTheme('dark')
    expect(light.background).toBe('#ffffff')
    expect(light.foreground).not.toBe(dark.foreground)
    expect(dark.background).toBe('#0b0f1a')
  })

  it('normalizes and resolves terminal font families', () => {
    expect(normalizeTerminalFont('ibm')).toBe('ibm')
    expect(normalizeTerminalFont('comic-sans')).toBe('jetbrains')
    expect(terminalFontFamily('jetbrains')).toContain('JetBrains Mono')
    expect(terminalFontFamily('ibm')).toContain('IBM Plex Mono')
    expect(terminalFontFamily('fira')).toContain('Fira Code')
    expect(terminalFontFamily('source')).toContain('Source Code Pro')
    expect(terminalFontFamily('hasklug')).toContain('Hasklug Nerd Font')
    expect(terminalFontFamily('ubuntu')).toContain('Ubuntu Mono')
    expect(terminalFontFamily('system')).toContain('ui-monospace')
    expect(terminalFontFamily('system')).toContain('SFMono-Regular')
    expect(terminalFontFamily('system')).toContain('Cascadia Mono')
    expect(terminalFontFamily('system')).toContain('Liberation Mono')
  })
})
