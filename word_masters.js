const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";

function getWordOfDay() {
    const promise = fetch(WORD_OF_DAY_URL);
    promise
        .then(function (response) {
            const processingPromise = response.json();
            return processingPromise;
        })
        .then(function (processedResponse) {
            const word = processedResponse.word;
            console.log(word);
        })
}

function init() {
    // TODO: get word of the day when page loads
    const wordOfDay = getWordOfDay();
}

init()