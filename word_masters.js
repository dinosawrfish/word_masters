const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
rows = document.querySelectorAll(".row");

async function getWordOfDay() {
    const promise = await fetch(WORD_OF_DAY_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
}

function handleBackspace(event) {
    console.log('handing backspace');
    event.target.value = '';
    const previousInput = event.target.previousElementSibling;
    if (previousInput) {
        event.target.previousElementSibling.focus();
    }
}

function handleEnter() {
    console.log('handling enter');
}

function handleLetter(event) {
    console.log("handling letter");
    let nextInput = event.target.nextElementSibling;
    if (!nextInput) {
        console.log('no next');
        event.target.value = '';
    } else if (event.target.value.length === event.target.maxLength) {
        console.log('move to next');
        nextInput.focus();
    }
}

function boxKeyed(event) {
    let key = event.key;
    console.log('focused', event.target);
    // handle backspace
    if (key === "Backspace") {
        handleBackspace(event);
        event.preventDefault();
        return;
    } else if (key === "Enter") {
        handleEnter();
    } else if (!isLetter(key)) {
        event.preventDefault();
    } else {
        console.log("handle letter", key)
        handleLetter(event);
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function init() {
    // TODO: get word of the day when page loads
    const wordOfDay = await getWordOfDay()

    const firstInput = document.querySelector("input");
    console.log(firstInput);
    firstInput.focus();
    //setFocus(firstInput);

    const grid = document.querySelector(".grid-boxes");
    grid.addEventListener("keydown", function(event) {
        boxKeyed(event);
    })

}

init()