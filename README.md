### システム要件（ollama）

- OS: macOS 12+, Linux, Windows 10+
- RAM: 最低 8GB（16GB 以上推奨）
- ストレージ: モデルによって異なるが、最低 10GB 以上の空き容量

### Windows での実行手順（クイックスタート）

1. [公式サイト](https://ollama.com/)から ollama のインストーラーをダウンロード
2. インストーラーを実行し、画面の指示に従う
3. ターミナルを開き、[gemma3](https://ollama.com/library/gemma3:4b) のモデルをダウンロードする。
   ※gemma3:4b の場合、3.3GB 以上の空き容量が必要

```
$ ollama pull gemma3:4b
```

4. npm install

```
$ npm install
```

5. プロジェクトのルートディレクトリに`public/uploads`のフォルダを作成

6. サーバーを起動(http://localhost:3000/)

```
$ npm run start
```
