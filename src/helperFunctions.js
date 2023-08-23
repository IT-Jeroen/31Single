import { cardsDB } from "./cardsDB.js";

export function cardAttrCount(cardsInHand, attr){
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


export function returnKeyFromCount(attrCount, minCount){
    const countKeys = []

    for (const [key, value] of Object.entries(attrCount)) {
        if (value >= minCount){
            countKeys.push(key)
        }
    }

    return countKeys
}


export function returnKeysFromCount(attrCount, countValue, minMax){
    const countKeys = []
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
    

    return countKeys
}


export function playerPass(cardsInHand,lowerSumPassLimit){
    const handValue = calculateHand(cardsInHand);
    if (handValue > lowerSumPassLimit){
        return 'Player Pass';
    }
    return 'Keep Playing';
}



export function findCardIdByAttr(cardsInHand, attr, attrValue){
    let cardFoundID = 'None';

    Object.keys(cardsInHand).forEach(cardID =>{
        if (cardsDB[cardID][attr] == attrValue){
            if (cardFoundID == 'None'){
                cardFoundID = cardID;
            } else{
                // Multiple matches for card symbols //
                const currentValue = cardsDB[cardFoundID].value;
                const newValue = cardsDB[cardID].value;
                if (newValue > currentValue){
                    cardFoundID = cardID;
                }
            } 
        }
    })

    return cardFoundID;
}


export function calculateHand(cardsInHand){

    const iconCount = cardAttrCount(cardsInHand, 'icon');
    const symbolCount = cardAttrCount(cardsInHand, 'symbol');
    
    if (Object.keys(iconCount).length == 1){
        // If 3 identical icons //
        return 30.5;
    }
    else{
        let identicalSymbol = returnKeyFromCount(symbolCount, 1)[0]; /// ????
        let sum = 0;

          Object.keys(cardsInHand).forEach(cardID =>{
            // if identical symbols
            if (cardsDB[cardID].symbol == identicalSymbol){
                sum += cardsDB[cardID].value;
            }else{
                // if no identical symbols //
                if(cardsDB[cardID].value > sum){
                    sum = cardsDB[cardID].value;
                }
            }
        })

        return sum
    }

}


export function filterCardsDB(cardsInHand, filterOut=false){
    const cardIdArr = Object.keys(cardsInHand)
    if (filterOut){
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => !cardIdArr.includes(k)));
    }
    else{
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => cardIdArr.includes(k)));
    }
}


export function sortCardByValue(cardsInHand, keyOnly=false){
    const cardIDs = filterCardsDB(cardsInHand)
    const sortedCards = Object.fromEntries(Object.entries(cardIDs).sort(([,a],[,b]) => b.value-a.value));
    
    if (keyOnly){
        return Object.keys(sortedCards);
    }
    
    return sortedCards;
}
