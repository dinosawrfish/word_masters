const WORD_OF_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const VALIDATE_WORD_URL = "https://words.dev-apis.com/validate-word";

async function getWordOfDay() {
    const promise = await fetch(WORD_OF_DAY_URL);
    const processedResponse = await promise.json();
    return processedResponse.word;
}

function handleBackspace(event) {
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

    return word;
}

function rainbowfyHeader() {
    const header = document.querySelector(".header");
    header.classList.add("rainbow");
}

function colorInputs(wordOfDay, wordOfDayCount, row) {
    for (let i = 0; i < 5; i++) {
        let input = row.children[i];
        let letter = input.value;

        if (letter === wordOfDay[i]) {
            input.style.backgroundColor = "green";
            wordOfDayCount[letter]--;
        } else if (wordOfDayCount[letter] > 0) {
            input.style.backgroundColor = "orange";
            wordOfDayCount[letter]--;
        } else {
            input.style.backgroundColor = "grey";
        }
        input.style.color = "white";
    }
}

function getCharCounts(word) {
    let charCounter = {};

    for (let i = 0; i < word.length; i++) {
        if (charCounter[word[i]]) {
            charCounter[word[i]]++;
        } else {
            charCounter[word[i]] = 1;
        }
    }
    return charCounter;
}

function validateGuess(word, wordOfDay, row) {
    wordOfDayCount = getCharCounts(wordOfDay);
    colorInputs(wordOfDay, wordOfDayCount, row);

    return word === wordOfDay
}

function gameOver(wordOfDay) {
    alert(`You lose, the word was ${wordOfDay.toUpperCase()}`);
    document.activeElement.blur();
}

function rejectGuess(row) {
    const inputsToHighlight = row.querySelectorAll("input");
    for (i = 0; i < inputsToHighlight.length; i++) {
        let input = inputsToHighlight[i];
        input.style.border = "3px solid red";
        setTimeout(function () {input.style.border = "3px solid rgb(201, 196, 196)"}, 500);
    }
}

async function validateIsWord(word, row, wordOfDay) {
    const postRequest = {
        method: "POST",
        body: JSON.stringify({
            "word": word
        })
    };
    const promise = await fetch(VALIDATE_WORD_URL, postRequest);
    const processedResponse = await promise.json();
    const isWord = processedResponse.validWord;

    if (isWord) {
        const isGuess = validateGuess(word, wordOfDay, row);
        if (isGuess) {
            alert("You win!")
            document.activeElement.blur();
            rainbowfyHeader();
        } else {
            const nextRow = row.nextElementSibling;

            if (!nextRow) {
                gameOver(wordOfDay);
            } else {
                const newRowFirstInput = nextRow.firstElementChild;
                newRowFirstInput.focus();
            }
        }

    } else {
        rejectGuess(row);
    }
}

function handleEnter(event, wordOfDay) {
    const currentRow = event.target.parentElement;
    const currentInput = event.target;

    if (currentInput === currentRow.lastElementChild) {
        const wordGuessed = getWordInRow(currentRow);
        validateIsWord(wordGuessed, currentRow, wordOfDay);
    }

}

function handleLetter(event) {
    let nextInput = event.target.nextElementSibling;
    if (!nextInput) {
        event.target.value = '';
    } else if (event.target.value.length === event.target.maxLength) {
        nextInput.focus();
    }
}

function boxKeyed(event, wordOfDay) {
    let key = event.key;

    if (key === "Backspace") {
        handleBackspace(event);
        event.preventDefault();
        return;
    } else if (key === "Enter") {
        handleEnter(event, wordOfDay);
    } else if (!isLetter(key)) {
        event.preventDefault();
    } else {
        handleLetter(event);
    }
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

async function init() {
    const wordOfDay = await getWordOfDay()

    document.addEventListener("mousedown", function(event) {
        event.stopPropagation();
        event.preventDefault();
    })

    const firstInput = document.querySelector("input");
    firstInput.focus();

    const grid = document.querySelector(".grid-boxes");
    grid.addEventListener("keydown", function(event) {
        boxKeyed(event, wordOfDay);
    })

}

init()