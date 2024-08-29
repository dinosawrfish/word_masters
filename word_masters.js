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
    console.log("word of day", wordOfDay);

    wordOfDayCount = getCharCounts(wordOfDay);
    console.log(wordOfDayCount);
    colorInputs(wordOfDay, wordOfDayCount, row);

    return word === wordOfDay
}

function gameOver(wordOfDay) {
    alert(`You lose, the word was ${wordOfDay.toUpperCase()}`);
    document.activeElement.blur();
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

async function validateIsWord(word, row, wordOfDay) {
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
        const isGuess = validateGuess(word, wordOfDay, row);
        if (isGuess) {
            alert("You win!")
            document.activeElement.blur();
            rainbowfyHeader();
        } else {
            const nextRow = row.nextElementSibling;
            console.log('next row', nextRow);

            if (!nextRow) {
                console.log('game over word was', wordOfDay);
                gameOver(wordOfDay);
            } else {
                const newRowFirstInput = nextRow.firstElementChild;
                console.log('new input', newRowFirstInput);
                newRowFirstInput.focus();
            }
        }

    } else {
        rejectGuess(row);
    }
}

function handleEnter(event, wordOfDay) {
    console.log('handling enter');
    console.log('enter event', event);

    const currentRow = event.target.parentElement;
    console.log('currentRow', currentRow);
    const currentInput = event.target;

    if (currentInput === currentRow.lastElementChild) {
        const wordGuessed = getWordInRow(currentRow);
        validateIsWord(wordGuessed, currentRow, wordOfDay);
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

function boxKeyed(event, wordOfDay) {
    let key = event.key;
    console.log('focused', event.target);

    if (key === "Backspace") {
        handleBackspace(event);
        event.preventDefault();
        return;
    } else if (key === "Enter") {
        handleEnter(event, wordOfDay);
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
        boxKeyed(event, wordOfDay);
    })

}

init()