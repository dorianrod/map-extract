
// http://www.html5canvastutorials.com/advanced/html5-canvas-grayscale-image-colors-tutorial/
function getImageData(canvas) {
	var context = canvas.getContext('2d')
	return context.getImageData(0, 0, canvas.width, canvas.height)
}
  
function grayscaleImageData(imageData) {
	var data = imageData.data
	for (var i = 0; i < data.length; i += 4) {
	  var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2]
	  data[i] = brightness
	  data[i + 1] = brightness
	  data[i + 2] = brightness
	}
	return imageData
}
  
function renderImageData(context, imageData) {
    context.canvas.width = imageData.width
    context.canvas.height = imageData.height
    context.putImageData(imageData, 0, 0)
	return imageData
}

function contrastImage(imgData, contrast){  //input range [-100..100]
    var d = imgData.data;
    contrast = (contrast/100) + 1;  //convert to decimal & shift range: [0..2]
    var intercept = 128 * (1 - contrast);
    for(var i=0;i<d.length;i+=4){   //r,g,b,a
        d[i] = d[i]*contrast + intercept;
        d[i+1] = d[i+1]*contrast + intercept;
        d[i+2] = d[i+2]*contrast + intercept;
    }
    return imgData;
}
  
export function canvasToGrayscale(canvas) {
    renderImageData(canvas.getContext('2d'), contrastImage(grayscaleImageData(getImageData(canvas)), 30));
    /*
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation ='color';
    ctx.fillStyle = "white";
    ctx.globalAlpha = 1;  // alpha 0 = no effect 1 = full effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);*/
}