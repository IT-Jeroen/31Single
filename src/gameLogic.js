import { cardAttrCount, calculateHand, returnKeysFromCount, findCardIdByAttr, sortCardByValue } from './helperFunctions.js';
import { cardsDB } from "./cardsDB.js";

// Why print out statements from helperfunctions when running this file ??? ///
// Why does CardsDB need to be in the helperFunctions file //

// const cardsDB = {
//     'Hearts-A':{'icon': 'A', 'symbol': 'Hearts', 'value': 11},
//     'Clubs-A':{'icon': 'A', 'symbol': 'Clubs', 'value': 11},
//     'Clubs-8':{'icon': '8', 'symbol': 'Clubs', 'value': 8},
//     'Hearts-8':{'icon': '8', 'symbol': 'Hearts', 'value': 8},
//     'Hearts-9':{'icon': '9', 'symbol': 'Hearts', 'value': 9},
//     'Diamond-10':{'icon': '10', 'symbol': 'Diamond', 'value': 10},
//     'Diamond-8':{'icon': '8', 'symbol': 'Diamond', 'value': 8},
//     'Diamond-9':{'icon': '9', 'symbol': 'Diamond', 'value': 9},
//     'Hearts-10':{'icon': '10', 'symbol': 'Hearts', 'value': 10},
// }

function autoPickCard(cardsInHand, cardsInBank){
    const bankIconsCount = cardAttrCount(cardsInBank, 'icon');
    const bankSymbolsCount = cardAttrCount(cardsInBank, 'symbol');
    const bankValue = calculateHand(cardsInBank);
    const bankCards = sortCardByValue(cardsInBank);

    const handIconsCount = cardAttrCount(cardsInHand, 'icon');
    const handSymbolsCount = cardAttrCount(cardsInHand, 'symbol');
    const handValue = calculateHand(cardsInHand);
    const handCards = sortCardByValue(cardsInHand);
    // console.log('handCards', handCards)


    if (Object.keys(handSymbolsCount).length == 3 && Object.keys(handIconsCount).length == 3){
        // chase symbols first (with icon prefered)
        // Find Best Match Based on Hand
        const bestMatchHighestCardHand = Object.fromEntries(Object.entries(bankCards).filter(([k,v]) => v.symbol == handCards[Object.keys(handCards)[0]].symbol));
        // console.log('bestMatchHighestCardHand',bestMatchHighestCardHand)
        // Find Best Match Based on Bank
        const bestMatchHighestCardBank = Object.fromEntries(Object.entries(handCards).filter(([k,v]) => v.symbol == bankCards[Object.keys(bankCards)[0]].symbol));
        // console.log('bestMatchHighestCardBank',bestMatchHighestCardBank)

        // Calculate Sum Picked Cards Based on Hand
        const obj = {}
        obj[Object.keys(handCards)[0]] = null;
        obj[Object.keys(bestMatchHighestCardHand)[0]] = null;
        const pickCardHighestHandSum = calculateHand(obj)
        // console.log('pickCardHighestHandSum:',pickCardHighestHandSum);
        // Calculate Sum Picked Cards Based on Bank
        const objt = {}
        objt[Object.keys(bankCards)[0]] = null;
        objt[Object.keys(bestMatchHighestCardBank)[0]] = null;
        const pickCardHighestBankSum = calculateHand(objt)
        // console.log('pickCardHighestBankSum:',pickCardHighestBankSum);


        // Needs to be placed in different place //
        const dropCard = {};
        console.log('Pick Card',Object.keys(bestMatchHighestCardBank)[0], 'DropCard', Object.keys(handCards)[Object.keys(handCards).length -1])
        if (Object.keys(bestMatchHighestCardBank)[0] === Object.keys(handCards)[Object.keys(handCards).length -1]){
            dropCard[Object.keys(handCards)[1]] = cardsDB[Object.keys(handCards)[1]];
        }else{
            dropCard[Object.keys(handCards)[0]] = cardsDB[Object.keys(handCards)[0]];
        }

        if (pickCardHighestBankSum == pickCardHighestHandSum){
            const randomBool = Math.floor(Math.random()*2);
            if(randomBool){
                console.log('Return', bestMatchHighestCardHand, dropCard)
                // return bestMatchHighestCardHand
            }else{
                const bankCardObj = {}
                bankCardObj[Object.keys(bankCards)[0]] = bankCards[Object.keys(bankCards)[0]]
                console.log('Return', bankCardObj, dropCard)
                // return bankCardObj
            }
        }

        if (pickCardHighestBankSum > pickCardHighestHandSum){
            const bankCardObj = {}
            bankCardObj[Object.keys(bankCards)[0]] = bankCards[Object.keys(bankCards)[0]]
            console.log('Return', bankCardObj, dropCard)
            // return bankCardObj
        }

        if (pickCardHighestBankSum < pickCardHighestHandSum){
            console.log('Return', bestMatchHighestCardHand, dropCard)
            // return bestMatchHighestCardHand
        }

        // chase symbols first (with icon prefered)
        // if (x == Null)
    }
    
    if (Object.keys(handIconsCount).length <= Object.keys(handSymbolsCount).length){
        // chase icons
    }
    
    if (Object.keys(handSymbolsCount).length < Object.keys(handIconsCount).length){
        // 'chase symbols'
    }

    

    // Chase 3 icons first; more options to get a good score of 30.5 //
    const chaseIcons = returnKeysFromCount(handIconsCount, 2, 'min');
    if (chaseIcons.length > 0){
        // check bank for icon //
        const bankIconCardID = findCardIdByAttr(cardsInBank, 'icon', chaseIcons[0]);
        if (bankIconCardID != 'None'){
            const dropIcon = returnKeysFromCount(handIconsCount, 1, 'max')[0]
            const dropCardID = findCardIdByAttr(cardsInHand, 'icon', dropIcon);
            // console.log(`Take from Bank: ${bankIconCardID}, Drop from Hand; ${dropCardID}`);
            return [bankIconCardID, dropCardID];
        }
    }

    // Chase symbols;
    const chaseSymbols = returnKeysFromCount(handSymbolsCount, 2, 'min');
    if (chaseSymbols.length > 0){
        const bankSymbolCardID = findCardIdByAttr(cardsInBank, 'symbol', chaseSymbols[0]);
        if (bankSymbolCardID != 'None'){
            const dropSymbol = returnKeysFromCount(handSymbolsCount, 1, 'max')[0];
            const dropCardID = findCardIdByAttr(cardsInHand, 'symbol', dropSymbol);
            return [bankSymbolCardID, dropCardID]
        }
        
    }

    // Chase symbol or icon //



    // Check value of Banks Cards //
    if (bankValue > lowerCardSumLimit && bankValue > handValue){
        console.log('Take Bank');
        return 'Take Bank';
    }
}


