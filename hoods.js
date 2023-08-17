"use strict";

let hoods = []
let hood0 = []
let hood1 = []
let neighboursN = []

const hoods_canvas = function (p) {

    const CELL_SIZE = 20;
    let W
    let H

    let selectedHood = 0
    let hood

    let drawing = false;
    let fillValue = 1;

    function empty() {
        let result = []
        for (let i = 0; i < W; i++) {
            result[i] = []
            for (let j = 0; j < H; j++) {
                result[i][j] = 0
            }
        }
        return result
    }

    function countNeighbours(hood) {
        let count = 0
        for (let i = 0; i < hood.length; i++) {
            for (let j = 0; j < hood.length; j++) {
                count += hood[i][j]
            }
        }
        return count
    }

    function updateHoods(hs) {
        hoods = hs
        hood0 = hoods[0]
        hood1 = hoods[1]
        neighboursN = []
        for (let i = 0; i < hoods.length; i++) {
            neighboursN.push(countNeighbours(hoods[i]))
        }
        localStorage.setItem('hoods', JSON.stringify({ body: hoods }))
    }

    let loadButton = document.getElementById("load")
    loadButton.onclick = () => {
        loadButton.value = null;
    }
    loadButton.onchange = () => {
        let file = loadButton.files[0];
        let fr = new FileReader();
        fr.onload = (e) => {
            let lines = e.target.result;
            updateHoods(JSON.parse(lines).body)
        }
        fr.readAsText(file);
    }

    document.getElementById("clear").onclick = () => {
        hoods[selectedHood] = empty()
        updateHoods(hoods)
    }

    document.getElementById("save").onclick = () => {
        var fileName = "hoods.json";
        var fileContent = JSON.stringify({ body: hoods })
        var file = new Blob([fileContent], { type: 'json' });

        var a = document.createElement('a');
        a.download = fileName;
        a.href = window.URL.createObjectURL(file);
        a.click();
        a.remove()
    }

    function hoodsFromStorage() {
        let hs = JSON.parse(localStorage.getItem('hoods'))
        if (hs) {
            hoods.body
        }
    }

    p.setup = () => {
        let storedHoods = hoodsFromStorage()
        if (storedHoods) {
            hoods = storedHoods
            W = hoods[0].length
            H = hoods[0].length
            updateHoods(hoods)
        } else {
            W = 7
            H = 7
            updateHoods([[
                [0, 0, 1, 1, 1, 0, 0],
                [0, 1, 0, 0, 0, 1, 0],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [0, 1, 0, 0, 0, 1, 0],
                [0, 0, 1, 1, 1, 0, 0]],
            [[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 1, 0, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]]])
        }

        let hoods_select = document.getElementById("hoods-select")
        for (let i = 0; i < hoods.length; i++) {
            let option = document.createElement("option")
            option.innerHTML = i
            hoods_select.appendChild(option)
        }
        hoods_select.selectedIndex = selectedHood
        hoods_select.onchange = () => {
            selectedHood = hoods_select.selectedIndex
        }

        p.createCanvas(W * CELL_SIZE, H * CELL_SIZE);
    }

    function drawCell(p, i, j) {
        let x = i * CELL_SIZE;
        let y = j * CELL_SIZE;
        p.rect(x, y, CELL_SIZE, CELL_SIZE);
    }

    function drawHood() {
        p.background(100);
        p.noStroke();
        for (let i = 0; i < W; i++) {
            for (let j = 0; j < H; j++) {
                let brightness = hood[i][j] * 255
                p.fill(brightness)
                drawCell(p, i, j);
            }
        }

        p.stroke(100)
        for (let i = 0; i < W; i++) {
            p.line(i * CELL_SIZE, 0, i * CELL_SIZE, H * CELL_SIZE)
        }

        for (let j = 0; j < H; j++) {
            p.line(0, j * CELL_SIZE, W * CELL_SIZE, j * CELL_SIZE)
        }
    }

    p.draw = () => {
        hood = hoods[selectedHood]
        let hidden = p.canvas.parentElement.parentElement.hidden
        if (!hidden && drawing) {
            let cellX = p.floor(p.mouseX / CELL_SIZE);
            let cellY = p.floor(p.mouseY / CELL_SIZE);
            if (hood[cellX]) {
                hood[cellX][cellY] = fillValue
                updateHoods(hoods)
            }
        }
        drawHood()
    }

    p.mousePressed = () => {
        let cellX = p.floor(p.mouseX / CELL_SIZE);
        let cellY = p.floor(p.mouseY / CELL_SIZE);
        if (cellX >= 0 && cellX < W && cellY >= 0 && cellY < H) {
            drawing = true;
            if (hood[cellX] && hood[cellX][cellY]) {
                fillValue = 0
            } else {
                fillValue = 1
            }
        }
    }

    p.mouseReleased = () => {
        drawing = false;
    }
};

const c1 = new p5(hoods_canvas, 'hoods-canvas')
