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




function findCardMatch(sortedCardInHandIDs, sortedCardInBankIDs, attr){
    /////////////// Remove ??? ////////////////////
    // const sortedCardInHandIDs = sortCardByValue(cardsInHand, keyOnly=true) // []
    // const sortedCardInBankIDs = sortCardByValue(cardsInBank, keyOnly=true) // []
    //////////////////////////////////////////////

    let pickBankCard = 'None';
    let matchHandCard = 'None';
    let score = 0;

    sortedCardInHandIDs.forEach(handID =>{
        sortedCardInBankIDs.forEach(bankID=>{
            if (cardsDB[handID][attr] == cardsDB[bankID][attr]){
                let scoreValue = cardsDB[handID].value + cardsDB[bankID].value;
                if (scoreValue > score){
                    pickBankCard = bankID;
                    matchHandCard = handID;
                    score = scoreValue;
                }
                
            }
        })
    })

    return [pickBankCard, matchHandCard];
}

function findCardMatch2(cardsInHand, cardsInBank, attr){
    /////////////// Remove ??? ////////////////////
    // const sortedCardInHandIDs = sortCardByValue(cardsInHand, keyOnly=true) // []
    const sortedCardInBankIDs = sortCardByValue(cardsInBank, keyOnly=true) // []
    //////////////////////////////////////////////
    let dropCardInHand = 'None';
    let pickBankCard = 'None';
    // let matchHandCard = 'None';
    // let matchAttr = 'None';
    let score = 0;

    let chaseAttr = [];
    if (attr == 'icon'){
        const iconCount = cardAttrCount(cardsInHand, 'icon')
        chaseAttr = returnKeysFromCount(iconCount, 2, 'min') // Returns []  // returnKeyFromCount(iconCount, 2)
        dropCardIcon = returnKeysFromCount(iconCount, 1, 'max'); // Returns [icon]
        if (dropCardIcon != 'None'){
            dropCardInHand = findCardIdByAttr( cardsInHand, 'icon', dropCardIcon);
        }
        
    }
    if (attr == 'symbol'){
        const symbolCount = cardAttrCount(cardsInHand, 'symbol')
        chaseAttr = returnKeysFromCount(symbolCount, 2, 'min') // Returns []  // returnKeyFromCount(iconCount, 2) 
        dropCardSymbol = returnKeysFromCount(symbolCount, 1, 'max'); // Returns [symbol]
        if (dropCardSymbol != 'None'){
            dropCardInHand = findCardIdByAttr( cardsInHand, 'symbol', dropCardSymbol);
        }
    }

    sortedCardInBankIDs.forEach(bankID=>{

        if (cardsDB[bankID][attr] == chaseAttr[0]){
            let scoreValue = cardsDB[bankID].value;
            if (scoreValue > score){
                pickBankCard = bankID;
                // matchHandCard = handID;
                score = scoreValue;
            }
            
        }
    })

    return [pickBankCard, dropCardInHand];
}

