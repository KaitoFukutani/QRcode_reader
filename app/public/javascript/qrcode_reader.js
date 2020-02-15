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
  const QRdata = jsQR(imageData.data, imageData.width, imageData.height);
  if (!QRdata) {
    setTimeout(() => {
      return self.snapshot({video, canvas, ctx});
    }, 800);
  } else {
    // webカメラ停止処理呼び出し
    // 連続して読み込むため使用していない
    // self.stopWebcam({video, canvas, ctx});
    let timerInterval;
    fetch('/db/addattendance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        QRdata: QRdata,
      }),
    }).then((res) => {
      return res.json();
    }).then((result) => {
      let icon;
      let title;
      let sound;
      let soundFlg = 0;
      if (result.result == 'success') {
        icon = 'success';
        title = '登録が完了しました。';
        sound = new Audio('../sound/success.mp3');
      } else if (result.result == 'error') {
        icon = 'error';
        title = '登録に失敗しました。';
        sound = new Audio('../sound/error.mp3');
      } else if (result.result == 'warning') {
        icon = 'warning';
        title = '登録済みです。';
        sound = new Audio('../sound/warning.mp3');
      } else if (result.result == 'question') {
        icon = 'question';
        title = '不明なQRコードです。';
        sound = new Audio('../sound/question.mp3');
      }
      Swal.fire({
        title: title,
        timer: 2000,
        icon: icon,
        onBeforeOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            const content = Swal.getContent();
            if (!soundFlg) {
              sound.play();
              soundFlg = 1;
            }
            if (content) {
              const b = content.querySelector('b');
              if (b) {
                b.textContent = Swal.getTimerLeft();
              }
            }
          }, 200);
        },
        onClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          return self.snapshot({video, canvas, ctx});
        }
      });
    });
  }
}

// /**
//  * @description Webカメラの停止処理。連続して読み込むため使用していない。
//  */
// function stopWebcam({ video, canvas, ctx}) { // eslint-disable-line
//   if (!video) {
//     video = $('[name=video]')[0];
//   }
//   video.pause();
//   stream = video.srcObject;
//   stream.getTracks().forEach((track) => track.stop());
//   video.src = '';
//   $(video).hide();
// }
