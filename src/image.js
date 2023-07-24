import { save } from "@tauri-apps/api/dialog";
import { downloadDir } from '@tauri-apps/api/path';
import { writeBinaryFile } from '@tauri-apps/api/fs';

const canvas = document.getElementById("drawPlace");
const context = canvas.getContext("2d");

export function onImageUpload(event) {
    if (event.target.files) {
        let file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0);
            }
        }
    }
}

export function onImageDownload() {
    var link = document.createElement('a');
    link.download = 'filename.png';
    const dataUrl = canvas.toDataURL();
    link.href = dataUrl;
    link.click();
    saveImage(dataUrl);
}

const saveImage = async (dataUrl) => {
    const suggestedFilename = "image.png";

    // Save into the default downloads directory, like in the browser
    const filePath = await save({
        defaultPath: (await downloadDir()) + "/" + suggestedFilename,
    });

    const blob = await fetch(dataUrl).then((res) => res.blob());

    const contents = await blob.arrayBuffer();
    await writeBinaryFile(filePath, contents);
};
