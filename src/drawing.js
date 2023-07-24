const square = document.getElementById("drawPlace");
const paper = square.getContext("2d");
const strokeColor = "#9ACD32";

let isDrawing = false;
let x;
let y;

export function onDrawClick() {
    document.addEventListener("mousedown", startDrawing);
    document.addEventListener("mousemove", drawLine);
    document.addEventListener("mouseup", stopDrawing);
}

export function onClearDrawingClick() {
    paper.clearRect(0, 0, square.width, square.height);
}

function startDrawing(eventvs01) {
    isDrawing = true;
    x = eventvs01.offsetX;
    y = eventvs01.offsetY;
}

function drawLine(eventvs02) {
    if (isDrawing) {
        document.getElementById("drawPlace").style.cursor = "crosshair";
        var xM = eventvs02.offsetX;
        var yM = eventvs02.offsetY;
        drawing_line(strokeColor, x, y, xM, yM, paper);
        x = xM;
        y = yM;
    }
}

function stopDrawing() {
    isDrawing = false;
    document.getElementById("drawPlace").style.cursor = "default";
}

drawing_line("#FF6347", x - 1, y, x, y, paper);

function drawing_line(color, x_start, y_start, x_end, y_end, board) {
    board.beginPath();
    board.strokeStyle = color;
    board.lineWidth = 2;
    board.moveTo(x_start, y_start);
    board.lineTo(x_end, y_end);
    board.stroke();
    board.closePath();
}