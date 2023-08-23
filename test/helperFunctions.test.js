import { it, expect, describe } from 'vitest';
import { cardAttrCount, returnKeysFromCount, calculateHand, playerPass, findCardIdByAttr, filterCardsDB, sortCardByValue } from './src/helperFunctions.js';

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


it('returnKeysFromCount() Should return an Array of Key(s) based upon count value', ()=>{
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

    const resultAttrCountTest1 =  returnKeysFromCount(attrCountTest1, 1, 'min');
    expect(resultAttrCountTest1).toEqual(expect.arrayContaining(['8','A','10']));

    const resultAttrCountTest2a = returnKeysFromCount(attrCountTest2, 2, 'min');
    expect(resultAttrCountTest2a).toEqual(['8'])
    const resultAttrCountTest2b = returnKeysFromCount(attrCountTest2, 1, 'max');
    expect(resultAttrCountTest2b).toEqual(['A'])

    const resultAttrCountTest3 =  returnKeysFromCount(attrCountTest3, 3, 'min');
    expect(resultAttrCountTest3).toEqual(['8']);
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
        'Diamond-8': null,
    }
    
    const cardsSingles = {
        'Clubs-8': null,
        'Diamond-8': null,
        'Hearts-A': null,
    }
    
    const cardsThreeHearths = {
        'Hearts-A': null,
        'Hearts-10': null,
        'Hearts-8': null,
    }
    
    const resultTwoHearths = calculateHand(cardsTwoHearths);
    expect(resultTwoHearths).toBe(19);

    const resultThree8 = calculateHand(cardsThree8);
    expect(resultThree8).toBe(30.5);

    const resultSingles = calculateHand(cardsSingles);
    expect(resultSingles).toBe(11);

    const resultThreeHearths = calculateHand(cardsThreeHearths);
    expect(resultThreeHearths).toBe(29);
});


it('playerPass() It should return a string value to either pass or keep playing',()=>{
    const cards29 = {
        'Hearts-A': null,
        'Hearts-10': null,
        'Hearts-8': null,
    }

    const cards11 = {
        'Clubs-8': null,
        'Diamond-8': null,
        'Hearts-A': null,
    }

    const result29 = playerPass(cards29, 28);
    expect(result29).toBe('Player Pass');

    const result11 = playerPass(cards11, 28);
    expect(result11).toBe('Keep Playing');
})

it('findCardIdByAttr() It should return a string of the highest value cardID (key) based upon card attributes', ()=>{
    const findCardID = {
        'Hearts-A': null,
        'Clubs-8': null,
        'Hearts-8': null,
    }
    
    const arr = ['Clubs-8', 'Hearts-8']
    const resultIconAttr = findCardIdByAttr(findCardID, 'icon', '8');
    expect(arr).toContain(resultIconAttr);

    const resultSymbolAttr = findCardIdByAttr(findCardID, 'symbol', 'Hearts');
    expect(resultSymbolAttr).toBe('Hearts-A')
})

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
        'Diamond-10': null,
    }

    const resultSortValueArray = sortCardByValue(cardsSortValues, true);
    expect(resultSortValueArray).toEqual(expect.arrayContaining(['Hearts-A','Diamond-10', 'Clubs-8']));

    const resultSortValueObject = sortCardByValue(cardsSortValues);
    expect(resultSortValueObject).toBeTypeOf('object'); // Array and Object are the same
    expect(Object.keys(resultSortValueObject)).toEqual(expect.arrayContaining(['Hearts-A','Diamond-10', 'Clubs-8']));
    expect(resultSortValueObject['Hearts-A'].value).toBe(11);

})