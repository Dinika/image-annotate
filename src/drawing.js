const canvas = document.getElementById("drawPlace");
const temporaryCanvas = document.getElementById("temporary-canvas");
const context = canvas.getContext("2d");
const temporaryContext = temporaryCanvas.getContext("2d");

let rectangleController;
let doodleController;


const strokeColor = "#9ACD32";

let isDrawing = false;
let startX;
let startY;

hideTemporaryCanvas()

export function onDrawClick() {
    removeRectangleListeners();
    doodleController = new AbortController();

    document.addEventListener("mousedown", startDrawing, { signal: doodleController.signal });
    document.addEventListener("mousemove", drawLine, { signal: doodleController.signal });
    document.addEventListener("mouseup", stopDrawing, { signal: doodleController.signal });
}

export function onRectangleClick() {
    removeDoodleListeners();
    rectangleController = new AbortController();

    document.addEventListener("mousedown", handleMouseDown, { signal: rectangleController.signal });
    document.addEventListener("mousemove", handleMouseMove, { signal: rectangleController.signal });
    document.addEventListener("mouseup", handleMouseUp, { signal: rectangleController.signal });
}

export function onClearDrawingClick() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
}

function removeRectangleListeners() {
    console.log('Cleaning rectangle')
    if (rectangleController) {
        rectangleController.abort();
    }
}

function removeDoodleListeners() {
    if (doodleController) {
        doodleController.abort();
    }
}

function handleMouseDown(e) {
    const mouseX = parseInt(e.clientX - canvas.offsetLeft);
    const mouseY = parseInt(e.clientY - canvas.offsetTop);

    // Put your mousedown stuff here
    startX = mouseX;
    startY = mouseY;
    temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
    showTemporaryCanvas();
    isDrawing = true;
}

function handleMouseMove(e) {
    console.log('Mouse Move')
    if (!isDrawing) { return };
    console.log('Mouse Move Drawing')

    const mouseX = parseInt(e.clientX - canvas.offsetLeft);
    const mouseY = parseInt(e.clientY - canvas.offsetTop);

    // Put your mousemove stuff here
    temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
    drawRect(mouseX, mouseY, temporaryContext);

}

function handleMouseUp(e) {
    const mouseX = parseInt(e.clientX - canvas.offsetLeft);
    const mouseY = parseInt(e.clientY - canvas.offsetTop);

    // Put your mouseup stuff here
    isDrawing = false;
    hideTemporaryCanvas();

    drawRect(mouseX, mouseY, context);
}

function drawRect(toX, toY, ctx) {
    ctx.beginPath();
    ctx.rect(startX, startY, toX - startX, toY - startY);
    ctx.stroke();
}

function startRectangle(event) {
    startDrawing(event);
    showTemporaryCanvas();
    temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
}

function stopRectangle(event) {
    stopDrawing();
    hideTemporaryCanvas();

    const mouseX = parseInt(event.clientX - context.offsetLeft);
    const mouseY = parseInt(event.clientY - context.offsetTop);

    drawRectangle(mouseX, mouseY, context);
}

function startDrawing(eventvs01) {
    isDrawing = true;
    startX = eventvs01.offsetX;
    startY = eventvs01.offsetY;
}

function drawLine(eventvs02) {
    if (isDrawing) {
        document.getElementById("drawPlace").style.cursor = "crosshair";
        var xM = eventvs02.offsetX;
        var yM = eventvs02.offsetY;
        drawing_line(strokeColor, startX, startY, xM, yM, context);
        startX = xM;
        startY = yM;
    }
}

function mouseMoveRectangle(event) {
    if (!isDrawing) { return }
    const mouseX = parseInt(event.clientX - canvas.offsetLeft);
    const mouseY = parseInt(event.clientY - canvas.offsetTop);

    temporaryContext.clearRect(0, 0, temporaryCanvas.width, temporaryCanvas.height);
    drawRectangle(mouseX, mouseY, temporaryContext);
}

function drawRectangle(mouseX, mouseY, ctx) {
    ctx.beginPath();
    ctx.rect(startX, startY, mouseX - startX, mouseY - startY);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
    document.getElementById("drawPlace").style.cursor = "default";
}

// drawing_line("#FF6347", x - 1, y, x, y, context);

function drawing_line(color, x_start, y_start, x_end, y_end, board) {
    board.beginPath();
    board.strokeStyle = color;
    board.lineWidth = 2;
    board.moveTo(x_start, y_start);
    board.lineTo(x_end, y_end);
    board.stroke();
    board.closePath();
}

function showTemporaryCanvas() {
    console.log('Showing canvas')
    temporaryCanvas.style.left = '0'
}

function hideTemporaryCanvas() {
    console.log('Hiding canvas')
    temporaryCanvas.style.left = '-5000px';
}