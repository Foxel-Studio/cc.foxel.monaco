import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { TEXT_EXTS, languageFor, wrapFor } from './formats';
import { decodeText } from './text';

test('manifest matches the text extensions and monaco capability', () => {
  const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url), 'utf8')) as {
    key: string;
    name: string;
    frontend: { supportedExts: string[]; capabilities: string[]; openApp: boolean };
  };
  assert.equal(manifest.key, 'cc.foxel.monaco');
  assert.equal(manifest.name, 'monaco');
  assert.deepEqual(manifest.frontend.supportedExts, [...TEXT_EXTS]);
  assert.deepEqual(manifest.frontend.capabilities, ['monaco']);
  assert.equal(manifest.frontend.openApp, false);
});

test('maps extensions to monaco languages', () => {
  assert.equal(languageFor('/src/App.TSX'), 'typescript');
  assert.equal(languageFor('notes.txt'), 'plaintext');
  assert.equal(languageFor('README.md'), 'markdown');
  assert.equal(wrapFor('markdown'), 'on');
  assert.equal(wrapFor('typescript'), 'off');
});

test('decodes utf-8 and rejects binary text', () => {
  assert.equal(decodeText(new TextEncoder().encode('你好').buffer), '你好');
  assert.throws(() => decodeText(Uint8Array.from([0x61, 0x00, 0x62]).buffer), /binary/);
});
