import { cardAttrCount, calculateHand, returnAttrFromCount, findCardIdByAttr, sortCardByValue } from './helperFunctions.js';
import { cardsDB } from "./cardsDB.js";


export function checkCardSwapSum(cardsInHand, cardIn, cardOut){
    const cardIDs = Object.keys(cardsInHand);
    cardIDs.push(cardIn);
    const newcardIDs = cardIDs.filter(cardID => cardID != cardOut)
    const newCardsSwap = Object.fromEntries(Object.entries(cardsInHand).filter(([k,v]) => newcardIDs.includes(k)));
    newCardsSwap[cardIn] = null;
    const sum = calculateHand(newCardsSwap);
    return sum;
}



export function playerPass(cardsInHand,lowerSumPassLimit){
    const handValue = calculateHand(cardsInHand);
    if (handValue > lowerSumPassLimit){
        return 'Player Pass';
    }
    return 'Keep Playing';
}


// When cardsInHand has no matching icons or symbols //
// Find the combination of playerCard and bankCard with the highest score //
export function findCardMatch(cardsInHand, cardsInBank, attr){
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

export function findCardMatch2(cardsInHand, cardsInBank, attr){
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


export function findCardMatch3(cardsInHand, cardsInBank, attr){
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

export function pickACard(cardsInHand, cardsInBank){
    const handIconsCount = cardAttrCount(cardsInHand, 'icon');
    const handSymbolsCount = cardAttrCount(cardsInHand, 'symbol');
    const sortedCardInHandIDs = sortCardByValue(cardsInHand, true) // true returns array of cardIDs only
    const sortedCardInBankIDs = sortCardByValue(cardsInBank, true) // true returns array of cardIDs only
    
    const minBankScore = 28;
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