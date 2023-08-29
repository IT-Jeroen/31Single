function displayPlayerEntry(){
    const playerDisplay = createElem('div', ['player-display'], 'player-entry');
    
    const playerLabel = createElem('div', ['player-label', 'full-width'], 'input-label');
    const playerLabelText = document.createTextNode('Enter Your Name');
    addChildElement(playerLabel, playerLabelText);
    
    const playerName = createElem('input', ['player-name', 'full-width'], 'player-name');
    playerName.type = 'text';
    playerName.placeholder = 'Player Name';

    const startGameBtn = createElem('div', ['game-btn'], 'start-game-btn');
    startGameBtn.addEventListener('click', ()=>{
        loadGame();
        });

    const startGameTextElem = createElem('div');
    const startGameText = document.createTextNode('Start Game');
    addChildElement(startGameTextElem, startGameText);
    addChildElement(startGameBtn, startGameTextElem);

    addChildElement(playerDisplay, playerLabel);
    addChildElement(playerDisplay, playerName);
    addChildElement(playerDisplay, startGameBtn);

    addChildElement(backgroundElem, playerDisplay);
}

function displayGameResults(name, score){
    const winnerDisplay = createElem('div', ['player-display'], 'winner-display');
    
    const winnerLabel = createElem('div', ['player-label', 'full-width'], 'winner-label');
    const winnerLabelText = document.createTextNode('The Winner !');
    addChildElement(winnerLabel, winnerLabelText);
    
    const winnerName = createElem('input', ['player-name', 'full-width'], 'winner-name');
    winnerName.type = 'text';
    // winnerName.placeholder = `${name} with a score of: ${score}`;
    winnerName.value = `${name} with a score of: ${score}`;
    winnerName.readonly = 'true';

    const restartGameBtn = createElem('div', ['game-btn'], 're-start-game-btn');
    // restartGameBtn.onclick = 'loadGame()';
    restartGameBtn.addEventListener('click', ()=>{
        resetGame();
        });

    const newGameTextElem = createElem('div');
    const newGameText = document.createTextNode('New Game');
    addChildElement(newGameTextElem, newGameText);
    addChildElement(restartGameBtn, newGameTextElem);

    addChildElement(winnerDisplay, winnerLabel);
    addChildElement(winnerDisplay, winnerName);
    addChildElement(winnerDisplay, restartGameBtn);

    addChildElement(backgroundElem, winnerDisplay);
}

function createHoldCardsBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'hold-cards-btn')
    const btnText = document.createTextNode('Hold');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playerHoldEvent(btnElem);

    // addChildElement(backgroundElem, btnElem);

    // btnElem.addEventListener('click',()=>{
    //     playerHold();
    // })

    return btnElem;
}


function createPlayCardsBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'play-cards-btn')
    const btnText = document.createTextNode('Play Cards');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playCardsEvent(btnElem);
    
    // addChildElement(backgroundElem, btnElem);
    
    // btnElem.addEventListener('click',()=>{
    //     playCards();
    // })

    return btnElem;
}


function createSwapBankBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn')
    const btnText = document.createTextNode('Swap Bank');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    swapBankEvent(btnElem, true);
    
    // addChildElement(backgroundElem, btnElem);
    
    // btnElem.addEventListener('click',()=>{
    //     swapBank();
    // })

    return btnElem;
}

function introSwapBankBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn')
    const btnText = document.createTextNode('Swap Bank');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    swapBankEvent(btnElem, false);
    
    // addChildElement(backgroundElem, btnElem);
    
    // btnElem.addEventListener('click',()=>{
    //     swapBank();
    // })

    return btnElem;
}


function createElem(elemType, classNames=[], idName){
    const elem = document.createElement(elemType);

    for (let className of classNames){
        addClassToElement(elem, className);
    }
    
    addIdToElement(elem, idName);

    return elem;
}



// // cardsInGame = Global Variable //
// // matrix0Flipped = Global Variable //
// // deckPos = Global Variable //
// // createDeckElements(cardsInGame, matrix0Flipped, deckPos); //
// function createDeckElements(numDeck, orientation, postion){
//     const deckElems = [];
//     for (let i = 0; i < numDeck; i++){
//         const cardElem = createCard();

//         cardElem.style.transform = `matrix3d(
//             ${orientation[0]},
//             ${orientation[1]},
//             ${orientation[2]},
//             0,
//             ${orientation[3]},
//             ${orientation[4]},
//             0,
//             0,
//             ${orientation[5]},
//             0,
//             ${orientation[6]},
//             0,
//             ${postion.x},
//             ${postion.y},
//             0,
//             1
//             )`; 
        
//         // add hover mouse event //
//         mouseOverEvent(cardElem);
//         // add click card event //
//         cardClickEvent(cardElem);

//         // playFieldElem = Global Variable
//         addChildElement(playFieldElem, cardElem);
//         deckElems.push(cardElem);
//     }
//     return deckElems;
// }


function createDeckElements(){
    const deckElems = [];
    for (let i = 0; i < cardsInGame; i++){
        const cardElem = createCard();

        cardElem.style.transform = `matrix3d(
            ${matrix0Flipped[0]},
            ${matrix0Flipped[1]},
            ${matrix0Flipped[2]},
            0,
            ${matrix0Flipped[3]},
            ${matrix0Flipped[4]},
            0,
            0,
            ${matrix0Flipped[5]},
            0,
            ${matrix0Flipped[6]},
            0,
            ${deckPos.x},
            ${deckPos.y},
            0,
            1
            )`; 
        
        // add hover mouse event //
        mouseOverEvent(cardElem);
        // add click card event //
        cardClickEvent(cardElem);

        // playFieldElem = Global Variable
        addChildElement(playFieldElem, cardElem);
        deckElems.push(cardElem);
    }
    return deckElems;
}


function createCard(){
    const cardElem = createElement('div');
    addClassToElement(cardElem, 'card');

    const frontElem = createElement('div');
    addClassToElement(frontElem, 'front');

    // Sould get a rotation matrix instead of rotateY(180Deg) with the back class //
    const backElem = createElement('div');
    addClassToElement(backElem, 'back');

    addChildElement(cardElem, frontElem);
    addChildElement(cardElem, backElem);

    return cardElem;
}


function createElement(elemType){
    return document.createElement(elemType);
}


function addClassToElement(elem, className){
    elem.classList.add(className);
    
}


function removeClassFromElement(elem, className){
    elem.classList.remove(className);
}


function addIdToElement(elem, idName){
    elem.id = idName;
}


function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem);
}