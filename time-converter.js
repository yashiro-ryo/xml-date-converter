const xml2js = require("xml2js");
const fs = require('fs');

const FILE_NAME = '5/05.xml'
const START_HOUR = 0
const START_MIN = 12
const START_SEC = 0

function main() {
  // xmlファイル読み込み
  let xml = fs.readFileSync(FILE_NAME);

  // XMLパース
  xml2js.parseString(xml, parseStringCb);
}

function parseStringCb(error, result) {
  if (error) {
    console.log(error)
  } else {
    onSuccess(result)
  }
}

function onSuccess(result) {
  // 変換後のオブジェクトを出力
  const texts = result.tt.body[0].div[0].p
  const startMillseconds = (START_HOUR * 3600 + START_MIN * 60 + START_SEC) * 1000

  console.log(texts)

  // 文字列の時刻 -> ミリ秒 -> 動画のスタート位置を加算 -> 文字列の時刻に戻す
  texts.forEach((value) => {
    value.$.begin = millisecondsToTimeString(timeStringToMilliseconds(value.$.begin) + startMillseconds)
    value.$.end = millisecondsToTimeString(timeStringToMilliseconds(value.$.end) + startMillseconds)
  })

  console.log(texts)

  // JSONをXMLに戻す
  const builder = new xml2js.Builder();
  const updatedXml = builder.buildObject(result);

  // 更新されたXMLをファイルに書き込む
  fs.writeFile(`converted-${FILE_NAME}`, updatedXml, (err) =>
    console.error(err));
}

main()

//
// utils
//

// 時間の文字列をミリ秒に変換する関数
function timeStringToMilliseconds(timeString) {
  const [hours, minutes, secondsAndMillis] = timeString.split(':');
  const [seconds, milliseconds] = secondsAndMillis.split('.');

  const totalMilliseconds = parseInt(hours) * 3600 * 1000 + parseInt(minutes) * 60 * 1000 + parseInt(seconds) * 1000 + parseInt(milliseconds);
  return totalMilliseconds;
}

// ミリ秒から時間の文字列に変換する関数
function millisecondsToTimeString(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const millis = milliseconds % 1000;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}
