# XML-time-converter

## これはなに？

Moodleで分割された動画を1本の動画にする際に字幕データの結合ができないです。

Moodleの字幕データはXML形式で字幕表示開始時間と字幕表示終了時間がセットで格納されています。

分割された字幕のデータ(XML形式)の時刻部分を一括で編集するためのプログラムです。

## 起動方法

Node.jsが必要です。

### プログラムの取得

```bash
git clone git@github.com:yashiro-ryo/xml-time-converter.git
```

### 依存モジュールのインストール

```bash
npm install
```

### configの書き換え

4行目~7行目を書き換える。

`FILE_NAME`: 分割された字幕のXMLデータ

`START_HOUR`, `START_MIN`, `START_SEC`: 分割された動画の全体における開始時間 

```js
const FILE_NAME = '****.xml'
const START_HOUR = 0
const START_MIN = 0
const START_SEC = 0
```

### 実行

```bash
node time-converter.js
```

`{ファイル名}-convertted.xml`が出力されます。

