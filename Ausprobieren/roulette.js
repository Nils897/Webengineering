const canvas = document.getElementById("TestCanvas");
const ctx = canvas.getContext("2d");
ctx.globalCompositeOperation = "source-over";

let centerX = canvas.width / 2,  centerY = canvas.height / 2, radius = 200;
let startAngle = 0;
let endAngle = Math.PI * 2;
let step = (1 / 19) * Math.PI;
let angle = 0;

for(let index = 0; index <= 37; index++) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, angle, angle + step, false);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.strokeStyle = "#9a8600";
    ctx.lineWidth = 10;
    if (index === 0 || index === 19) {
        ctx.fillStyle = "#00ff00";
    }
    else if (index % 2 === 0) {
        ctx.fillStyle = "#FF0000";
    }
    else {
        ctx.fillStyle = "#000000";
    }
    ctx.stroke();
    ctx.fill();
    angle += step;
}

ctx.beginPath();
ctx.arc(centerX, centerY, 150, 0, Math.PI * 2, false);
ctx.fillStyle = "#226500";
ctx.fill();

function animate() {
    x += 2;
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(x, 100, 50, 50);

    requestAnimationFrame(animate);
}
//let x = 0;