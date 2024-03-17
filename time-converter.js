const xml2js = require("xml2js");
const fs = require('fs');

//
// config
//

const ALL_SUBTITLES_FILENAME = '5/05.xml'
const PART_A_SUBTITLE_FILENAME = '5/05A.xml'
const PART_A_START_AT = 0
const PART_B_SUBTITLE_FILENAME = '5/05B.xml'
const PART_B_START_AT = getMilliSec(0, 20, 55)
const PART_C_SUBTITLE_FILENAME = '5/05C.xml'
const PART_C_START_AT = getMilliSec(0, 39, 38)
const PART_D_SUBTITLE_FILENAME = '5/05D.xml'
const PART_D_START_AT = getMilliSec(0, 59, 50)
const DIST_FILENAME = '5/05_dist.xml'

//
// main
//

async function main() {
  // ビデオ全体の字幕ファイル
  let allSubtitles = fs.readFileSync(ALL_SUBTITLES_FILENAME)
  let partASubtitle = fs.readFileSync(PART_A_SUBTITLE_FILENAME)
  let partBSubtitle = fs.readFileSync(PART_B_SUBTITLE_FILENAME)
  let partCSubtitle = fs.readFileSync(PART_C_SUBTITLE_FILENAME)
  let partDSubtitle = fs.readFileSync(PART_D_SUBTITLE_FILENAME)

  let subtitles = []

  // Aパートの字幕データを取得する
  const convertPartASubtitile = new Promise((resolve, reject) => {
    xml2js.parseString(partASubtitle, (error, result) => {
      if (error) {
        reject(error)
      }

      const texts = result.tt.body[0].div[0].p

      // 文字列の時刻 -> ミリ秒 -> 動画のスタート位置を加算 -> 文字列の時刻に戻す
      texts.forEach((value) => {
        value.$.begin = millisecondsToTimeString(timeStringToMilliseconds(value.$.begin) + PART_A_START_AT)
        value.$.end = millisecondsToTimeString(timeStringToMilliseconds(value.$.end) + PART_A_START_AT)
      })

      resolve(texts)
    })
  })

  // Bパートの字幕データを取得する
  const convertPartBSubtitile = new Promise((resolve, reject) => {
    xml2js.parseString(partBSubtitle, (error, result) => {
      if (error) {
        reject(error)
      }

      const texts = result.tt.body[0].div[0].p

      // 文字列の時刻 -> ミリ秒 -> 動画のスタート位置を加算 -> 文字列の時刻に戻す
      texts.forEach((value) => {
        value.$.begin = millisecondsToTimeString(timeStringToMilliseconds(value.$.begin) + PART_B_START_AT)
        value.$.end = millisecondsToTimeString(timeStringToMilliseconds(value.$.end) + PART_B_START_AT)
      })

      resolve(texts)
    })
  })

  // Bパートの字幕データを取得する
  const convertPartCSubtitile = new Promise((resolve, reject) => {
    xml2js.parseString(partCSubtitle, (error, result) => {
      if (error) {
        reject(error)
      }

      const texts = result.tt.body[0].div[0].p

      // 文字列の時刻 -> ミリ秒 -> 動画のスタート位置を加算 -> 文字列の時刻に戻す
      texts.forEach((value) => {
        value.$.begin = millisecondsToTimeString(timeStringToMilliseconds(value.$.begin) + PART_C_START_AT)
        value.$.end = millisecondsToTimeString(timeStringToMilliseconds(value.$.end) + PART_C_START_AT)
      })

      resolve(texts)
    })
  })

  // Bパートの字幕データを取得する
  const convertPartDSubtitile = new Promise((resolve, reject) => {
    xml2js.parseString(partDSubtitle, (error, result) => {
      if (error) {
        reject(error)
      }

      const texts = result.tt.body[0].div[0].p

      // 文字列の時刻 -> ミリ秒 -> 動画のスタート位置を加算 -> 文字列の時刻に戻す
      texts.forEach((value) => {
        value.$.begin = millisecondsToTimeString(timeStringToMilliseconds(value.$.begin) + PART_D_START_AT)
        value.$.end = millisecondsToTimeString(timeStringToMilliseconds(value.$.end) + PART_D_START_AT)
      })

      resolve(texts)
    })
  })

  // 時刻を一括編集する
  await convertPartASubtitile.then((res) => {
    subtitles = subtitles.concat(res)
    return convertPartBSubtitile
  }).then((res) => {
    subtitles = subtitles.concat(res)
    return convertPartCSubtitile
  }).then((res) => {
    subtitles = subtitles.concat(res)
    return convertPartDSubtitile
  }).then((res) => {
    subtitles = subtitles.concat(res)
  })

  xml2js.parseString(allSubtitles, (error, result) => {
    if (error) {
      console.error(error)
      return
    }

    result.tt.body[0].div[0].p = subtitles

    // JSONをXMLに戻す
    const builder = new xml2js.Builder();
    const updatedXml = builder.buildObject(result);

    // 更新されたXMLをファイルに書き込む
    fs.writeFile(DIST_FILENAME, updatedXml, (err) =>
      console.error(err));
  })
}

main()

//
// utils
//

function getMilliSec(hour, min, sec) {
  return (hour * 3600 + min * 60 + sec) * 1000
}

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
