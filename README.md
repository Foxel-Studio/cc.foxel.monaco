# monaco

只通过文本和代码文件打开。编辑器是宿主的 `@monaco-editor/react`：清单声明 `monaco` 能力后，插件帧会把它放到 `window.__FOXEL_EXTERNALS__.MonacoEditor`。这个包不打包 Monaco。

`Ctrl+S` 或「保存」会把当前内容写回原文件。二进制内容和超过 2 MB 的文件不会打开。不是 UTF-8 的文本会按 GBK 解码。主题跟随宿主的明暗模式。

```bash
cd plugins/cc.foxel.monaco
bun install
bun test
bun run foxpkg
```

安装包是 `dist/cc.foxel.monaco.foxpkg`。
