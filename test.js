const cardsDB = {
    'Hearts-A':{'icon': 'A', 'symbol': 'Hearts', 'value': 11},
    'Clubs-8':{'icon': '8', 'symbol': 'clubs', 'value': 8},
    'Hearts-8':{'icon': '8', 'symbol': 'Hearts', 'value': 8},
    'Diamond-10':{'icon': '10', 'symbol': 'Diamond', 'value': 10},
    'Diamond-8':{'icon': '8', 'symbol': 'Diamond', 'value': 8},
    'Hearts-10':{'icon': '10', 'symbol': 'Hearts', 'value': 10},
}



function calculateHand(cardsInHand){
    const cardsIDs = Object.keys(cardsInHand);
    const cardIcons = cardsIDs.map((cardID)=> cardsDB[cardID].icon);
    const cardSymbols = cardsIDs.map((cardID)=> cardsDB[cardID].symbol);
    const iconCount = {};
    const symbolCount = {};

    // count unique icons //
    cardIcons.forEach(icon => {
        if (Object.hasOwn(iconCount, icon)){
            iconCount[icon] += 1;
        } else{
            iconCount[icon] = 1
        }

    })

    // count unique symbols //
    cardSymbols.forEach(symbol => {
        if (Object.hasOwn(symbolCount, symbol)){
            symbolCount[symbol] += 1;
        } else{
            symbolCount[symbol] = 1
        }

    })

    
    if (Object.keys(iconCount).length == 1){
        // If 3 identical icons //
        return 30.5;
    }
    else{
        let identicalSymbol = '';
        let sum = 0;
        
        // check for identical symbols //
        for (const [key, value] of Object.entries(symbolCount)) {
            if (value > 1){
                identicalSymbol = key
            }
          }

        cardsIDs.forEach(cardID =>{
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
console.log(calculateHand(cardsTwoHearths))

const cardsThree8 = {
    'Hearts-8': null,
    'Clubs-8': null,
    'Diamond-8': null,
}
console.log(calculateHand(cardsThree8))

const cardsSingles = {
    'Clubs-8': null,
    'Diamond-8': null,
    'Hearts-A': null,
}
console.log(calculateHand(cardsSingles))

const cardsThreeHearths = {
    'Hearts-A': null,
    'Hearts-10': null,
    'Hearts-8': null,
}
console.log(calculateHand(cardsThreeHearths))