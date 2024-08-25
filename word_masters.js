const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";
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

function getWordInRow(row) {
    let word = '';

    for (i = 0; i < row.childElementCount; i++) {
        let letter = row.children[i].value;
        word += letter
    }
    console.log('word guessed', word);
    return word;
}

function rejectGuess(row) {
    const inputsToHighlight = row.querySelectorAll("input");
    console.log("highlight", inputsToHighlight);
    for (i = 0; i < inputsToHighlight.length; i++) {
        let input = inputsToHighlight[i];
        input.style.border = "3px solid red";
        setTimeout(function () {input.style.border = "3px solid rgb(201, 196, 196)"}, 500);
    }
}

async function validateIsWord(word, row) {
    const postRequest = {
        method: "POST",
        body: JSON.stringify({
            "word": word
        })
    };
    const promise = await fetch(VALIDATE_WORD_URL, postRequest);
    const processedResponse = await promise.json();
    console.log(processedResponse);
    const isWord = processedResponse.validWord;
    console.log(isWord);

    if (isWord) {
        console.log('validate guess');
        validateIsGuess(word);
    } else {
        rejectGuess(row);
    }
}

function handleEnter(event) {
    console.log('handling enter');
    console.log('enter event', event);

    const currentRow = event.target.parentElement;
    console.log('currentRow', currentRow);
    const currentInput = event.target;

    if (currentInput === currentRow.lastElementChild) {
        const wordGuessed = getWordInRow(currentRow);
        validateIsWord(wordGuessed, currentRow);

        const nextRow = currentRow.nextElementSibling;
        console.log('next row', nextRow);

        if (!nextRow) {
            gameOver();
        } else {
            const newRowFirstInput = nextRow.firstElementChild;
            console.log('new input', newRowFirstInput);
            newRowFirstInput.focus();
        }
    }

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

    if (key === "Backspace") {
        handleBackspace(event);
        event.preventDefault();
        return;
    } else if (key === "Enter") {
        handleEnter(event);
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