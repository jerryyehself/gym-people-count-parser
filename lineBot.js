
const line_token = '*****';
//Line Bot Token

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var replyToken = data.events[0].replyToken;
  var msg = data.events[0].message.text;

  msg = '運動中心人數'
  if (msg == '運動中心人數') {
    var scriptUrl = 'https://script.google.com/macros/s/*****/exec';
  } else {

  }
  var response = UrlFetchApp.fetch(scriptUrl, {
    method: "post"
  });

  var responseData = JSON.parse(response.getContentText());

  if (responseData) {
    var resault;
    if (msg == '運動中心人數') {
      if (responseData.error) resault = responseData.error
      else resault = "目前淡水國民運動中心泳池人數" + responseData.poolNum + '，健身房人數' + responseData.gymNum;
    }
    Line_Bot(replyToken, resault)
  }
}

function Line_Bot(replyToken, message) {
  var url = 'https://api.line.me/v2/bot/message/reply';

  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + line_token,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),
  });
}

