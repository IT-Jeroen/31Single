const cardsDB = {
    'Hearts-A':{'icon': 'A', 'symbol': 'Hearts', 'value': 11},
    'Clubs-A':{'icon': 'A', 'symbol': 'Clubs', 'value': 11},
    'Clubs-8':{'icon': '8', 'symbol': 'Clubs', 'value': 8},
    'Hearts-8':{'icon': '8', 'symbol': 'Hearts', 'value': 8},
    'Hearts-9':{'icon': '9', 'symbol': 'Hearts', 'value': 9},
    'Diamond-10':{'icon': '10', 'symbol': 'Diamond', 'value': 10},
    'Diamond-8':{'icon': '8', 'symbol': 'Diamond', 'value': 8},
    'Diamond-9':{'icon': '9', 'symbol': 'Diamond', 'value': 9},
    'Hearts-10':{'icon': '10', 'symbol': 'Hearts', 'value': 10},
}
console.log(cardsDB[Object.keys(cardsDB)[0]])
console.log(Object.values(cardsDB)[0])

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

const countTwoIconSymbol = {
    'Hearts-A': null,
    'Clubs-8': null,
    'Hearts-8': null,
}
console.log('Should Return; Object {8:2, A:1}')
console.log(cardAttrCount(countTwoIconSymbol, 'icon'))
console.log('Should Return; Object {Hearts:2, Clubs:1}')
console.log(cardAttrCount(countTwoIconSymbol, 'symbol'))


function returnKeyFromCount(attrCount, minCount){
    const countKeys = []

    for (const [key, value] of Object.entries(attrCount)) {
        if (value >= minCount){
            countKeys.push(key)
        }
    }

    return countKeys
}

const attrCountTest1 = {
    '8': 1,
    'A': 1,
    '10': 1,
}

const attrCountTest2={
    '8': 2,
    'A': 1,
 }

 const attrCountTest3={
    '8': 3,
    }

console.log('Should Return; [8,A,10]')
console.log(returnKeyFromCount(attrCountTest1, 1))
console.log('Should Return; [8]')
console.log(returnKeyFromCount(attrCountTest2, 2))
console.log('Should Return; [8]')
console.log(returnKeyFromCount(attrCountTest3, 3))


function returnKeysFromCount(attrCount, countValue, minMax){
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


function playerPass(cardsInHand,overRule=false){
    const handValue = calculateHand(cardsInHand);
    if (handValue > lowerSumPassLimit || overRule){
        console.log('Player Pass');
        return 'Player Pass';
    }
}


function findCardIdByAttr(cardsInHand, attr, attrValue){
    let cardFoundID = 'None';

    Object.keys(cardsInHand).forEach(cardID =>{
        if (cardsDB[cardID][attr] == attrValue){
            if (cardFoundID == 'None'){
                cardFoundID = cardID;
            } else{
                // Multiple mathced for card symbols //
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

const cardsTwoIconSymbol = {
    'Hearts-A': null,
    'Clubs-8': null,
    'Hearts-8': null,
}

console.log('Find an 8 Card')
console.log(findCardIdByAttr( cardsTwoIconSymbol, 'icon', '8'));
console.log('Find Hearts-A')
console.log(findCardIdByAttr( cardsTwoIconSymbol, 'symbol', 'Hearts'));


function calculateHand(cardsInHand){

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

const cardsTwoHearths = {
    'Hearts-A': null,
    'Clubs-8': null,
    'Hearts-8': null,
}
console.log('Sum should be 19')
console.log(calculateHand(cardsTwoHearths))

const cardsThree8 = {
    'Hearts-8': null,
    'Clubs-8': null,
    'Diamond-8': null,
}
console.log('Sum should be 30.5')
console.log(calculateHand(cardsThree8))

const cardsSingles = {
    'Clubs-8': null,
    'Diamond-8': null,
    'Hearts-A': null,
}
console.log('Sum should be 11')
console.log(calculateHand(cardsSingles))

const cardsThreeHearths = {
    'Hearts-A': null,
    'Hearts-10': null,
    'Hearts-8': null,
}
console.log('Sum should be 29')
console.log(calculateHand(cardsThreeHearths))


const lowerCardSumLimit = 26
const lowerSumPassLimit = 28;

function filterCardsDB(cardsInHand, filterOut=false){
    const cardIdArr = Object.keys(cardsInHand)
    if (filterOut){
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => !cardIdArr.includes(k)));
    }
    else{
        return Object.fromEntries(Object.entries(cardsDB).filter(([k,v]) => cardIdArr.includes(k)));
    }
}
console.log('Should Return; Hearts-8 : Object{}')
console.log(filterCardsDB(['Hearts-8']))


function sortCardByValue(cardsInHand, keyOnly=false){
    const cardIDs = filterCardsDB(cardsInHand)
    const sortedCards = Object.fromEntries(Object.entries(cardIDs).sort(([,a],[,b]) => b.value-a.value));
    
    if (keyOnly){
        return Object.keys(sortedCards);
    }
    
    return sortedCards;
}

const cardsSortValues = {
    'Hearts-A': null,
    'Hearts-10': null,
    'Hearts-8': null,
}
console.log('Should return [A, 10, 8]')
console.log(sortCardByValue(cardsSortValues))


