// https://ramlmn.github.io/visualizing-matrix3d/
// https://meyerweb.com/eric/tools/matrix/

/////////////////////////////////////// VARIABLES ///////////////////////////////////////////////

// 0 DEGREE Y-AXIS //
const matrix0 = [1,0,0,0,1,0,1]; // 0 degree z axis
const matrix90 = [0,1,0,-1,0,0,1]; // 90 degree z axis
const matrix180 = [-1,0,0,0,-1,0,1]; // 180 degree z axis
const matrix270 = [0,-1,0,1,0,0,1]; // 270 degree z axis

// 180 DEGREE Y-AXIS //
const matrix0Flipped = [-1,0,0,0,1,0,-1]; // 0 degree z axis
const matrix90Flipped = [0,-1,0,1,0,0,-1]; // 90 degree z axis
const matrix180Flipped = [1,0,0,0,-1,0,-1]; // 180 degree z axis
const matrix270Flipped = [0,1,0,-1,0,0,-1]; // 270 degree z axis

// Cards In Hand Object = "Clubs-8" :{ x: 425, y: 870 }} //
// Keep elem cards-in-hand as well for quicker search ??? (cards-in-hand.length vs cards-in cardsDB.length) //
const players = {
    0: {"name":'Local Player', "location": 'south', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0, 'pass': false, 'active':false, 'auto':false},
    1: {"name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix90Flipped, 'pass': false, 'active':false, 'auto':true},
    2: {"name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix180Flipped, 'pass': false, 'active':false, 'auto':true},
    3: {"name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix270Flipped, 'pass': false, 'active':false, 'auto':true},
    4: {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': matrix0, 'pass': true, 'active':false, 'auto':false},
}

const charValues = {'A':11, 'K':10, 'Q':10, 'J': 10};
// Card in CardsDB = "Clubs-8": Object { elem: div.card, picked:false, access:true, value:8, symbol:'Clubs', icon:'8'} //
const cardsDB = {}; // Generated in dealCards() with addToCardDB()
const numPlayersCards = 3;
const cardsInGame = (Object.keys(players).length) * numPlayersCards;

const backgroundElem = document.getElementById('background');
const playFieldElem = document.getElementById('playfield');
const playCardsBtn = document.getElementById('play-cards-btn');
const holdCardsBtn = document.getElementById('hold-cards-btn');
const swapBankBtn = document.getElementById('swap-bank-btn');

let fieldSize = 1000;
let cardWidth = fieldSize / 8;
let cardHeight = cardWidth * 1.3;
let stackOffset = 25;
let hoverOffsetX = 5;
let hoverOffsetY = 25
let center = fieldSize / 2;
let southTop = fieldSize - cardHeight;
let westTop = (cardHeight - cardWidth) /2;
let northTop = 0;
let eastTop = fieldSize - cardHeight + ((cardHeight - cardWidth) /2);
const deckPos = {'x': center - (cardWidth /2), 'y':center - (cardHeight /2)};
const clickCardOffset = 5;
const cardPickedBank = [];
const cardPickedPlayer = [];
const minBankScore = 28;

/////////////////////////// GAME MECHANICS //////////////////////////////////

function loadGame(){
    const playerName = document.getElementById('player-name');
    const playerEntry = document.getElementById('player-entry');
    const winnerDisplay = document.getElementById('winner-display');

    // Display Elements //
    setTimeout(()=>{
        if (playerEntry){
            players[0].name = playerName.value;
            players[0].auto = false;
            playerEntry.remove();
        }
        if (winnerDisplay){
            winnerDisplay.remove();
        }
        
    }, 500);
    
    // Deal Cards //
    setTimeout(()=>{
        // setCursor('passive');
        dealDeckCards(300);
    }, 1000);

    // only after cards are dealt 
    setTimeout(()=>{
        players[0].active = true;
        enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
        enableDisablePlayHoldBtn(swapBankBtn, 'visible');
        // setCursor('active');
    }, 6000);  
}


function resetGame(){
    // Remove All Cards From Play Field //
    document.querySelectorAll('.card').forEach(card => card.remove());
    // Reset PLayer Settings to default //
    Object.entries(players).forEach(([k,v])=>{
        
        if (players[k].name == 'Bank'){
            players[k].pass = true;
            players[k].active = false;
            players[k]['cards-in-hand'] = {};
        }else{
            players[k].pass = false;
            players[k].active = false;
            players[k]['cards-in-hand'] = {};
        }
    });

    loadGame();

}


function gameContinues(){
    const nonPassPlayers = filterPlayers('pass', [false], false);

    if(JSON.stringify(nonPassPlayers) === '{}'){
        return false;
    }
    return true;
}


let autoCount = 1;
// NEED CHECK FOR WINNER (After playing cards) //
// calculate hand after playing cards //
function nextPlayer(winner=''){
    activateDeactivatePlayer();
    const activePlayer = filterPlayers('active', [true], false);
    
    if (!Object.values(activePlayer)[0].pass){
        if (Object.values(activePlayer)[0].auto){
            const bank = filterPlayers('name', ['Bank'], false);
            // Do automatic things //
            console.log('AUTOPLAYER !!!:', Object.values(activePlayer)[0].name, Object.values(activePlayer)[0].location, autoCount);
            autoCount += 1;
            // players instead of cards in hand ??? //
            const autoPlayerCardsInHand = Object.values(activePlayer)[0]['cards-in-hand'];
            const cardsInBank = Object.values(bank)[0]['cards-in-hand'];
            const autoPickedCards = autoPickACard(autoPlayerCardsInHand, cardsInBank); // return [pickBankCard, dropHandCard]
            const autoPickedBankCard = autoPickedCards[0];
            const autoPickedPlayerCard = autoPickedCards[1];

            console.log('AUTOPLAYER !!!: PickedBank:',autoPickedBankCard, 'PickedHand:', autoPickedPlayerCard);

            if (autoPickedBankCard != 'Take Bank' && autoPickedBankCard != 'Player Pass'){
                swapCards(autoPickedBankCard,autoPickedPlayerCard);
                setTimeout(()=>{
                    nextPlayer();
                     
                 }, 2000);
            }else{
                if (autoPickedBankCard == 'Take Bank'){
                    console.log('Take Bank')
                    swapBank();
                    // swapBank() will execute nextPlayer // No
                    setTimeout(()=>{
                        nextPlayer();
                         
                     }, 2000);
                }
                if (autoPickedBankCard == 'Player Pass'){
                    console.log('Player Pass')
                    playerHold();
                    // playerHold will execute nextPlayer // No
                    setTimeout(()=>{
                        nextPlayer();
                         
                     }, 500);
                }
            }


        } else{
            enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
            enableDisablePlayHoldBtn(swapBankBtn, 'visible');
        }
    }else{
        if(gameContinues()){
            // All players get one last move if winner is declared //
            if (winner){
                Object.values(activePlayer)[0].pass = true;
                nextPlayer(winner);
            }else{
                nextPlayer();
            }
        }else{
            // All Player Hold or Game has a Winner//
            // stopGame(winner);
            
            // TEMP WINNER //
            stopGame('Daddy');
        }
    }
    
}


// Manual Break nextPLayer Loop //
function stopLoop(){
    Object.entries(players).forEach(([k,v])=>{
        players[k].pass = true;
    })
}


function stopGame(winner=''){
    let topScore = 0;

    if (!winner){
        Object.entries(players).forEach(([k,v])=>{
            if (players[k].name != 'Bank'){
                const playerScore = calculateHand(players[k]['cards-in-hand']);
                if (playerScore > topScore){
                    topScore = playerScore;
                    winner = players[k].name;
                }
            }
        })
    }else{
        topScore = 31;
    }


    displayGameResults(winner, topScore);

    // show all cards //
    flipAllCards();

}


function playerAction(action){
    let timing = 0;
    if (action == 'playCards'){
        playCards();
        timing = 2000;
    }
    if (action == 'playerHold'){
        playerHold();
        timing = 250;
    }
    if (action == 'swapBank'){
        swapBank(false);
        timing = 2000;
    }
    setTimeout(()=>{
        // calculateHand // if 31 => nextPlayer(winner)
        nextPlayer();
    },timing); 
}

function playCards(){
    if (cardPickedBank.length == 1 && cardPickedPlayer.length == 1){
        console.log('LOCAL PLAYER Picked Bank:',cardPickedBank[0], 'Picked Hand:', cardPickedPlayer[0])
        swapCards(cardPickedBank[0], cardPickedPlayer[0]);
        enableDisablePlayHoldBtn(playCardsBtn, 'hidden');
        enableDisablePlayHoldBtn(swapBankBtn, 'hidden');  
    }
}


function playerHold(){
    const activePlayer = filterPlayers('active', [true], false);
    Object.values(activePlayer)[0].pass = true;
    console.log('PLAYER PASS:', Object.values(activePlayer)[0].name);

    if (!Object.values(activePlayer)[0].auto){
        enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
        enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
    }
    
}


// Swap Hand with Bank //
function swapBank(hold=true){
    const bank = Object.values(filterPlayers('name', ['Bank'], false))[0];
    const player = Object.values(filterPlayers('active', [true], false))[0];
    const playerHand = Object.keys(player['cards-in-hand']);
    const bankHand = Object.keys(bank['cards-in-hand']);
    console.log('SWAP BANK:', player.name);

    playerHand.forEach((cardID, index)=>{
        swapCards(bankHand[index], cardID);
    })

    if (hold){
        player.pass = true;
    }

    enableDisablePlayHoldBtn(swapBankBtn, 'hidden');
    enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
}


function swapCards(bankCardID,playerCardID){
    const timingRepos = 700;
    const timingCalc = 500;

    const playerLocation = cardsDB[playerCardID].location;
    const player = filterPlayers('location', playerLocation, filterOut=false);
    const playerID = Object.keys(player)[0];

    // const bankID = 4; //
    const bankLocation = cardsDB[bankCardID].location;
    const bank = filterPlayers('location', bankLocation, filterOut=false);
    const bankID = Object.keys(bank)[0];

    // ADD CARD//
    players[playerID]['cards-in-hand'][bankCardID] = players[bankID]['cards-in-hand'][bankCardID];
    players[bankID]['cards-in-hand'][playerCardID] = players[playerID]['cards-in-hand'][playerCardID];

    // REMOVE CARD //
    delete players[playerID]['cards-in-hand'][playerCardID]
    delete players[bankID]['cards-in-hand'][bankCardID];

    // SET CARD ACCESS //
    cardsDB[playerCardID].access = true;
    cardsDB[bankCardID].access = false;

    if(playerLocation == 'south'){
        cardsDB[bankCardID].access = true;
    }

    // RESET //
    cardsDB[bankCardID].location = playerLocation;
    cardsDB[playerCardID].location = bankLocation;
    cardsDB[playerCardID].picked = false;
    cardsDB[bankCardID].picked = false;
    cardPickedBank.pop();
    cardPickedPlayer.pop();

    setTimeout(()=>{
        calcCardPositions(players[playerID]);
        calcCardPositions(players[bankID], stacked=false);
    },timingCalc);

    
    setTimeout(()=>{
        repositionCards([playerID, bankID]);
    },timingRepos);
    
}


function handOutDeckCards(players, timing){
    let i = 0;
    const playersID = Object.keys(players)
    let playerIndex = 0;
    let zIndex = 1;
    let cardIndex = 0;
    let numCardsToDeal = 0;
    

    playersID.forEach(id => {
        numCardsToDeal += Object.keys(players[id]['cards-in-hand']).length;
    })

    const intervalID = setInterval(()=>{
        if (i == numCardsToDeal -1){
            clearInterval(intervalID);
        }
        
        let player = players[`${playersID[playerIndex]}`];
        const cardIds = Object.keys(player['cards-in-hand']);
        const cardId = cardIds[cardIndex];
        const card = player['cards-in-hand'][cardId];
        const orientation = player.orientation;

        // TEMP ELEMENT
        const text = document.createTextNode(cardId);
        const cardElem = cardsDB[cardId].elem;
        const frontElem = cardElem.getElementsByClassName('front');
        addChildElement(frontElem[0], text);
        //

        cardElem.style = `transform: matrix3d(
            ${orientation[0]},
            ${orientation[1]},
            ${orientation[2]},
            0,
            ${orientation[3]},
            ${orientation[4]},
            0,
            0,
            ${orientation[5]},
            0,
            ${orientation[6]},
            0,
            ${card.x},
            ${card.y},
            0,
            1
            ); z-index: ${zIndex};`;
        
        zIndex += 1;
        playerIndex += 1;

        if (playerIndex == playersID.length){
            cardIndex += 1;
            playerIndex = 0;
        }

        i += 1;
    }, timing);
}


function addDeckCardsToPlayers(){
    // players = Global Variable //
    // cardsInGame = Global Variable //
    // matrix0Flipped = Global Variable //
    // deckPos = Global Variable //
    const allCardElems = createDeckElements(cardsInGame, matrix0Flipped, deckPos);

    // Create card values and id's
    const deckCardValues = createRandomDeckValues(allCardElems.length, '7');
    let playersID = Object.keys(players)
    let playerID = 0;

    allCardElems.forEach((cardElem, index) =>{
        // pick a card //
        let cardId = deckCardValues[index];
        
        // add card to DB //
        addCardToCardDB(cardId, cardElem);
        
        // add card to player hand //
        players[`${playerID}`]['cards-in-hand'][cardId] = {'x':0, 'y':0};
        cardsDB[cardId].location = players[`${playerID}`].location;
        
        if (players[`${playerID}`].name == 'Bank' || players[`${playerID}`].location == 'south'){
            cardsDB[cardId].access = true;
        }
        
        playerID += 1;

        if (playerID == Number(playersID[playersID.length-1])+1){
            playerID = 0;
        }
    })  
}

function dealDeckCards(timing){
    // players = Global Variable //
    // cardsInGame = Global Variable //
    const bankPlayer = filterPlayers('name', ['Bank'], false);
    const nonBankPlayers = filterPlayers('name', ['Bank']);
    
    addDeckCardsToPlayers(players);

    // Calculate Card Positions //
    Object.keys(players).forEach(playerID =>{
        if (players[playerID].name == 'Bank'){
            calcCardPositions(players[playerID], stacked=false);
        }else{
            calcCardPositions(players[playerID]);
        }  
    })
    

    handOutDeckCards(nonBankPlayers, timing);
    setTimeout(()=>{
        handOutDeckCards(bankPlayer, timing);
    },(cardsInGame + 1) * timing);
}

//////////////////////////// GAME LOGIC /////////////////////////////////

function checkCardSwapSum(cardsInHand, cardIn, cardOut){
    const cardIDs = Object.keys(cardsInHand);
    cardIDs.push(cardIn);
    const newcardIDs = cardIDs.filter(cardID => cardID != cardOut)
    const newCardsSwap = Object.fromEntries(Object.entries(cardsInHand).filter(([k,v]) => newcardIDs.includes(k)));
    newCardsSwap[cardIn] = null;
    const sum = calculateHand(newCardsSwap);
    return sum;
}



function playerPass(cardsInHand,lowerSumPassLimit){
    const handValue = calculateHand(cardsInHand);
    if (handValue > lowerSumPassLimit){
        return 'Player Pass';
    }
    return 'Keep Playing';
}


// When cardsInHand has no matching icons or symbols //
// Find the combination of playerCard and bankCard with the highest score //
function findCardMatch(cardsInHand, cardsInBank, attr){
    const sortedCardInHandIDs = sortCardByValue(cardsInHand, true) // true returns array of cardIDs only
    let pickBankCard = 'None';
    let keepHandCard = 'None';
    let dropHandCard = 'None';
    let score = 0;

    Object.keys(cardsInHand).forEach(handID =>{
        Object.keys(cardsInBank).forEach(bankID=>{
            if (cardsDB[handID][attr] == cardsDB[bankID][attr]){
                let scoreValue = cardsDB[handID].value + cardsDB[bankID].value;
                if (scoreValue > score){
                    pickBankCard = bankID;
                    keepHandCard = handID;
                    score = scoreValue;
                }
            }
        })
    })

    if (pickBankCard != 'None'){
        dropHandCard = sortedCardInHandIDs[2];
        if (keepHandCard == dropHandCard){
            dropHandCard = sortedCardInHandIDs[1];
        }
    }

    return [pickBankCard, dropHandCard];
}

function findCardMatch2(cardsInHand, cardsInBank, attr){
    let dropHandCard = 'None';
    let pickBankCard = 'None';
    let dropCardAttrInHand = 'None';
    let score = 0;

    const attrCount = cardAttrCount(cardsInHand, attr);
    const chaseAttr = returnAttrFromCount(attrCount, 2, 'min') 
    const dropCardAttr = returnAttrFromCount(attrCount, 1, 'max');

    if (dropCardAttr != 'None'){
        dropCardAttrInHand = findCardIdByAttr(cardsInHand, dropCardAttr, 'low');
    }

    Object.keys(cardsInBank).forEach(bankID =>{
        if (cardsDB[bankID][attr] == chaseAttr){
            let scoreValue = cardsDB[bankID].value;
            if (scoreValue > score){
                pickBankCard = bankID;
                dropHandCard = dropCardAttrInHand;
                score = scoreValue;
            } 
        }
    })

    return [pickBankCard, dropHandCard];
}


function findCardMatch3(cardsInHand, cardsInBank, attr){
    let pickBankCard = 'None';
    let dropHandCard = 'None';
    let score = 0;

    Object.keys(cardsInHand).forEach(handID =>{
        Object.keys(cardsInBank).forEach(bankID=>{
            if (cardsDB[handID][attr] == cardsDB[bankID][attr]){
                if (cardsDB[bankID].value > cardsDB[handID].value && cardsDB[bankID].value > score){
                    pickBankCard = bankID;
                    dropHandCard = handID;
                    score = cardsDB[bankID].value;
                } 
            }
        })
    })

    return [pickBankCard, dropHandCard];
}

// NEEDS A SWAP BANK OUTPUT //
// NEEDS A HOLD OUTPUT //
// NEEDS A NEXT PLAYER EXECUTION ??? ///
function autoPickACard(cardsInHand, cardsInBank){
    const handIconsCount = cardAttrCount(cardsInHand, 'icon');
    const handSymbolsCount = cardAttrCount(cardsInHand, 'symbol');
    const sortedCardInHandIDs = sortCardByValue(cardsInHand, true) // true returns array of cardIDs only
    const sortedCardInBankIDs = sortCardByValue(cardsInBank, true) // true returns array of cardIDs only
    
    const cardsInHandScore = calculateHand(cardsInHand);
    const cardsInBankScore = calculateHand(cardsInBank);
    
    if (cardsInBankScore > cardsInHandScore && cardsInBankScore > minBankScore){
        return ['Take Bank', cardsInBank]
    }

    // 3 unique symbols and 3 unique icons (chase symbols first);
    if (Object.keys(handIconsCount).length == 3 && Object.keys(handSymbolsCount).length == 3){
        // Loop through cards in hand and loop through cards in bank to find the highst score combination by symbol
        let cardsPicked = findCardMatch(cardsInHand, cardsInBank, 'symbol');
        let cardPicked = cardsPicked[0];
        let dropCardInHand = cardsPicked[1];

        // If no matching symbol in bank chase (any) icon
        if (cardPicked == 'None'){
            cardsPicked = findCardMatch(cardsInHand, cardsInBank, 'icon');
            cardPicked = cardsPicked[0];
            dropCardInHand = cardsPicked[1];
        }

        // If no matching icon in bank either chase highest bank card
        if (cardPicked == 'None'){
            cardPicked = sortedCardInBankIDs[0];
            dropCardInHand = sortedCardInHandIDs[2];
        }

        return [cardPicked, dropCardInHand] // [dropHandCard, cardsPicked[0]] [0,1]
    }

    // 1 unique symbol (score 24 - 31) (1 unique icon == 30.5)
    if (Object.keys(handIconsCount).length == 1 || Object.keys(handSymbolsCount).length == 1){
        
        if (cardsInHandScore == 30.5){
            return ['Player Pass', cardsInHand]
        }
        const cardsPicked = findCardMatch3(cardsInHand, cardsInBank, 'symbol');
        // could be removed //
        const cardPicked  = cardsPicked[0];
        const dropCardInHand = cardsPicked[1];

        // if playerScore > X => take a Gamble ? //
        if (cardPicked  == 'None'){
            //playerPass(cardsInHand,lowerSumPassLimit) // returns playerPass
            return ['Player Pass', cardsInHand]
        }

        return [cardPicked , dropCardInHand] //pickedCards; [dropCard, pickCard] [0,1]
    }

    // 2 unique symbols or 2 unique icons (chase icons first)
    if (Object.keys(handIconsCount).length == 2 || Object.keys(handSymbolsCount).length == 2){
        // Chase Icons first
        let cardsPicked = findCardMatch2(cardsInHand, cardsInBank, 'icon');
        let cardPicked = cardsPicked[0];
        let dropCardInHand = cardsPicked[1];
        
        // If no matching icon in bank chase symbol
        if (cardPicked == 'None'){
            cardsPicked = findCardMatch2(cardsInHand, cardsInBank, 'symbol');
            cardPicked = cardsPicked[0];
            dropCardInHand = cardsPicked[1];
        }

        // If no matching icon in bank either, chase highest bank card
        if (cardPicked == 'None'){
            cardPicked = sortedCardInBankIDs[0];
            // Find which card to drop //
            let dropCardAttr = [];
            if (Object.keys(handSymbolsCount).length < Object.keys(handIconsCount).length){
                dropCardAttr = returnAttrFromCount(handSymbolsCount, 1, 'max');
                // dropCardInHand = findCardIdByAttr(cardsInHand, 'symbol', dropCardAttr);
                dropCardInHand = findCardIdByAttr(cardsInHand, dropCardAttr, 'low');
            }else{ // Favour Icons //
                dropCardAttr = returnAttrFromCount(handIconsCount, 1, 'max');
                // dropCardInHand = findCardIdByAttr(cardsInHand, 'icon', dropCardAttr);
                dropCardInHand = findCardIdByAttr(cardsInHand, dropCardAttr, 'low');
            }
        }

        return [cardPicked, dropCardInHand] //[dropCardInHand, cardPicked] [0, 1]
    }
        
}

////////////////////////// GAME MECHANICS HELPER FUNCTIONS /////////////////////////////////

function activateDeactivatePlayer(){
    let activePlayer = null;
    let nextActivePlayer = null;
    
    Object.entries(players).forEach(([k,v])=>{
        if (v.active){
            if (k == 3){
                activePlayer = players[k];
                nextActivePlayer = players[0];
            }
            if (k < 3){
                activePlayer = players[k];
                nextActivePlayer = players[Number(k)+1];
            }
        }
    })
    
    activePlayer.active = false;
    nextActivePlayer.active = true;
}

function flipAllCards(){
    Object.entries(players).forEach(([k,v])=>{
        const location = players[k].location;
        if (location != 'south' && location != 'center'){
        
            let matrixFlipped = []

            if(location == 'west'){
                matrixFlipped = matrix90;
            }

            if(location == 'north'){
                matrixFlipped = matrix180;
            }

            if(location == 'east'){
                matrixFlipped = matrix270;
            }

            const cardsInHand = players[k]['cards-in-hand']
            const cardIDS = Object.keys(cardsInHand);
            calcCardPositions(players[k], stacked=false);
            
            cardIDS.forEach(cardID => {
                const cardElem = cardsDB[cardID].elem;
                const position = cardsInHand[cardID];

                cardElem.style.transform = `matrix3d(
                    ${matrixFlipped[0]},
                    ${matrixFlipped[1]},
                    ${matrixFlipped[2]},
                    0,
                    ${matrixFlipped[3]},
                    ${matrixFlipped[4]},
                    0,
                    0,
                    ${matrixFlipped[5]},
                    0,
                    ${matrixFlipped[6]},
                    0,
                    ${position.x},
                    ${position.y},
                    0,
                    1
                    )`;
            })
        }
        if (location == 'south'){
            calcCardPositions(players[k], stacked=false);
            repositionCards([k]);
        }
    })
}

function enableDisablePlayHoldBtn(elem, state){
    const triggerCondition = elem.getAttribute('class').split(' '); // 'hidden' 'visible'

    if (!triggerCondition.includes(state)){
        if (state == 'hidden'){
            removeClassFromElement(elem, 'visible');
            addClassToElement(elem, 'hidden');
        }
        if (state == 'visible'){
            removeClassFromElement(elem, 'hidden');
            addClassToElement(elem, 'visible');
        }
    } 
}


// Function only used in addDeckCardsToPlayers() //
function addCardToCardDB(cardID, cardElem){
    let splitID = cardID.split('-');
    let cardSymbol = splitID[0];
    let cardIcon = splitID[1];
    let cardValue = Number(cardIcon);

    // charValues is a Global Variable //
    if (!cardValue){
        cardValue = charValues[cardIcon];
    }
    
    cardsDB[cardID] = {'elem': cardElem, 'picked':false, 'access':false, 'value':cardValue,'symbol':cardSymbol, 'icon':cardIcon, 'location':''};
}


function findCardID(cardElem){
    const returnID = Object.keys(cardsDB).filter(cardID => cardsDB[cardID].elem == cardElem)[0];   
    return returnID;
}


function filterPlayers(field, valuesArr, filterOut=true){
    const fieldValue = field.toLowerCase();

    if (fieldValue == 'key'){
        if (filterOut){
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(k)));
        }
        else{
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(k)));
        }
    }
    
    if (filterOut){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(v[fieldValue])));
    } else {
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(v[fieldValue])));
    }
}


