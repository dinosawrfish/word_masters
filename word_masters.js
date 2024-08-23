const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
rows = document.querySelectorAll(".row");

async function getWordOfDay() {
    const promise = await fetch(WORD_OF_DAY_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
}

function setFocus(event) {
    event.focus();
}

function handleBackspace(event) {
    console.log('handing backspace');
    event.target.value = '';
    event.target.previousElementSibling.focus();
}

function handleEnter() {

}

function focusNextInput(event) {
    if (event.target.value.length === event.target.maxLength) {
        console.log('refocus');
        event.target.nextElementSibling.focus();
    }
}

function handleLetter(event) {
    console.log("handling letter");
}

function boxKeyed(event) {
    let key = event.key;
    console.log('focused', event.target);
    // handle backspace
    if (key === "Backspace") {
        handleBackspace(event);
        event.preventDefault();
        return;
    } else if (key === "enter") {
        handleEnter();
    } else if (!isLetter(key)) {
        event.preventDefault();
    } else {
        console.log("handle letter", key)
        handleLetter(event);
        focusNextInput(event);
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function init() {
    // TODO: get word of the day when page loads
    const wordOfDay = await getWordOfDay()

    const firstInput = document.querySelector("input");
    setFocus(firstInput);

    const grid = document.querySelector(".grid-boxes");
    grid.addEventListener("keydown", function(event) {
        boxKeyed(event);
    })

}

init()