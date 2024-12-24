export function canvasFixedAspectRatioBounds(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
) {
  const videoAspect = video.videoWidth / video.videoHeight;
  const canvasAspect = canvas.width / canvas.height;

  let offsetWidth, offsetHeight, offsetX, offsetY;

  if (videoAspect > canvasAspect) {
    offsetWidth = canvas.height * videoAspect;
    offsetHeight = canvas.height;
    offsetX = -(offsetWidth - canvas.width) / 2;
    offsetY = 0;
  } else {
    offsetWidth = canvas.width;
    offsetHeight = canvas.width / videoAspect;
    offsetX = 0;
    offsetY = -(offsetHeight - canvas.height) / 2;
  }

  return { offsetWidth, offsetHeight, offsetX, offsetY };
}
