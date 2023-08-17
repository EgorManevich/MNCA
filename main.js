"use strict";

let hoods_container = document.getElementById("hoods-container")
hoods_container.hidden = true

let edit_hoods_button = document.getElementById("edit-hoods")

edit_hoods_button.onclick = () => {
    if (hoods_container.hidden) {
        hoods_container.hidden = false
    } else {
        hoods_container.hidden = true
    }
}
