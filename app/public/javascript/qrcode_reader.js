/**
 * @description Webカメラの起動＆ストリーム読込開始処理
 * @param {event} e
 */
function openWebcam(e) { // eslint-disable-line
  // related elements:
  const $root = $('#pane-webcam');
  const canvas = $root.find('[name=canvas]')[0];
  const video = $root.find('[name=video]').show()[0];
  const ctx = canvas.getContext('2d');
  // open webcam device
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  }).then(function(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
      self.snapshot({video, canvas, ctx});
    };
  }).catch(function(e) {
    alert('ERROR: Webカメラの起動に失敗しました: ' + e.message);
  });
}

/**
 * @description 読み込んだストリームからスナップショットを取得＆解析
 */
function snapshot({video, canvas, ctx}) { // eslint-disable-line
  const self = this;
  if (!video.srcObject.active) return;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = jsQR(imageData.data, imageData.width, imageData.height);
  if (!data) {
    setTimeout(() => {
      return self.snapshot({video, canvas, ctx});
    }, 800);
  } else {
    if (data) {
      const message = data.data;
      console.log('message:', message);
    }
    self.stopWebcam({video, canvas, ctx});
  }
}

/**
 * @description Webカメラの停止処理
 */
function stopWebcam({ video, canvas, ctx}) { // eslint-disable-line
  if (!video) {
    video = $('[name=video]')[0];
  }
  video.pause();
  stream = video.srcObject;
  stream.getTracks().forEach((track) => track.stop());
  video.src = '';
  $(video).hide();
}
