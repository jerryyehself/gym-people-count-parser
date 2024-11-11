function getGYMheadcount(e) {

  var maxAttempts = 5;
  var attempts = 0;

  const date = new Date;
  var now = date.getHours()

  if (now <= 5 || now >= 22) {
    if (e == undefined) console.log('非營業時間')
    return JSON.stringify({ error: '非營業時間' });
  }

  var dayOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };

  var timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    hourCycle: "h23"
  };

  var dayStr = date.toLocaleDateString("en-US", dayOptions);
  var dayFormater = dayStr.split('/')
  dayFormater.unshift(dayFormater[2])
  dayFormater.pop()
  dayStr = dayFormater.join('/')
  var timeStr = date.toLocaleTimeString("en-US", timeOptions);

  try {
    const app = UrlFetchApp.fetch('http://www.tssc.tw/')

    var access = app.getResponseCode();

    if (access > 300 || access < 200) {
      Logger.log("連線有問題，錯誤代碼" + access + "，將重新連線")
      var access = app.getResponseCode();
    } else {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("工作表1");

      const $ = Cheerio.load(app.getContentText());

      var poolNum = $('.pool .number-current').text()
      var gymNum = $('.gym .number-current').text()

      sheet.appendRow([dayStr, timeStr, poolNum, gymNum])

      sheet.getRange(2, 2, sheet.getLastRow()).setNumberFormat('HH:mm:ss')

      result = JSON.stringify({ poolNum: poolNum, gymNum: gymNum })
      return result;
    }
  } catch (error) {
    if (error instanceof Error) {
      Logger.log("錯誤訊息：" + error.message);
      return JSON.stringify({ error: "錯誤訊息：" + error.message });
    } else {
      // 若錯誤物件不是 Error 物件，則進行其他處理
      Logger.log("其他錯誤：" + error);
      return JSON.stringify({ error: "其他錯誤：" + error });
    }
  }

}

function doPost(e) {
  var data = getGYMheadcount(e)
  return ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.JSON);
}