function createRandomDeckValues(numCards, minValue='2', maxValue='A'){
    const cardValues = ['2','3','4','5','6','7','8','9','10','J', 'Q', 'K', 'A'];
    const cardSymbols = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

    const min = cardValues.indexOf(minValue);
    const max = cardValues.indexOf(maxValue)+1;
    const cardRange = cardValues.slice(min, max);

    // Can be miss-aligned //
    if (cardRange.length > numCards){
        console.log('Card Value Range not inline with Number of Playing Cards per Player')
    }

    let cardsInGame = [];
    const cardsInDeck = [];

    cardRange.forEach(value => {
        cardSymbols.forEach(symbol => {
            cardsInGame.push(`${symbol}-${value}`);
        })
    })

    // Randomize cards //
    for (let i= 0; i < numCards; i++){
        let pickIndex = Math.floor(Math.random() * (cardsInGame.length));
        cardsInDeck.push(cardsInGame[pickIndex]);
        // Adjust length cardsInGame //
        cardsInGame.splice(pickIndex, 1);
    }

    return cardsInDeck;
}


function repositionCards(playersID){
    let zIndex = 1;

    playersID.forEach(id => {
        const orientation = players[id].orientation;
        const cardsID = Object.keys(players[id]['cards-in-hand'])

        cardsID.forEach(cardID =>{
            const cardElem = cardsDB[cardID].elem;
            const cardPos = players[id]['cards-in-hand'][cardID];
            cardElem.style = `transform: matrix3d(
                ${orientation[0]},
                ${orientation[1]},
                ${orientation[2]},
                0,
                ${orientation[3]},
                ${orientation[4]},
                0,
                0,
                ${orientation[5]},
                0,
                ${orientation[6]},
                0,
                ${cardPos.x},
                ${cardPos.y},
                0,
                1
                ); z-index: ${zIndex};`;
            
            zIndex += 1;
        });
    })
}


