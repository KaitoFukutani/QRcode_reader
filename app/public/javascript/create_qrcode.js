function createQrCode(id, status) { // eslint-disable-line
  const QRCode = require('qrcode');
  const day = new Date();
  const test = '1';
  const testdata = {
    day: day,
    id: test,
  };
  const insert = JSON.stringify(testdata);
  QRCode.toFile('../image/test.png', insert);
}