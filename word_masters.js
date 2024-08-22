const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";

async function getWordOfDay() {
    const promise = await fetch(WORD_OF_DAY_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
}

function setFocus(event) {
    event.focus();
}

function handleBackspace() {

}

function handleEnter() {

}

function handleLetter() {

}

function boxKeyed(event) {
    const key = event.key;
    // handle backspace
    if (key === "backspace") {
        handleBackspace();
    } else if (key === "enter") {
        handleEnter();
    } else if (!isLetter(key)) {
        event.preventDefault();
    } else {
        handleLetter(key);
    }
    }

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function init() {
    // TODO: get word of the day when page loads
    const wordOfDay = await getWordOfDay()

    window.onload = setFocus(document.querySelector("input"));

    const grid = document.querySelector(".grid-boxes");
    grid.addEventListener("keydown", function(event) {
        boxKeyed(event);
    })

}

init()