function calcCardPositions(player, stacked=true){
    let cardsInHand = player['cards-in-hand'];
    let handWidth = 0;
    let cardOffSet = 0;

    if (stacked){
        handWidth = cardWidth + ((Object.keys(cardsInHand).length -1) * stackOffset);
        cardOffSet = stackOffset;

    }
    else{
        handWidth = cardWidth * Object.keys(cardsInHand).length;
        cardOffSet = cardWidth;
    }
    
    let emptySpace = (fieldSize - handWidth) / 2;

    if (player.location == 'south'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].y = southTop;
            player['cards-in-hand'][cardId].x = emptySpace + (index * cardOffSet);
        })
    }

    if (player.location == 'west'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = westTop;
            player['cards-in-hand'][cardId].y = emptySpace + (index * cardOffSet);
        })

    }

    if (player.location == 'north'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].y = northTop;
            player['cards-in-hand'][cardId].x = emptySpace + (index * cardOffSet);
        })

    }
    if (player.location == 'east'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = eastTop;
            player['cards-in-hand'][cardId].y = emptySpace + (index * cardOffSet);
        })

    }

    if (player.location == 'center'){
        Object.keys(cardsInHand).forEach((cardId, index) => {
            player['cards-in-hand'][cardId].x = emptySpace + (index * cardOffSet);
            player['cards-in-hand'][cardId].y = deckPos.y;
        })

    }
}