function findCardMatch3(sortedCardInHandIDs, sortedCardInBankIDs, attr){
    /////////////// Remove ??? ////////////////////
    // const sortedCardInHandIDs = sortCardByValue(cardsInHand, keyOnly=true) // []
    // const sortedCardInBankIDs = sortCardByValue(cardsInBank, keyOnly=true) // []
    //////////////////////////////////////////////

    let pickBankCard = 'None';
    let dropHandCard = 'None';
    let score = 0;
    // const symbolCount = cardAttrCount(cardsInHand, 'symbol')
    // const chaseAttr = returnKeysFromCount(symbolCount, 3, 'min') // Returns []  // returnKeyFromCount(iconCount, 3) 

    sortedCardInHandIDs.forEach(handID =>{
        sortedCardInBankIDs.forEach(bankID=>{
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

function pickACard(cardsInHand, cardsInBank){
    const handIconsCount = cardAttrCount(cardsInHand, 'icon');
    const handSymbolsCount = cardAttrCount(cardsInHand, 'symbol');
    //////////////////// Find Card Match ??? ///////////////////////
    const sortedCardInHandIDs = sortCardByValue(cardsInHand, keyOnly=true) // []
    const sortedCardInBankIDs = sortCardByValue(cardsInBank, keyOnly=true) // []
    //////////////////// Drop Hand Card Calc ///////////////////////
    const minBankScore = 28;
    let cardsInHandScore = 0;
    let cardsInBankScore = 0;


    // 3 unique symbols and 3 unique icons (chase symbols first);
    if (Object.keys(handIconsCount).length == 3 && Object.keys(handSymbolsCount).length == 3){
        // Loop through cards in hand and loop through cards in bank to find the highst score combination by symbol
        // const pickBySymbol = findCardMatch(cardsInHand, cardsInBank, 'symbol');
        let cardsPicked = findCardMatch(sortedCardInHandIDs, sortedCardInBankIDs, 'symbol');

        // If no matching symbol in bank chase (any) icon
        if (cardsPicked[0] == 'None'){
            // const pickByIcon = findCardMatch(cardsInHand, cardsInBank, 'icon');
            cardsPicked = findCardMatch(sortedCardInHandIDs, sortedCardInBankIDs, 'icon');
        }

        // If no matching icon in bank either chase highest bank card
        if (cardsPicked[0] == 'None'){
            cardsPicked = [sortedCardInBankIDs[0], 'None'];
        }

        let dropHandCard = sortedCardInHandIDs[sortedCardInHandIDs.length -1];
        // if match handCard to BankCard == lowest value card in Hand
        if (cardsPicked[1] == sortedCardInHandIDs[sortedCardInHandIDs.length -1]){
            dropHandCard = sortedCardInHandIDs[1];
        }

        cardsInHandScore = calculateHand(cardsInHand);
        cardsInBankScore = calculateHand(cardsInBank);
        if (cardsInBankScore > cardsInHandScore && cardsInBankScore > minBankScore){
            console.log('takeBank')
            return ['takeBank', cardsInBank]
        }
        /// reset score ??? ///
        return [cardsPicked[0], dropHandCard] // [dropHandCard, cardsPicked[0]] [0,1]
    }

    // 1 unique symbol (score 24 - 31) (1 unique icon == 30.5)
    if (Object.keys(handIconsCount).length == 1 || Object.keys(handSymbolsCount).length == 1){
        
        cardsInHandScore = calculateHand(cardsInHand);
        if (cardsInHandScore == 30.5){
            console.log('playerPass');
            return ['playerPass', cardsInHand]
        }
        const pickedCards = findCardMatch3(sortedCardInHandIDs, sortedCardInBankIDs, 'symbol')
        const pickCard = pickedCards[0];
        const dropCard = pickedCards[1];

        if (pickCard == 'None'){
            console.log('playerPass')
            return ['playerPass', cardsInHand]
        }

        return [pickCard, dropCard] //pickedCards; [dropCard, pickCard] [0,1]
    }
        

    // 2 unique symbols or 2 unique icons (chase icons first)
    if (Object.keys(handIconsCount).length == 2 || Object.keys(handSymbolsCount).length == 2){
        // ??? Either Or ??? //
        // Chase Icons
        let cardPicked = findCardMatch2(cardsInHand, cardsInBank, 'icon');
        let dropCardInHand = cardPicked[1];
        

        // If no matching icon in bank chase symbol
        if (cardPicked[0]== 'None'){
            cardPicked = findCardMatch2(cardsInHand, cardsInBank, 'symbol');
            if (cardPicked[0] != 'None'){
                // Favour Icons over Symbols
                dropCardInHand = cardPicked[1];
            }
            
        }

        // If no matching icon in bank either, chase highest bank card
        if (cardPicked[0] == 'None'){
            cardPicked = [sortedCardInBankIDs[0], 'None'];
        }

        
        cardsInHandScore = calculateHand(cardsInHand);
        cardsInBankScore = calculateHand(cardsInBank);
        if (cardsInBankScore > cardsInHandScore && cardsInBankScore > minBankScore){
            console.log('takeBank')
        }
        /// reset score ??? ///
        return [cardPicked[0], dropCardInHand] //[dropCardInHand, cardPicked] [0, 1]
    }
        
}

const bankCards8 = {
    'Clubs-A': null,
    'Diamond-10': null,
    'Hearts-8': null,
}

const playerCards8 = {
    'Clubs-8': null,
    'Diamond-8': null,
    'Hearts-A': null,
}

console.log('Eights 8')
console.log('Should Return; [Hearts-8, Hearts-A]')
// console.log(autoPickCard(playerCards8, bankCards8));
console.log(pickACard(playerCards8, bankCards8));

const bankCardsHearts = {
    'Clubs-A': null,
    'Diamond-10': null,
    'Hearts-8': null,
}

const playerCardsHearts = {
    'Clubs-8': null,
    'Hearts-9': null,
    'Hearts-A': null,
}
console.log('Hearths')
console.log('Should Return; [Hearts-8, Clubs-8]')
// console.log(autoPickCard(playerCardsHearts, bankCardsHearts));
console.log(pickACard(playerCardsHearts, bankCardsHearts));

const bankCardsSingles = {
    'Clubs-A': null,
    'Diamond-10': null,
    'Hearts-8': null,
}

const playerCardsSingles = {
    'Clubs-8': null,
    'Diamond-9': null,
    'Hearts-A': null,
}
console.log('Singles')
console.log('Should Return at Random; Hearts-8 || Clubs-A || Diamond-10') // Diamon-10 not showing up.
console.log('Should Return at Random; Clubs-8 || Diamond-9 || Clubs-8')
// console.log(autoPickCard(playerCardsSingles, bankCardsSingles));
console.log(pickACard(playerCardsSingles, bankCardsSingles));