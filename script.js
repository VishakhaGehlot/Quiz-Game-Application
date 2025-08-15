const quizData = [
    {
        type: 'single',
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        type: 'multi',
        question: "Which of the following are programming languages? (Select all that apply)",
        options: ["JavaScript", "HTML", "Python", "CSS", "Java"],
        correct: [0, 2, 4]
    },
    {
        type: 'single',
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1
    },
    {
        type: 'fill',
        question: "The largest planet in our solar system is ______.",
        correct: "jupiter"
    },
    {
        type: 'multi',
        question: "Which of these are fruits? (Select all that apply)",
        options: ["Apple", "Carrot", "Banana", "Potato", "Orange"],
        correct: [0, 2, 4]
    },
    {
        type: 'fill',
        question: "The process by which plants make food using sunlight is called ______.",
        correct: "photosynthesis"
    }
];

let currentQuestion = 0;
let selectedAnswers = [];
let score = 0;
let showResult = false;
let fillInAnswer = '';

function initGame() {
    displayQuestion();
    updateProgress();
    updateScore();
}

function displayQuestion() {
    const current = quizData[currentQuestion];
    document.getElementById('question-text').textContent = current.question;
    document.getElementById('question-counter').textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;

    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';

    const hintText = {
        'single': 'Select one answer',
        'multi': 'Select multiple answers',
        'fill': 'Fill in the blank'
    };
    document.getElementById('question-hint').textContent = hintText[current.type];
    document.getElementById('question-type-text').textContent = hintText[current.type];

    if (current.type === 'single' || current.type === 'multi') {
        current.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.onclick = () => handleOptionClick(index, current.type);

            const optionText = document.createElement('span');
            optionText.textContent = option;

            const rightSection = document.createElement('div');
            rightSection.style.display = 'flex';
            rightSection.style.alignItems = 'center';

            if (current.type === 'multi') {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'checkbox';
                checkbox.checked = selectedAnswers.includes(index);
                checkbox.onchange = () => handleOptionClick(index, current.type);
                rightSection.appendChild(checkbox);
            }

            button.appendChild(optionText);
            button.appendChild(rightSection);
            optionsContainer.appendChild(button);
        });
    } else if (current.type === 'fill') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'fill-input';
        input.placeholder = 'Type your answer here...';
        input.value = fillInAnswer;
        input.oninput = (e) => {
            fillInAnswer = e.target.value;
            updateSubmitButton();
        };
        optionsContainer.appendChild(input);
    }

    updateSubmitButton();
    showResult = false;
    document.getElementById('submit-btn').classList.remove('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('correct-answer-display').classList.add('hidden');
}

function handleOptionClick(index, type) {
    if (showResult) return;

    if (type === 'single') {
        selectedAnswers = [index];
        updateOptionDisplay();
    } else if (type === 'multi') {
        if (selectedAnswers.includes(index)) {
            selectedAnswers = selectedAnswers.filter(i => i !== index);
        } else {
            selectedAnswers.push(index);
        }
        updateOptionDisplay();
    }
    updateSubmitButton();
}

function updateOptionDisplay() {
    const buttons = document.querySelectorAll('.option-button');
    buttons.forEach((button, index) => {
        if (selectedAnswers.includes(index)) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }

        if (quizData[currentQuestion].type === 'multi') {
            const checkbox = button.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = selectedAnswers.includes(index);
            }
        }
    });
}

function updateSubmitButton() {
    const current = quizData[currentQuestion];
    let canProceed = false;

    if (current.type === 'fill') {
        canProceed = fillInAnswer.trim() !== '';
    } else {
        canProceed = selectedAnswers.length > 0;
    }

    document.getElementById('submit-btn').disabled = !canProceed;
}

function submitAnswer() {
    const current = quizData[currentQuestion];
    let isCorrect = false;

    if (current.type === 'single') {
        isCorrect = selectedAnswers[0] === current.correct;
    } else if (current.type === 'multi') {
        const sortedSelected = [...selectedAnswers].sort();
        const sortedCorrect = [...current.correct].sort();
        isCorrect = sortedSelected.length === sortedCorrect.length &&
            sortedSelected.every((val, index) => val === sortedCorrect[index]);
    } else if (current.type === 'fill') {
        isCorrect = fillInAnswer.toLowerCase().trim() === current.correct.toLowerCase();
    }

    if (isCorrect) {
        score++;
        updateScore();
    }

    showResult = true;
    displayResults();

    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('next-btn').classList.remove('hidden');

    const nextBtn = document.getElementById('next-btn');
    nextBtn.textContent = currentQuestion === quizData.length - 1 ? 'Finish Quiz' : 'Next Question';
}

function displayResults() {
    const current = quizData[currentQuestion];
    const buttons = document.querySelectorAll('.option-button');

    buttons.forEach((button, index) => {
        button.classList.add('disabled');
        const rightSection = button.querySelector('div');

        if (current.type === 'single' || current.type === 'multi') {
            if ((current.type === 'single' && index === current.correct) ||
                (current.type === 'multi' && current.correct.includes(index))) {
                rightSection.innerHTML += '<span class="icon check-icon">✓</span>';
            }

            if (selectedAnswers.includes(index) &&
                !((current.type === 'single' && index === current.correct) ||
                    (current.type === 'multi' && current.correct.includes(index)))) {
                rightSection.innerHTML += '<span class="icon x-icon">✗</span>';
            }
        }
    });

    if (current.type === 'fill') {
        const input = document.querySelector('.fill-input');
        input.disabled = true;

        if (fillInAnswer.toLowerCase().trim() !== current.correct.toLowerCase()) {
            document.getElementById('correct-answer-display').classList.remove('hidden');
            document.getElementById('correct-answer-text').textContent = current.correct;
        }
    }
}

function nextQuestion() {
    if (currentQuestion < quizData.length - 1) {
        currentQuestion++;
        selectedAnswers = [];
        fillInAnswer = '';
        displayQuestion();
        updateProgress();
    } else {
        showFinalResults();
    }
}

function showFinalResults() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');

    const percentage = Math.round((score / quizData.length) * 100);
    document.getElementById('final-score').textContent = `${score}/${quizData.length}`;
    document.getElementById('final-percentage').textContent = `${percentage}%`;

    const performanceMessage = document.getElementById('performance-message');
    if (percentage >= 80) {
        performanceMessage.textContent = 'Excellent work! 🎉';
        performanceMessage.className = 'performance-message excellent';
    } else if (percentage >= 60) {
        performanceMessage.textContent = 'Good job! 👍';
        performanceMessage.className = 'performance-message good';
    } else {
        performanceMessage.textContent = 'Keep practicing! 💪';
        performanceMessage.className = 'performance-message practice';
    }
}

function restartQuiz() {
    currentQuestion = 0;
    selectedAnswers = [];
    fillInAnswer = '';
    score = 0;
    showResult = false;

    document.getElementById('quiz-section').classList.remove('hidden');
    document.getElementById('results-section').classList.add('hidden');

    updateScore();
    displayQuestion();
    updateProgress();
}


function updateProgress() {
    const progress = ((currentQuestion + 1) / quizData.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}


function updateScore() {
    document.getElementById('score-badge').textContent = `Score: ${score}`;
}


window.onload = initGame;
