"use strict";

const board_canvas = function (p) {
    const CELL_SIZE = 2;
    const W = 320;
    const H = 320;

    let wBoard = []
    let rBoard = []

    let pause = true
    document.getElementById("play-pause").onclick = () => {
        pause = !pause
    }

    let rate = 1
    let rateSlider = document.getElementById("rate")
    rateSlider.oninput = () => {
        rate = p.round(rateSlider.value, 1)
    }
    rateSlider.value = rate

    document.getElementById("step").onclick = () => {
        step()
    }

    document.getElementById("reset").onclick = () => {
        p.setup()
    }

    p.setup = () => {
        p.createCanvas(W * CELL_SIZE, H * CELL_SIZE);
        for (let i = 0; i < W; i++) {
            rBoard[i] = []
            wBoard[i] = []
            for (let j = 0; j < H; j++) {
                rBoard[i][j] = 0
            }
        }

        for (let i = -10; i < 10; i++) {
            for (let j = -10; j < 10; j++) {
                rBoard[W / 2 + i][H / 2 + j] = p.round(p.random())
            }
        }
        p.pixelDensity(1);
    }

    function getWeight(i, j, hood) {
        let hoodW = 7
        let hoodR = 3

        let weight = 0
        for (let x = 0; x < hoodW; x++) {
            for (let y = 0; y < hoodW; y++) {
                let cellX = i - hoodR + x
                let cellY = j - hoodR + y

                if (cellX >= 0 && cellX < W && cellY >= 0 && cellY < H) {
                    weight += rBoard[cellX][cellY] * hood[x][y]
                }
            }
        }
        return weight
    }

    function getCell(i, j) {
        let out = rBoard[i][j]
        let weight0 = getWeight(i, j, hood0) / neighboursN[0]
        let weight1 = getWeight(i, j, hood1) / neighboursN[1]

        if (weight0 >= 0.187 && weight0 <= 0.200) { out = 1 }
        if (weight0 >= 0.343 && weight0 <= 0.580) { out = 0 }
        if (weight0 >= 0.750 && weight0 <= 0.850) { out = 0 }
        if (weight1 >= 0.120 && weight1 <= 0.300) { out = 0 }
        if (weight1 >= 0.440 && weight1 <= 0.700) { out = 1 }
        if (weight0 >= 0.130 && weight0 <= 0.185) { out = 0 }

        return out
    }

    function updateBoard() {
        for (let i = 0; i < W; i++) {
            for (let j = 0; j < H; j++) {
                wBoard[i][j] = getCell(i, j)
            }
        }
    }

    function step() {
        updateBoard()
        let temp = rBoard
        rBoard = wBoard
        wBoard = temp
    }

    function fillPixel(index) {
        for (let x = 0; x < CELL_SIZE; x++) {
            for (let y = 0; y < CELL_SIZE; y++) {
                let offset = 4 * x + 4 * W * CELL_SIZE * y
                p.pixels[index + offset] = 0
                p.pixels[index + offset + 3] = 255
            }
        }
    }

    function drawBoard() {
        p.background('rgba(255,0,0,0.4)');

        p.noStroke();
        p.loadPixels()

        for (let i = 0; i < W; i++) {
            for (let j = 0; j < H; j++) {
                let index = 4 * CELL_SIZE * (j * W * CELL_SIZE + i)
                if (rBoard[i][j] != 0) {
                    fillPixel(index)
                }
            }
        }
        p.updatePixels()
    }

    p.draw = () => {
        drawBoard()
        if (!pause && p.frameCount % p.round(1 / rate) == 0) {
            step()
        }
    }

    p.keyPressed = () => {
        if (p.keyCode == 32) {
            pause = !pause
        } else if (p.keyCode == 39) {
            step()
        } else if (p.keyCode == 8) {
            p.setup()
        }
    }

};

new p5(board_canvas, 'board')