////////////////////////////// LOGIC HELPER FUNCTIONS /////////////////////////////////////

function cardAttrCount(cardsInHand, attr){
    const cardAttr = Object.keys(cardsInHand).map((cardID)=> cardsDB[cardID][attr]);
    const attrCount = {};

    cardAttr.forEach(item => {
        if (Object.hasOwn(attrCount, item)){
            attrCount[item] += 1;
        } else{
            attrCount[item] = 1;
        }

    })

    return attrCount;
}


// Does it need to return an array ??? //
// Could return multiple values depending on the settings //
// Not applicable in this setup, as long as paying attention to settings //
function returnAttrFromCount(attrCount, countValue, minMax){
    const countKeys = [];

    if (minMax == 'min'){
        for (const [key, value] of Object.entries(attrCount)) {
            if (value >= countValue){
                countKeys.push(key)
            }
        }
    }

    if (minMax == 'max'){
        for (const [key, value] of Object.entries(attrCount)) {
            if (value <= countValue){
                countKeys.push(key)
            }
        }
    }
    
    // return countKeys[0];
    return countKeys.length > 0 ? countKeys[0] : 'None';
}


function findCardIdByAttr(cardsInHand, matchAttr, lowHigh){
    let cardFoundID = 'None';
    let attr = 'icon';
    let currentValue = 0;
    let newValue = 0;
    const cardSymbols = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];

    if(cardSymbols.includes(matchAttr)){
        attr = 'symbol';
    }

    Object.keys(cardsInHand).forEach(cardID =>{
        if (cardsDB[cardID][attr] == matchAttr){
            if (cardFoundID == 'None'){
                cardFoundID = cardID;
            } else{
                currentValue = cardsDB[cardFoundID].value;
                newValue = cardsDB[cardID].value;
                if (lowHigh == 'high'){
                    if (newValue > currentValue){
                        cardFoundID = cardID;
                    }
                }
                if (lowHigh == 'low'){
                    if (newValue < currentValue){
                        cardFoundID = cardID;
                    }
                }  
            } 
        }
    })

    return cardFoundID;
}


