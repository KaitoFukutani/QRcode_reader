const QRCode = require('qrcode');

function createQrCode(id) { // eslint-disable-line
  const day = new Date();
  const test = '1';
  const testdata = {
    day: day,
    id: test,
  };
  const insert = JSON.stringify(testdata);
  alert(insert)
  QRCode.toFile('../image/test.png', insert);
}