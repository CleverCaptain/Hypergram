function downloadCanvas() {
    let image = document.getElementById("canvas").toDataURL();
    let tmpLink = document.createElement('a');
    tmpLink.download = 'result.png';
    tmpLink.href = image;
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
}

window.onload = function () {
    console.log("running");
    const canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    let fileInput = document.getElementById("file-input");
    let originalImage, originalPixels
    fileInput.addEventListener('change',function (ev) {
        console.log("happened");
        if (ev.target.files) {
            let file = ev.target.files[0]
            console.log("file loaded");
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                let image = new Image();
                image.src = e.target.result;
                image.onload = function (ev) {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx.drawImage(image, 0, 0);
                    function assignment() {
                        originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        originalPixels = originalImage.data;
                        console.log(originalPixels);
                        console.log("reading...");
                    }

                    setTimeout(assignment, 500);
                };
            };
            // console.log(pixels);
        }
    });
    canvas.onclick = function () {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        console.log(pixels);
        // for (let i = 0; i < 900; i++) {
        //     console.log([pixels[i * 4], pixels[i * 4 + 1], pixels[i * 4 + 2], pixels[i * 4 + 3]]);
        //     console.log(pixels[i]);
        // }
    };
    let brightness = document.getElementById("brightness");
    let contrast = document.getElementById("contrast");
    let transparency = document.getElementById("transparent");
    let saveButton = document.getElementById("save-button");

    function Truncate(x) {
        if (x < 0) {
            x = 0;
        }
        if (x > 255) {
            x = 255;
        }
        return x;
    }

    function editImage() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let trans = Number(transparency.value);
        let index = 0;
        // console.log(val);
        let cont = Number(contrast.value);
        const factor = 259 * (255 + cont) / (255 * (259 - cont));
        let bright = Number(brightness.value);
        while (index < pixels.length) {
            if (index % 4 === 3) {
                pixels[index] = originalPixels[index] * trans;
            } else {
                pixels[index] = Truncate(factor * (originalPixels[index] - 128) + 128 + bright);
            }
            index++;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    contrast.addEventListener("change", editImage);
    brightness.addEventListener("change", editImage);
    transparency.addEventListener("change", editImage);

    // if (window.innerWidth < window.innerHeight) {
    //     for (let elementsByClassNameElement of document.getElementsByClassName("slider")) {
    //         elementsByClassNameElement.addEventListener("change", function () {
    //             elementsByClassNameElement.style.width = "300%"
    //
    //         });
    //     }
    // }
};
