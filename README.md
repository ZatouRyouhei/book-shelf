# あなたの本棚クライアント

あなたが読んだ本を管理します。
あなたの本棚ウェブサービスとセットで使用してください。

ダウンロードファイルのbook-shelf/src/constant.jsに
ウェブサービスの接続先が記載されているので、  
環境にあったIPアドレスとポート番号に変更してください。
```
const URL_BASE = 'http://localhost:8081/bookshelf/webresources/'
```

セットアップのためにはあらかじめ[Node.js](https://nodejs.org/ja/)をインストールしておいてください。  

## セットアップ
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## リリース方法
```
npm run build
```
実行後にbook-shelf/distが生成されます。  
C:\inetpub\wwwrootに、book-shelfフォルダを作成し、  
distフォルダの中身をコピーアンドペーストしてください。
