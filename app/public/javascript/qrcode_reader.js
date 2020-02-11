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
    // self.stopWebcam({video, canvas, ctx});
    let timerInterval;
    fetch('/db/test', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
    }).then((res) => {
      console.log(res);
      return res.json();
    }).then((result) => {
      let icon;
      let title;
      if (result.result == 'success') {
        icon = 'success';
        title = '登録が完了しました。';
      } else if (result.result == 'error') {
        icon = 'question';
        title = '登録に失敗しました。';
      } else if (result.result == 'warning') {
        icon = 'warning';
        title = '登録済みです。';
      }
      Swal.fire({
        title: title,
        timer: 2000,
        icon: icon,
        onBeforeOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            const content = Swal.getContent();
            if (content) {
              const b = content.querySelector('b');
              if (b) {
                b.textContent = Swal.getTimerLeft();
              }
            }
          }, 100);
        },
        onClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          return self.snapshot({video, canvas, ctx});
        }
      });
    });
  }
}

// /**
//  * @description Webカメラの停止処理
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
