/** Keep `manifest.json` `frontend.supportedExts` in this order. */
export const TEXT_EXTS = [
  'js', 'jsx', 'mjs', 'cjs', 'ts', 'tsx', 'mts', 'cts', 'vue', 'html', 'htm', 'css', 'scss', 'sass', 'less',
  'json', 'xml', 'yaml', 'yml', 'py', 'java', 'cpp', 'cc', 'cxx', 'c', 'h', 'hpp', 'hxx', 'php', 'rb', 'go',
  'rs', 'rust', 'swift', 'kt', 'scala', 'clj', 'cljs', 'cs', 'vb', 'fs', 'pl', 'pm', 'r', 'lua', 'dart', 'elm',
  'sql', 'md', 'markdown', 'txt', 'log', 'ini', 'cfg', 'conf', 'sh', 'bash', 'zsh', 'fish', 'ps1', 'bat', 'cmd',
  'dockerfile', 'makefile', 'gradle', 'cmake', 'gitignore', 'gitattributes', 'editorconfig', 'prettierrc',
  'env', 'config', 'properties', 'toml',
] as const;

const LANGUAGES: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript', cjs: 'javascript',
  ts: 'typescript', tsx: 'typescript', mts: 'typescript', cts: 'typescript',
  vue: 'html', html: 'html', htm: 'html',
  css: 'css', scss: 'scss', sass: 'scss', less: 'less',
  json: 'json', xml: 'xml', yaml: 'yaml', yml: 'yaml',
  py: 'python', java: 'java',
  c: 'c', h: 'c', cpp: 'cpp', cc: 'cpp', cxx: 'cpp', hpp: 'cpp', hxx: 'cpp',
  php: 'php', rb: 'ruby', go: 'go', rs: 'rust', rust: 'rust', swift: 'swift',
  kt: 'kotlin', scala: 'scala', cs: 'csharp', lua: 'lua', r: 'r', dart: 'dart', sql: 'sql',
  md: 'markdown', markdown: 'markdown',
  sh: 'shell', bash: 'shell', zsh: 'shell', fish: 'shell', ps1: 'powershell', bat: 'bat', cmd: 'bat',
  ini: 'ini', cfg: 'ini', conf: 'ini', toml: 'ini', properties: 'ini', env: 'ini',
  dockerfile: 'dockerfile',
};

export function extOf(name: string): string {
  const base = name.split(/[/\\]/).pop() || name;
  const index = base.lastIndexOf('.');
  if (index <= 0) return base.toLowerCase();
  return base.slice(index + 1).toLowerCase();
}

export function baseName(path: string): string {
  const norm = path.replace(/\\/g, '/');
  const index = norm.lastIndexOf('/');
  return norm.slice(index + 1) || norm;
}

export function languageFor(name: string): string {
  return LANGUAGES[extOf(name)] ?? 'plaintext';
}

export function wrapFor(language: string): 'on' | 'off' {
  return language === 'plaintext' || language === 'markdown' ? 'on' : 'off';
}
