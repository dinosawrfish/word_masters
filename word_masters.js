const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";

async function getWordOfDay() {
    const promise = await fetch(WORD_OF_DAY_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
}

function setFocus(event) {
    event.focus();
}

function guessAWord(inputs) {
    console.log('guess a word')
    console.log(inputs);
    inputs.forEach(function(input) {
        input.addEventListener("keydown", function(event) {
            if (!isLetter(event.key)) {
                event.preventDefault();
            } else if (input.value.length === 1) {
                console.log('refocus')
                input.nextElementSibling.focus();
            }
        });
    });
}

function playGame() {
    inputRows = document.querySelectorAll(".row");

    inputRows.forEach(function(row) {
        inputs = row.querySelectorAll(".col");
        guessAWord(inputs);
    });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function init() {
    // TODO: get word of the day when page loads
    const wordOfDay = await getWordOfDay()

    window.onload = setFocus(document.querySelector("input"))

    playGame()

}

init()