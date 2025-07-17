const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bgImage = new Image();
bgImage.src = 'background.png'; // Make sure this matches your actual filename

bgImage.onload = () => {
  canvas.width = bgImage.width;
  canvas.height = bgImage.height;
  ctx.drawImage(bgImage, 0, 0);
};

