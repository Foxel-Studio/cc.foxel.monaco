import { createRoot, type Root } from 'react-dom/client';
import type { PluginContext } from './contract';
import { EditorApp } from './EditorApp';
import './styles.css';

const roots = new WeakMap<HTMLElement, Root>();

function mount(container: HTMLElement, ctx: PluginContext) {
  const root = roots.get(container) ?? createRoot(container);
  roots.set(container, root);
  root.render(<EditorApp filePath={ctx.filePath} />);
  return () => {
    root.unmount();
    roots.delete(container);
  };
}

const register = window.FoxelRegister;
if (!register) throw new Error('FoxelRegister is missing');
register({ mount });
