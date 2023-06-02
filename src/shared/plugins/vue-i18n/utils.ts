import { DEFAULT_LANGUAGE, SupportLanguage } from '.'

export const getViLocalesFromModules = () => {
  const results: Record<string, object> = {}
  const files = import.meta.glob('/**/modules/**/locales/vi.json', {
    eager: true,
    import: 'default',
  })
  for (const key in files) {
    const module = key.split('/')[3]
    results[module] = files[key] as object
  }
  return results
}

export const getEnLocalesFromModules = () => {
  const results: Record<string, object> = {}
  const files = import.meta.glob('/**/modules/**/locales/en.json', {
    eager: true,
    import: 'default',
  })
  for (const key in files) {
    const module = key.split('/')[3]
    results[module] = files[key] as object
  }
  return results
}

export const getLanguageFromStorage = (): SupportLanguage => {
  const language = localStorage.getItem('language')
  if (language && Object.values(SupportLanguage).includes(language as SupportLanguage)) {
    return language as SupportLanguage
  }
  return DEFAULT_LANGUAGE
}
