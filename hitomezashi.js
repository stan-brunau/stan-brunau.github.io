function drawPattern(ctx, canvasWidth, canvasHeight, singleLength) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw horizontals
    for (let h = singleLength+0.5; h < canvasHeight; h += singleLength) {
        let rnd = Math.floor(Math.random() * 10); // 0-9
        let initialVal = (rnd % 2) ? singleLength : 0;
        for (let w = initialVal; w < canvasWidth; w += 2*singleLength) {
            ctx.beginPath();
            ctx.moveTo(w, h);
            ctx.lineTo(w+singleLength+1, h);
            ctx.stroke(); 
        }
    }

    // Draw verticals
    for (let w = singleLength+0.5; w < canvasWidth; w += singleLength) {
        let rnd = Math.floor(Math.random() * 10); // 0-9
        let initialVal = (rnd % 2) ? singleLength : 0;
        for (let h = initialVal; h < canvasHeight; h += 2*singleLength) {
            ctx.beginPath();
            ctx.moveTo(w, h);
            ctx.lineTo(w, h+singleLength+1);
            ctx.stroke();
        } 
    }
}

function main() {
    const canvas = document.getElementById('canvas');
    const canvasWidth = 500;
    const canvasHeight = 500;
    const subdivisions = 20;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const singleLength = Math.min(canvasWidth, canvasHeight) / subdivisions;
    console.log(`Single line length is ${singleLength}`)

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPattern(ctx, canvasWidth, canvasHeight, singleLength);
}
// Autorun on startup
main();