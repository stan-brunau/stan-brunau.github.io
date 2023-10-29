"use strict";

/**
 * Get the right and bottom edge values for a given coordinate.
 * @param {number} x
 * @param {number} y 
 * @param {number[]} horizontalPattern
 * @param {number[]} verticalPattern
 * @returns {{ right: number; bottom: number; }}
 */
function getEgdeValues(x, y, horizontalPattern, verticalPattern) {
    return {
        right: (horizontalPattern[x] + y) % 2,
        bottom: (verticalPattern[y] + x) % 2,
    }
}

/**
 * Generate an array of random zeroes (0) and ones (1)
 * @param {number} length 
 * @returns {number[]}
 */
function generatePattern(length) {
    return new Array(length).fill(0).map(_ => (Math.random() >= 0.5) ? 1 : 0);
}

/**
 * Calculate a full 2D array of edge values for the given patterns.
 * Supports only square 2D arrays for now
 * @param {number[]} horizontalPattern 
 * @param {number[]} verticalPattern
 * @returns {{ right: number; bottom: number; }[][]}
 */
function calculateEdgeMap(horizontalPattern, verticalPattern) {
    let len = horizontalPattern.length;
    let edgeMap = Array(len).fill(0).map(_ => Array(len).fill(0));
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len; j++) {
            edgeMap[i][j] = getEgdeValues(j, i, horizontalPattern, verticalPattern);
        }
    }
    return edgeMap;
}

/**
 * Calculate an array of booleans representing the color value of each
 * cell in that row.
 * @param {{ right: number; bottom: number; }[]} edgeLine 
 * @param {boolean} colorBelow 
 * @returns {boolean[]}
 */
function calculateColorLine(egdeLine, colorBelow) {
    let previous = colorBelow;
    let rightsLine = egdeLine.map(x => x.right);
    let colorLine = new Array(rightsLine.length).fill(0);
    for (let i = rightsLine.length-1; i >= 0; i--) {
        // For the last element in the row (first iteration), ignore the value of rightsLine
        if (i === rightsLine.length-1) {
            colorLine[i] = previous;
        } else {
            colorLine[i] = (rightsLine[i] === 1) ? !previous : previous;
        }
        previous = colorLine[i];
    }
    return colorLine;
}

/**
 * Calculate a 2D array of booleans representing the color value of each
 * cell in the grid.
 * @param {{ right: number; bottom: number; }[][]} edgeMap 
 * @returns {boolean[][]}
 */
function calculateColorMap(edgeMap) {
    let colorBelow = false;
    let colorMap = new Array(edgeMap.length).fill(0);
    for (let i = edgeMap.length-1; i >= 0; i--) {
        let len = edgeMap[i].length;
        let colorLine = calculateColorLine(
            edgeMap[i],
            (edgeMap[i][len-1].bottom === 1 ) ? !colorBelow : colorBelow
        );
        colorMap[i] = colorLine
        colorBelow = colorLine[colorLine.length-1];
    }
    return colorMap;
}

/**
 * Draw an entire line of colored squares of width at point y based on the given pattern.
 * Uses the colors defined in the colors array.
 * @param {*} ctx 
 * @param {number} y 
 * @param {boolean[]} colorLine
 * @param {number} singleLength 
 * @param {string[]} colors
 */
function drawColorLine(ctx, y, colorLine, singleLength, colors) {
    const w = singleLength+0.5
    let x = 0;
    colorLine.forEach(colorX => {
        ctx.fillStyle = colors[(colorX === true) ? 1 : 0];
        ctx.fillRect(x, y, w, w);
        x += singleLength;
    });
}

/**
 * Draw a field of rectangles with side singleLength according to the given patterns.
 * @param {*} ctx 
 * @param {boolean[][]} colorMap
 * @param {number} singleLength 
 * @param {string[]} colors
 */