function checkIfDropCardWithBankSum(){
    // check if drop card is giving away high score in the bank //
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
    let dropCardInHand = 'None';
    let pickBankCard = 'None';
    let dropCardAttrInHand = 'None';
    let score = 0;

    const attrCount = cardAttrCount(cardsInHand, attr);
    const chaseAttr = returnKeysFromCount(attrCount, 2, 'min') // Returns []  // returnKeyFromCount(iconCount, 2) 
    const dropCardAttr = returnKeysFromCount(attrCount, 1, 'max'); // Returns [symbol]
    if (dropCardAttr != 'None'){
        dropCardAttrInHand = findCardIdByAttr(cardsInHand, attr, dropCardAttr[0]);
    }

    Object.keys(cardsInBank).forEach(bankID =>{
        if (cardsDB[bankID][attr] == chaseAttr[0]){
            let scoreValue = cardsDB[bankID].value;
            if (scoreValue > score){
                pickBankCard = bankID;
                dropCardInHand = dropCardAttrInHand;
                score = scoreValue;
            }
            
        }
    })

    return [pickBankCard, dropCardInHand];
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
        // let cardsPicked = findCardMatch(sortedCardInHandIDs, sortedCardInBankIDs, 'symbol');
        let cardsPicked = findCardMatch(cardsInHand, cardsInBank, 'symbol');
        let cardPicked = cardsPicked[0];
        let dropCardInHand = cardsPicked[1];

        // If no matching symbol in bank chase (any) icon
        if (cardPicked == 'None'){
            // const pickByIcon = findCardMatch(cardsInHand, cardsInBank, 'icon');
            cardsPicked = findCardMatch(cardsInHand, cardsInBank, 'icon');
            cardPicked = cardsPicked[0];
            dropCardInHand = cardsPicked[1];
        }

        // If no matching icon in bank either chase highest bank card
        if (cardPicked == 'None'){
            cardPicked = sortedCardInBankIDs[0];
            dropCardInHand = sortedCardInHandIDs[2];
        }

        // let dropHandCard = sortedCardInHandIDs[sortedCardInHandIDs.length -1];
        // // if match handCard to BankCard == lowest value card in Hand
        // if (cardsPicked[1] == sortedCardInHandIDs[sortedCardInHandIDs.length -1]){
        //     dropHandCard = sortedCardInHandIDs[1];
        // }

        
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
                dropCardAttr = returnKeysFromCount(handSymbolsCount, 1, 'max'); // Returns [symbol] // Attr symbol
                dropCardInHand = findCardIdByAttr(cardsInHand, 'symbol', dropCardAttr[0]);
            }else{ // Favour Icons //
                dropCardAttr = returnKeysFromCount(handIconsCount, 1, 'max'); // Returns [symbol] // Attr icon
                dropCardInHand = findCardIdByAttr(cardsInHand, 'icon', dropCardAttr[0]);
            }
        }

        return [cardPicked, dropCardInHand] //[dropCardInHand, cardPicked] [0, 1]
    }
        
}