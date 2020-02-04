const QRCode = require('qrcode');

exports.createQrCode = (id, status) => {
  const day = new Date();
  const fileName = id + '-' + day.getTime() + '.png';
  const insertData = {
    day: day,
    id: id,
    status: status,
  };
  const qrData = JSON.stringify(insertData);
  QRCode.toFile('public/tmp/' + fileName, qrData);
  return fileName;
};
