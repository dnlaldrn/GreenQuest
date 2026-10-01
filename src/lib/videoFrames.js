export async function extractFrames(file, count = 8) {
  const url = URL.createObjectURL(file);
  const video = document.createElement('video');
  video.src = url; video.muted = true; video.playsInline = true;
  await new Promise(r => (video.onloadedmetadata = r));

  const canvas = document.createElement('canvas');
  const scale = 640 / video.videoWidth;
  canvas.width = 640;
  canvas.height = Math.round(video.videoHeight * scale);
  const ctx = canvas.getContext('2d');

  const frames = [];
  for (let i = 0; i < count; i++) {
    video.currentTime = (video.duration * (i + 0.5)) / count;
    await new Promise(r => (video.onseeked = r));
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    frames.push(canvas.toDataURL('image/jpeg', 0.7).split(',')[1]);
  }
  URL.revokeObjectURL(url);
  return { frames, duration: video.duration };
}