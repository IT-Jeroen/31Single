function loadGame(){
    const playerName = document.getElementById('player-name');
    const playerEntry = document.getElementById('player-entry');
    const winnerDisplay = document.getElementById('winner-display');

    // // players == Global Variable //
    // if (playerName){
    //     players[0].name = playerName.value;
    // }
   
    // players[0].auto = false;
    // // console.log(players[0]);

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



// Animate Handing out cards //
// Create Interval for animated effect //
// Read Players Cards in Hand //
// Add Transform to cardElem from cardsDB //
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


// addDeckCardsToPlayers //
// Generate deckCard Elements //
// Generate Random deckCard Values //
// Add deckCard to Cards DB //
// Assign deckCard to Player //

// Add eventListeners on All cards in Game //
// Set Card Access true/false in Cards DB to Player (mouseClick mouseOver Event) //
// Calculate card position //

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

        
        // MOVED TO CREATE DECK ELEMENTS //
        // // Add eventListeners on All cards in Game //
        // // add hover mouse event //
        // mouseOverEvent(cardElem);
        // // add click card event //
        // cardClickEvent(cardElem);

        
        if (players[`${playerID}`].name == 'Bank' || players[`${playerID}`].location == 'south'){
            cardsDB[cardId].access = true;
        }

        // MOVED TO DEAL DECK CARDS //
        // if (players[`${playerID}`].name == 'Bank'){
        //     calcCardPositions(players[`${playerID}`], stacked=false);
        //     // give player acces to card //
        //     cardsDB[cardId].access = true;
        // }else{
        //     if (players[`${playerID}`].location == 'south'){
        //          // give player acces to card //
        //         cardsDB[cardId].access = true;
        //     }
        //     // calc cardPosition //
        //     calcCardPositions(players[`${playerID}`]);
        // }
        
        playerID += 1;

        if (playerID == Number(playersID[playersID.length-1])+1){
            playerID = 0;
        }

    })

    // MOVED TO DEAL DECK CARDS //
    // // position cards
    // const bank = filterPlayers('name', ['Bank'], false);
    // const nonBankPlayers = filterPlayers('name', ['Bank']);

    // dealingCards(nonBankPlayers, timing);
    // setTimeout(()=>{
    //     dealingCards(bank, timing);
    // },(allCardElems.length + 1)*timing);
    
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

