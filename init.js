const inputs = document.querySelectorAll("input")
const buttonsAsInput = document.querySelectorAll(".buttonFiles")
const gameTable = document.querySelector("#gameTable");
const levels = document.querySelectorAll(".gameLevel")
buttonsAsInput.forEach(button => {
    button.addEventListener("click", function() {
        document.querySelector(`#${this.id}Img`).click()
    })
})
document.querySelector("#resetIcons").addEventListener("click", defaultIcons)
inputs.forEach(input => input.addEventListener("change", setIcon))

function setIcon() {
    const inputField = this
    lsName = this.id
    const reader = new FileReader()
    reader.onload = function() {
        localStorage.setItem(`${lsName}`, reader.result)
        document.querySelector(`#${lsName.substring(0, lsName.length-3)}`).src = reader.result;
    }
    reader.readAsDataURL(inputField.files[0])
}

function defaultIcons() {
    localStorage.setItem("flagImg", "svg/flag.svg")
    localStorage.setItem("bombImg", "svg/bomb.svg")
    document.querySelector("#bomb").src = `svg/chooseBomb.svg`
    document.querySelector("#flag").src = `svg/chooseFlag.svg`

}

function gameStart() {
    if (!localStorage.getItem("bombImg") || !localStorage.getItem("flagImg")) {
        localStorage.setItem("bombImg", "svg/bomb.svg");
        localStorage.setItem("flagImg", "svg/flag.svg")
    }
    if (!localStorage.getItem("level")) {
        showPopup("Choose dificulty level", "close")
    } else {
        changeDisplay("settingsPage", "none")
        changeDisplay("gamePage", "grid")
        changeDisplay("titleHeader", "none")
    }
    switch (localStorage.getItem("level")) {
        case "easy":
            createTable(9, 9, 10)
            setSize(gameTable, "80vh", "80vh")
            break;
        case "medium":
            createTable(16, 16, 40)
            setSize(gameTable, "90vh", "90vh")
            break;
        case "hard":
            createTable(16, 30, 99)
            setSize(gameTable, "90vh", "160vh")
    }
}
let levelsArray = document.querySelectorAll(".gameLevel")
levelsArray.forEach(level => level.addEventListener("click", chooseLevel))

function chooseLevel() {
    localStorage.setItem("level", `${this.id}`)
    console.log(levels)
    for (let i = 0; i < levels.length; i++) {
        levels[i].classList.remove("selectedLevel")
        this.classList.add("selectedLevel")
        if (levels[i].classList.contains("selectedLevel")) {
            levels[i].src = `svg/${levels[i].id}Selected.svg`
        } else {
            levels[i].src = `svg/${levels[i].id}.svg`

        }
    }
}
document.querySelector("#startGame").addEventListener("click", gameStart)

function changeDisplay(id, display) {
    document.querySelector(`#${id}`).style.display = display
}

function setSize(elem, h, w) {
    elem.style.height = h;
    elem.style.width = w
}

function showPopup(message, action) {
    const overlay = document.querySelector("#popup");
    changeDisplay("popup", "flex")
    const popup = document.createElement("div");
    popup.classList.add("popupWindow");
    const popupAction = document.createElement("div")
    popupAction.classList.add("popupAction")
    const actionButton = document.createElement("button");
    const messageBox = document.createElement("div");
    messageBox.classList.add("flex-center", "popupMessage")
    messageBox.innerText = message;
    popupAction.appendChild(actionButton)
    popup.appendChild(messageBox)
    popup.appendChild(popupAction)
    overlay.appendChild(popup)
    if (action === "close") {
        actionButton.innerText = "OK"
        actionButton.addEventListener("click", function() {
            closePopupWindow(overlay)
        }, true)
    } else if (action === "reset") {
        actionButton.innerText = "START NEW GAME"
        actionButton.addEventListener("click", function() {
            localStorage.removeItem("level")
            location.reload()
        })
    }
}

function closePopupWindow(parent) {
    parent.innerHTML = "";
    changeDisplay("popup", "none")
}
