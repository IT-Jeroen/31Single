import { it, expect, describe } from 'vitest';
import { cardAttrCount, returnAttrFromCount, calculateHand, findCardIdByAttr, filterCardsDB, sortCardByValue } from './src/js/helperFunctions.js';

it('cardAttrCount() Should return an Object with the icon or symbol as a key, and a count as value', ()=>{
    const countTwoIconSymbol = {
        'Hearts-A': null,
        'Clubs-8': null,
        'Hearts-8': null,
    }

    const resultIcon = cardAttrCount(countTwoIconSymbol, 'icon');
    expect(resultIcon).toBeTypeOf('object');
    const resultIconKeys = Object.keys(resultIcon);
    expect(resultIconKeys).toEqual(['8','A']);
    const resultIconValues = Object.values(resultIcon);
    expect(resultIconValues).toEqual([2,1]);
    
    const resultSymbol = cardAttrCount(countTwoIconSymbol, 'symbol');
    expect(resultIcon).toBeTypeOf('object');
    const resultSymbolKeys = Object.keys(resultSymbol);
    expect(resultSymbolKeys).toEqual(['Hearts','Clubs']);
    const resultSymbolValues = Object.values(resultSymbol);
    expect(resultSymbolValues).toEqual([2,1]);
});


it('returnAttrFromCount() Should return an Array of Key(s) based upon count value', ()=>{
    const attrCountTest1 = {
        '8': 1,
        'A': 1,
        '10': 1,
    }
    
    const attrCountTest2 = {
        '8': 2,
        'A': 1,
     }
    
     const attrCountTest3={
        '8': 3,
    }

    const attrCountTest4 = {
        'Hearts': 2,
        'Clubs': 1,
    }

    const resultAttrCountTest1a =  returnAttrFromCount(attrCountTest1, 1, 'min');
    expect(resultAttrCountTest1a).toBe('8');

    const resultAttrCountTest1b =  returnAttrFromCount(attrCountTest1, 2, 'min');
    expect(resultAttrCountTest1b).toBe('None');

    const resultAttrCountTest2a = returnAttrFromCount(attrCountTest2, 2, 'min');

    expect(resultAttrCountTest2a).toBe('8');
    const resultAttrCountTest2b = returnAttrFromCount(attrCountTest2, 1, 'max');
    expect(resultAttrCountTest2b).toBe('A');

    const resultAttrCountTest3 =  returnAttrFromCount(attrCountTest3, 3, 'min');
    expect(resultAttrCountTest3).toBe('8');

    const resultAttrCountTest4a = returnAttrFromCount(attrCountTest4, 2, 'min');
    expect(resultAttrCountTest4a).toBe('Hearts');
    const resultAttrCountTest4b = returnAttrFromCount(attrCountTest4, 1, 'max');
    expect(resultAttrCountTest4b).toBe('Clubs');
});


it('calculateHand() It should return the sum (Number) of the cardsInHand',()=>{
    const cardsTwoHearths = {
        'Hearts-A': null,
        'Clubs-8': null,
        'Hearts-8': null,
    }
    
    const cardsThree8 = {
        'Hearts-8': null,
        'Clubs-8': null,
        'Diamonds-8': null,
    }
    
    const cardsSingles = {
        'Clubs-8': null,
        'Hearts-A': null,
        'Diamonds-9': null,
    }
    
    const cardsThreeHearths = {
        'Hearts-A': null,
        'Hearts-10': null,
        'Hearts-8': null,
    }

    const cardsTrickTest = {
        'Hearts-8': null,
        'Spades-A': null,
        'Hearts-10': null,
    }
    
    const resultTwoHearths = calculateHand(cardsTwoHearths);
    expect(resultTwoHearths).toBe(19);

    const resultThree8 = calculateHand(cardsThree8);
    expect(resultThree8).toBe(30.5);

    const resultSingles = calculateHand(cardsSingles);
    expect(resultSingles).toBe(11);

    const resultThreeHearths = calculateHand(cardsThreeHearths);
    expect(resultThreeHearths).toBe(29);

    const resultTrickTest = calculateHand(cardsTrickTest);
    expect(resultTrickTest).toBe(18);
});


it('findCardIdByAttr() It should return a string of the highest value cardID (key) based upon card attributes', ()=>{
    const findCardID = {
        'Hearts-8': null,
        'Clubs-8': null,
        'Hearts-A': null,
    };
    
    // const arr = ['Clubs-8', 'Hearts-8'];
    // const resultIconAttr = findCardIdByAttr(findCardID, 'icon', '8');
    // const resultIconAttr = findCardIdByAttr(findCardID, '8', 'low');
    // // expect(arr).toContain(resultIconAttr);
    // expect(resultIconAttr).toEqual(expect.arrayContaining(['Clubs-8', 'Hearts-8']));

    const resultSymbolAttrHigh = findCardIdByAttr(findCardID, 'Hearts', 'high');
    expect(resultSymbolAttrHigh).toBe('Hearts-A');
    const resultSymbolAttrLow = findCardIdByAttr(findCardID, 'Hearts', 'low');
    expect(resultSymbolAttrLow).toBe('Hearts-8');
});


it('filterCardsDB() It should return an Object holding a portion of the cardsDB based upon cardsInHand (keys) ', ()=>{
    const cardsInHand = {
        'Hearts-A': null,
        'Clubs-8': null,
        'Hearts-8': null,
    }
    const resultCardsInHand = filterCardsDB(cardsInHand, false);
    expect(resultCardsInHand).toBeTypeOf('object');
    expect(Object.keys(resultCardsInHand)).toEqual(expect.arrayContaining(['Hearts-A','Clubs-8','Hearts-8']));
    expect(resultCardsInHand['Hearts-A'].value).toBe(11);

    const resultNotCardsInHand = filterCardsDB(cardsInHand, true);
    expect(resultNotCardsInHand).toBeTypeOf('object');
    expect(Object.keys(resultNotCardsInHand)).not.toEqual(expect.arrayContaining(['Hearts-A','Clubs-8','Hearts-8']));
})


it('sortCardByValue() It Should return a (Decending) sorted Array or sorted Object (partial cardsDB) based upon card values',()=>{
    const cardsSortValues = {
        'Hearts-A': null,
        'Clubs-8': null,
        'Diamonds-10': null,
    }

    const resultSortValueArray = sortCardByValue(cardsSortValues, true);
    expect(resultSortValueArray).toEqual(expect.arrayContaining(['Hearts-A','Diamonds-10', 'Clubs-8']));

    const resultSortValueObject = sortCardByValue(cardsSortValues);
    expect(resultSortValueObject).toBeTypeOf('object'); // Array and Object are the same
    expect(Object.keys(resultSortValueObject)).toEqual(expect.arrayContaining(['Hearts-A','Diamonds-10', 'Clubs-8']));
    expect(resultSortValueObject['Hearts-A'].value).toBe(11);

});

it ('filterPlayers() Should',()=>{

})