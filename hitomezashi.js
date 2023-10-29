"use strict";

/**
 * Generate an array of random zeroes (0) and ones (1)
 * @param {number} length 
 * @returns {number[]}
 */
function generatePattern(length) {
    return new Array(length).fill(0).map(_ => (Math.random() >= 0.5) ? 1 : 0);
}

/**
 * Draw an entire line of colored squares of width at point y based on the given pattern.
 * Uses the colors defined in the colors array.
 * @param {*} ctx 
 * @param {number} y 
 * @param {number} width 
 * @param {number[]} pattern 
 * @param {number} singleLength 
 * @param {string[]} colors
 */
function colorLine(ctx, y, width, pattern, singleLength, colors) {
    let x = 0;
    let previous = 0;
    let colorIndex = 0;
    pattern.forEach(valX => {
        // If previous is 1, that means there is a line between this cell and the cell left of it.
        // This means the color needs to change between the cells.
        if (previous === 1) {
            colorIndex = (colorIndex + 1) % colors.length;
        }
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x, y, width, width);
        x += singleLength;
        previous = valX;
    });
}

/**
 * Draw a field of rectangles with side singleLength according to the given patterns.
 * @param {*} ctx 
 * @param {number[]} horizontalPattern 
 * @param {number[]} verticalPattern 
 * @param {number} singleLength 
 */
function drawRects(ctx, horizontalPattern, verticalPattern, singleLength) {
    const w = singleLength+0.5
    let colors = ["crimson", "cornflowerblue"];

    let y = 0;
    let previous = 0;
    verticalPattern.forEach((valY, i) => {
        // If previous is 1, that means there is a line between this cell and the cell above it.
        // This means the color needs to change between the cells.
        if (previous === 1) {
            colors.reverse();
        }

        let pattern = []
        if (i % 2 !== 0) {
            pattern = horizontalPattern.map(x => (x === 1) ? 0 : 1);
        } else {
            pattern = horizontalPattern;
        }

        colorLine(ctx, y, w, pattern, singleLength, colors);
        y += singleLength;
        previous = valY;
    });
}

/**
 * Draw a pattern of lines of length singleLength according to the given patterns.
 * @param {*} ctx 
 * @param {number[]} horizontalPattern 
 * @param {number[]} verticalPattern 
 * @param {number} singleLength 
 */
function drawLines(ctx, horizontalPattern, verticalPattern, singleLength) {
    // Set initial canvas settings for drawing lines
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw horizontals
    let h = singleLength+0.5;
    verticalPattern.forEach(value => {
        let initial = (value === 0) ? singleLength : 0;
        for (let w = initial; w < ctx.canvas.width; w += 2*singleLength) {
            ctx.beginPath();
            ctx.moveTo(w, h);
            ctx.lineTo(w+singleLength+1, h);
            ctx.stroke(); 
        }
        h += singleLength;
    })

    // Draw verticals
    let w = singleLength+0.5;
    horizontalPattern.forEach(value => {
        let initial = (value === 0) ? singleLength : 0;
        for (let h = initial; h < ctx.canvas.height; h += 2*singleLength) {
            ctx.beginPath();
            ctx.moveTo(w, h);
            ctx.lineTo(w, h+singleLength+1);
            ctx.stroke(); 
        }
        w += singleLength;
    })
}

/**
 * Draw a hitomezashi pattern of a given amount of subdivisions on the given canvas context.
 * @param {*} ctx 
 * @param {number} subdivisions 
 */
function drawPattern(ctx, subdivisions) {
    const horizontalPattern = generatePattern(subdivisions);
    const verticalPattern = generatePattern(subdivisions);
    const singleLength = Math.min(ctx.canvas.width, ctx.canvas.height) / subdivisions;
    console.log(`Single line length is ${singleLength}`)

    drawRects(ctx, horizontalPattern, verticalPattern, singleLength);
    drawLines(ctx, horizontalPattern, verticalPattern, singleLength);
}

function main() {
    const canvas = document.getElementById('canvas');
    const canvasWidth = 500;
    const canvasHeight = 500;
    const subdivisions = 20;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawPattern(ctx, subdivisions);
}

// Autorun on startup
main();