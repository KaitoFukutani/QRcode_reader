// Webカメラの起動＆ストリーム読込開始処理
function openWebcam(e) {
  // related elements:
  const $root = $("#pane-webcam");
  const canvas = $root.find("[name=canvas]")[0];
  const video = $root.find("[name=video]").show()[0];
  const ctx = canvas.getContext('2d');
  // open webcam device
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  }).then(function(stream) {
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
      video.play();
      self.snapshot({ video, canvas, ctx, });
    };
  }).catch(function(e) {
    alert("ERROR: Webカメラの起動に失敗しました: " + e.message);
  });
}

// 読み込んだストリームからスナップショットを取得＆解析
function snapshot({ video, canvas, ctx, }) {
  const self = this;
  if (!video.srcObject.active) return;
  // Draws current image from the video element into the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = jsQR(imageData.data, imageData.width, imageData.height);
  if (!data) {
      // QRコードのスナップショット画像を解析できるまでリトライ・・・
    setTimeout(() => {
      return self.snapshot({ video, canvas, ctx, }); // retry ...
    }, 800); // NOTE: ここを小さくしすぎるとCPUに負荷が掛かります
  } else {
      // 解析成功！
    if (data) {
      const message = data.data; // QRコードからメッセージを取得
      console.log("message:", message);
    }
    // Webカメラの停止
    self.stopWebcam({ video, canvas, ctx, });
  }
}

// Webカメラの停止処理
function stopWebcam({ video, canvas, ctx }) {
  const self = this;
  if (!video) {
    video = $("[name=video]")[0];
  }
  video.pause();
  stream = video.srcObject;
  // self.stream.getVideoTracks()[0].stop();
  stream.getTracks().forEach(track => track.stop());
  video.src = "";
  $(video).hide();
}