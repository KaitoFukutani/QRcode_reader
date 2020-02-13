const QRCode = require('qrcode');
require('dotenv').config();

exports.createQrCode = (id, status) => {
  const day = new Date();
  const fileName = id + '-' + day.getTime() + '.png';
  const insertData = {
    key: process.env.QR_KEY,
    id: id,
    status: status,
  };
  const qrData = JSON.stringify(insertData);
  QRCode.toFile('public/tmp/' + fileName, qrData);
  return fileName;
};