function calculateHand(cardsInHand){

    const iconCount = cardAttrCount(cardsInHand, 'icon');
    const symbolCount = cardAttrCount(cardsInHand, 'symbol');
    
    if (Object.keys(iconCount).length == 1){
        // If 3 identical icons //
        return 30.5;
    }
    else{
        let identicalSymbol = returnAttrFromCount(symbolCount, 2, 'min');
        let sum = 0;

          Object.keys(cardsInHand).forEach(cardID =>{
            if (cardsDB[cardID].symbol == identicalSymbol){
                sum += cardsDB[cardID].value;
            }
            if (identicalSymbol == 'None'){
                if(cardsDB[cardID].value > sum){
                    sum = cardsDB[cardID].value;
                    }
            }
        })

        return sum
    }

}


function filterCardsDB(cardsInHand, filterOut=false){
    const cardIdArr = Object.keys(cardsInHand)
    if (filterOut){
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => !cardIdArr.includes(k)));
    }
    else{
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => cardIdArr.includes(k)));
    }
}


function sortCardByValue(cardsInHand, keyOnly=false){
    const cardIDs = filterCardsDB(cardsInHand)
    const sortedCards = Object.fromEntries(Object.entries(cardIDs).sort(([,a],[,b]) => b.value-a.value));
    
    if (keyOnly){
        return Object.keys(sortedCards);
    }
    
    return sortedCards;
}

