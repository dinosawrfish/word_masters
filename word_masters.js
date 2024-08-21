const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";

async function getWordOfDay() {
    const promise = await fetch(WORD_OF_DAY_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
}

function setFocus(event) {
    event.focus();
}

function playGame(event) {

}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function init() {
    // TODO: get word of the day when page loads
    const wordOfDay = await getWordOfDay()

    window.onload = setFocus(document.querySelector("input"))

    document
        .querySelector(".app")
        .addEventListener("keydown", function(event)
    {
        if (!isLetter(event.key)) {
            event.preventDefault();
        } else {
            playGame(event);
        }
    });

}

init()