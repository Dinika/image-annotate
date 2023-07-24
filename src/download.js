import { save } from "@tauri-apps/api/dialog";
import { downloadDir } from '@tauri-apps/api/path';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { emit, listen } from '@tauri-apps/api/event'

const input = document.querySelector("input")

const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

input.addEventListener("change", (ev) => {
    if (ev.target.files) {
        let file = ev.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function (ev) {
                canvas.width = image.width;
                canvas.height = image.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

            }
        }
    }
})

export function downloadcanvas() {
    var link = document.createElement('a');
    link.download = 'filename.png';
    const dataUrl = document.getElementById('myCanvas').toDataURL()
    link.href = dataUrl
    console.log("Link", link)
    link.click();
    saveImage(dataUrl)
}

const saveImage = async (dataUrl) => {
    const suggestedFilename = "image.png";

    // Save into the default downloads directory, like in the browser
    const filePath = await save({
        defaultPath: (await downloadDir()) + "/" + suggestedFilename,
    });

    console.log('File PAth', filePath)
    const blob = await fetch(dataUrl).then((res) => res.blob());

    const contents = await blob.arrayBuffer();
    // Now we can write the file to the disk
    await writeBinaryFile(filePath, contents);
    // await writeBinaryFile(filePath, await fetch(dataUrl).then((res) => res.blob()));
};

export function buttonclicked() {
    console.log('Start drawing');

    window.addEventListener("mousedown", startDrawing);
    window.addEventListener("mouseup", endDrawing);
    window.addEventListener("mousemove", draw);
}

let drawing = false;

function startDrawing(e) {
    drawing = true;
    context.beginPath();
}

function endDrawing(e) {
    drawing = false;
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY
    }
}

function draw(e) {
    console.log('DRAW');

    if (!drawing) return;
    console.log('DRAW After return');

    let { x, y } = getMousePos(canvas, e);
    context.lineTo(x, y);
    context.stroke();
}