function filterPlayers(field, valuesArr, filterOut=true){
    // Conversion to lower Case ??? //

    if (field == 'key'){
        if (filterOut){
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(k)));
        }
        else{
            return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(k)));
        }
    }
    
    if (filterOut){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !valuesArr.includes(v[field])));
    } else {
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => valuesArr.includes(v[field])));
    }
}

function shiftArray(arr, index){
    const firstPart = arr.slice(index);
    const secondPart = arr.slice(0, index);
    const shiftedArray = firstPart.concat(secondPart);
    return shiftedArray;
}


/////////////////////////////// CREATE ELEMENTS /////////////////////////////////

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
    
    winnerName.value = `${name} with a score of: ${score}`;
    winnerName.readonly = 'true';

    const restartGameBtn = createElem('div', ['game-btn'], 're-start-game-btn');
    
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

    return btnElem;
}


function createPlayCardsBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'play-cards-btn')
    const btnText = document.createTextNode('Play Cards');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    playCardsEvent(btnElem);

    return btnElem;
}


function createSwapBankBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn')
    const btnText = document.createTextNode('Swap Bank');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    swapBankEvent(btnElem, true);
    
    return btnElem;
}


function introSwapBankBtn(){
    const btnElem = createElem('div', ['hidden', 'play-hold-swap-btn'], 'swap-bank-btn')
    const btnText = document.createTextNode('Swap Bank');
    addChildElement(btnElem, btnText);
    addChildElement(playFieldElem, btnElem);
    swapBankEvent(btnElem, false);
    
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

//////////////////////////// CREATE EVENTS //////////////////////////////////

function mouseOverEvent(elem){

    elem.addEventListener(
        "mouseenter",
        (event) => {
            // Hover UP //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target);
            }
        },
        false,
      );

      elem.addEventListener(
        "mouseleave",
        (event) => {
            // Hover DOWN //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target, reverse=true);
            }
        },
        false,
      );
}