function drawColorMap(ctx, colorMap, singleLength, colors) {
    let y = 0;
    colorMap.forEach(colorLine => {
        drawColorLine(ctx, y, colorLine, singleLength, colors);
        y += singleLength;
    });
}

/**
 * Draw a checkered horizontal line according to the pattern in row.
 * Every sub-line has length singleLength
 * @param {*} ctx 
 * @param {number} y 
 * @param {number[]} row 
 * @param {number} singleLength 
 */
function drawHorizontals(ctx, y, row, singleLength) {
    let x = 0;
    row.forEach(value => {
        if (value === 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x+singleLength+1, y);
            ctx.stroke();
        }
        x += singleLength;
    })
}

/**
 * Draw a checkered vertical line according to the pattern in row.
 * Every sub-line has length singleLength
 * @param {*} ctx 
 * @param {number} x
 * @param {number[]} column
 * @param {number} singleLength 
 */
function drawVerticals(ctx, x, column, singleLength) {
    let y = 0;
    column.forEach(value => {
        if (value === 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y+singleLength+1);
            ctx.stroke();
        }
        y += singleLength;
    })
}

/**
 * Draw a pattern of lines of length singleLength according to the given edge map.
 * @param {*} ctx 
 * @param {{ right: number; bottom: number; }[][]} edgeMap
 * @param {number} singleLength 
 */
function drawEdges(ctx, edgeMap, singleLength) {
    // Set initial canvas settings for drawing lines
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw horizontals
    let y = singleLength+0.5;
    edgeMap.forEach(edgeRow => {
        let bottomsRow = edgeRow.map(x => x.bottom);
        drawHorizontals(ctx, y, bottomsRow, singleLength);
        y += singleLength;
    })

    // Draw verticals
    let x = singleLength+0.5;
    for (let i = 0; i < edgeMap[0].length; i++) {
        let edgeColumn = []
        for (let j = 0; j < edgeMap.length; j++) {
            edgeColumn.push(edgeMap[j][i]);
        }
        let rightsColumn = edgeColumn.map(x => x.right);
        drawVerticals(ctx, x, rightsColumn, singleLength);
        x += singleLength;
    }
}

/**
 * Draw a hitomezashi pattern of a given amount of subdivisions on the given canvas context.
 * @param {*} ctx 
 * @param {number} subdivisions 
 */
function drawPattern(ctx, horizontalPattern, verticalPattern, singleLength, colors) {
    const edgeMap = calculateEdgeMap(horizontalPattern, verticalPattern);
    const colorMap = calculateColorMap(edgeMap);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawColorMap(ctx, colorMap, singleLength, colors);
    drawEdges(ctx, edgeMap, singleLength);
}

const canvas = document.getElementById('canvas');
const color1Picker = document.getElementById('color1');
const color2Picker = document.getElementById('color2');
const newButton = document.getElementById('new-button');
const canvasWidth = 500;
const canvasHeight = 500;
const subdivisions = 20;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

let horizontalPattern = generatePattern(subdivisions);
let verticalPattern = generatePattern(subdivisions);
const singleLength = Math.min(canvasWidth, canvasHeight) / subdivisions;

let ctx = canvas.getContext("2d");
// Automatically run once on startup
drawPattern(ctx, horizontalPattern, verticalPattern, singleLength, [color1Picker.value, color2Picker.value]);

newButton.addEventListener("click", (event) => {
    horizontalPattern = generatePattern(subdivisions);
    verticalPattern = generatePattern(subdivisions);
    drawPattern(ctx, horizontalPattern, verticalPattern, singleLength, [color1Picker.value, color2Picker.value]);
})
color1Picker.addEventListener("input", (event) => {
    drawPattern(ctx, horizontalPattern, verticalPattern, singleLength, [event.target.value, color2Picker.value]);
})
color2Picker.addEventListener("input", (event) => {
    drawPattern(ctx, horizontalPattern, verticalPattern, singleLength, [color1Picker.value, event.target.value]);
})