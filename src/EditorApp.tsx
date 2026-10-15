import { useCallback, useEffect, useState } from 'react';
import type { VfsApi } from './contract';
import { baseName, languageFor, wrapFor } from './formats';
import { t } from './i18n';
import { decodeText, MAX_TEXT_BYTES } from './text';
import { useDark } from './theme';

function vfs(): VfsApi {
  const api = window.__FOXEL_EXTERNALS__?.foxelApi?.vfs;
  if (!api?.readFile || !api.uploadFile) throw new Error(t('noFile'));
  return api;
}

export function EditorApp({ filePath }: { filePath: string }) {
  const dark = useDark();
  const [text, setText] = useState('');
  const [saved, setSaved] = useState('');
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const language = languageFor(filePath);
  const dirty = phase === 'ready' && text !== saved;

  useEffect(() => {
    let disposed = false;
    setPhase('loading');
    void vfs().readFile(filePath).then((data) => {
      if (disposed) return;
      const decoded = decodeText(data);
      setText(decoded);
      setSaved(decoded);
      setPhase('ready');
    }).catch((error: unknown) => {
      if (disposed) return;
      const code = error instanceof Error ? error.message : '';
      const text = code === 'binary'
        ? t('binary')
        : code === 'too-large'
          ? t('tooLarge', { size: MAX_TEXT_BYTES / (1024 * 1024) })
          : (error instanceof Error ? error.message : String(error));
      setMessage(text);
      setPhase('error');
    });
    return () => { disposed = true; };
  }, [filePath]);

  const save = useCallback(async () => {
    if (phase !== 'ready' || text === saved || saving) return;
    setSaving(true);
    setMessage('');
    try {
      await vfs().uploadFile(filePath, new Blob([text], { type: 'text/plain;charset=utf-8' }));
      setSaved(text);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setSaving(false);
    }
  }, [filePath, phase, saved, saving, text]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  if (phase === 'loading') return <div className="foxel-monaco-status">{t('loading')}</div>;
  if (phase === 'error') return <div className="foxel-monaco-status is-error">{message}</div>;

  const Editor = window.__FOXEL_EXTERNALS__?.MonacoEditor;
  if (!Editor) return <div className="foxel-monaco-status is-error">Host Monaco is not loaded</div>;

  return (
    <div className={dark ? 'foxel-monaco is-dark' : 'foxel-monaco'}>
      <header className="foxel-monaco-bar">
        <span className="foxel-monaco-name" title={filePath}>{baseName(filePath)}</span>
        <span className="foxel-monaco-meta">{language}</span>
        <span className="foxel-monaco-meta">{saving ? t('saving') : dirty ? t('dirty') : t('saved')}</span>
        <button type="button" onClick={() => { void save(); }} disabled={!dirty || saving}>{t('save')}</button>
        {message ? <span className="foxel-monaco-error">{message}</span> : null}
      </header>
      <div className="foxel-monaco-editor">
        <Editor
          height="100%"
          path={filePath}
          language={language}
          theme={dark ? 'vs-dark' : 'vs'}
          value={text}
          onChange={(value) => setText(value ?? '')}
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            wordWrap: wrapFor(language),
            automaticLayout: true,
            scrollBeyondLastLine: false,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