function cardClickEvent(elem){
    elem.addEventListener('click', (event)=>{
        const cardID = findCardID(event.target.parentElement);
    
        if (cardsDB[cardID].access && players[0].active){
            pickCardEffect(event.target.parentElement);
        }

        if (cardPickedBank.length == 1 && cardPickedPlayer.length == 1){
            enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
            enableDisablePlayHoldBtn(playCardsBtn, 'visible');
        }else{
            enableDisablePlayHoldBtn(playCardsBtn, 'hidden');
            enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
        }
    })
}

function playCardsEvent(elem){
    elem.addEventListener('click',()=> {
        // playCards();
        playerAction('playCards');
    });
}


function playerHoldEvent(elem){
    elem.addEventListener('click',()=> {
        // playerHold();
        playerAction('playerHold');
    });
}


function swapBankEvent(elem, pass){
    elem.addEventListener('click',()=> {
        // swapBank(pass);
        playerAction('swapBank');
    });
}


function pickCardEffect(pickedElem){
    const cardID = findCardID(pickedElem);
    const location = cardsDB[cardID].location;
    let pickCardArray = [];

    // cardPickedBank and cardPickedPlayer are global variable //
    if (location == 'center'){
        pickCardArray =  cardPickedBank;
    }

    if (location == 'south'){
        pickCardArray = cardPickedPlayer;
    }

    if (pickCardArray.length == 0){
        pickCardArray.push(cardID);
        cardsDB[cardID].picked = true;
    }else{
        if (cardID == pickCardArray[0]){
            const unPickSameID = pickCardArray.pop();
            cardsDB[unPickSameID].picked = false;
        }else{
            const unPickCardID = pickCardArray.pop();
            cardsDB[unPickCardID].picked = false;
            pickCardArray.push(cardID);
            cardsDB[cardID].picked = true;
            mouseLeaveEffect(cardsDB[unPickCardID].elem);
        }
    }             
}


function cardHoverEffect(hoverElem, reverse=false){
    let matrixStr = ''
    let targetStyle = hoverElem.getAttribute('style').split(/\s/);
    targetStyle = targetStyle.map(item => item.replace(',',''));
    const transform = targetStyle[0];
    const matrix3D = targetStyle.slice(1, targetStyle.length-2);
    const zIndex = targetStyle.slice(targetStyle.length -2);

    // hoverOffset is a global variable //
    let hoverX = hoverOffsetX;
    let hoverY = hoverOffsetY

    if (reverse){
        hoverX = -1 * hoverX;
        hoverY = -1 * hoverY;
    }

    matrix3D[12] = Number(matrix3D[12]) - hoverX;
    matrix3D[13] = Number(matrix3D[13]) - hoverY;

    matrixStr = `${transform} ${matrix3D.toString()} ${zIndex.toString().replace(',', '')}}`;
    
    return matrixStr;
}

// Card Pick Should leave card in Hover UP state //
function mouseLeaveEffect(elem){
    const hoverDown = new Event("mouseleave");
    elem.dispatchEvent(hoverDown);
}


///////////////////////// CREATE START POINT ////////////////////////////////
displayPlayerEntry();