import { cardsDB, cardSymbols } from "./cardsDB.js";
import { players } from './players.js'

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


// Does it need to return an array ??? //
// Could return multiple values depending on the settings //
// Not applicable in this setup, as long as paying attention to settings //
export function returnAttrFromCount(attrCount, countValue, minMax){
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


export function findCardIdByAttr(cardsInHand, matchAttr, lowHigh){
    let cardFoundID = 'None';
    let attr = 'icon';
    let currentValue = 0;
    let newValue = 0;
    
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


export function calculateHand(cardsInHand){

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

export function filterPlayers(field, valuesArr, filterOut=true){
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

export function shiftArray(arr, index){
    const firstPart = arr.slice(index);
    const secondPart = arr.slice(0, index);
    const shiftedArray = firstPart.concat(secondPart);
    return shiftedArray;
}
