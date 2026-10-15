const zh = {
  loading: '正在打开…',
  save: '保存',
  saving: '正在保存…',
  saved: '已保存',
  dirty: '未保存',
  binary: '这不是文本文件。',
  tooLarge: '文件超过 {size} MB，无法在编辑器里打开。',
  noFile: '没有可读取的文件。',
} as const;

const en: Record<keyof typeof zh, string> = {
  loading: 'Opening…',
  save: 'Save',
  saving: 'Saving…',
  saved: 'Saved',
  dirty: 'Unsaved',
  binary: 'This is not a text file.',
  tooLarge: 'Files larger than {size} MB cannot be opened in the editor.',
  noFile: 'No file to read.',
};

export type MessageKey = keyof typeof zh;

function lang(): 'zh' | 'en' {
  return document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'zh';
}

export function t(key: MessageKey, params?: Record<string, string | number>): string {
  const template = (lang() === 'en' ? en : zh)[key];
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
}
