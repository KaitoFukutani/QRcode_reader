const QRCode = require('qrcode');
require('dotenv').config();

exports.createQrCode = (id, status) => {
  const day = new Date();
  const checkDay = day.getTime();
  day.setHours(day.getHours() + 9);
  const fileName = id + '-' + checkDay + '.png';
  const insertData = {
    key: process.env.QR_KEY,
    id: id,
    status: status,
    date: day,
    checkDate: checkDay,
  };
  const qrData = JSON.stringify(insertData);
  QRCode.toFile('public/tmp/' + fileName, qrData);
  return fileName;
};
