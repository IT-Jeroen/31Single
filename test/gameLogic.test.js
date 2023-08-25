import { it, expect, describe } from 'vitest';
import { findCardMatch, findCardMatch2, findCardMatch3, pickACard, playerPass } from './src/gameLogic.js';

describe('findCardMatch()  When the playerCardsInHand has no matching icons or symbols',()=>{
    it('It should return an Array with cardIDs where [0] is the pickBankCard and [1] is the dropHandCard', ()=>{

        const playerCards = {'Clubs-8':null, 'Diamonds-10':null, 'Hearts-A':null};
        const bankCards = {'Clubs-9':null, 'Diamonds-8':null, 'Hearts-10':null};
        const bankCardsNone = {'Spades-9':null, 'Spades-8':null, 'Spades-10':null};

        const resultSymbol = findCardMatch(playerCards, bankCards, 'symbol');
        expect(resultSymbol).toEqual(expect.arrayContaining(['Hearts-10', 'Clubs-8']));
        expect(resultSymbol[0]).toBe('Hearts-10');
        expect(resultSymbol[1]).toBe('Clubs-8');

        const resultIcon = findCardMatch(playerCards, bankCards, 'icon');
        expect(resultIcon).toEqual(expect.arrayContaining(['Hearts-10', 'Clubs-8']));
        expect(resultIcon[0]).toBe('Hearts-10');
        expect(resultIcon[1]).toBe('Clubs-8');
        
        const resultNone = findCardMatch(playerCards, bankCardsNone, 'symbol');
        expect(resultNone).toEqual(expect.arrayContaining(['None', 'None']));
        expect(resultNone[0]).toBe('None');
        expect(resultNone[1]).toBe('None');
    });
});

describe('findCardMatch2()  When the playerCardsInHand has 2 matching icons or symbols',()=>{
    it('It should return an Array with cardIDs where [0] is the pickBankCard and [1] is the dropHandCard', ()=>{

        const playerCardsSymbol = {'Hearts-8':null, 'Diamonds-10':null, 'Hearts-A':null};
        const playerCardsIcon = {'Hearts-8':null, 'Diamonds-8':null, 'Hearts-A':null};
        const bankCards = {'Clubs-8':null, 'Diamonds-9':null, 'Hearts-10':null};
        const bankCardsNone = {'Clubs-8':null, 'Diamonds-9':null, 'Diamonds-8':null};

        const resultSymbol = findCardMatch2(playerCardsSymbol, bankCards, 'symbol');
        expect(resultSymbol).toEqual(expect.arrayContaining(['Hearts-10', 'Diamonds-10']));
        expect(resultSymbol[0]).toBe('Hearts-10');
        expect(resultSymbol[1]).toBe('Diamonds-10');

        const resultIcon = findCardMatch2(playerCardsIcon, bankCards, 'icon');
        expect(resultIcon).toEqual(expect.arrayContaining(['Clubs-8', 'Hearts-A']));
        expect(resultIcon[0]).toBe('Clubs-8');
        expect(resultIcon[1]).toBe('Hearts-A');

        const resultNone = findCardMatch2(playerCardsSymbol, bankCardsNone, 'symbol');
        expect(resultNone).toEqual(expect.arrayContaining(['None', 'None']));
        expect(resultNone[0]).toBe('None');
        expect(resultNone[1]).toBe('None');
    
    });
});

describe('findCardMatch3()  When the playerCardsInHand has 3 matching icons or symbols',()=>{
    it('It should return an Array with cardIDs where [0] is the pickBankCard and [1] is the dropHandCard', ()=>{

        const playerCards = {'Hearts-8':null, 'Hearts-10':null, 'Hearts-A':null};
        const bankCards9 = {'Clubs-9':null, 'Diamonds-8':null, 'Hearts-9':null};
        const bankCardsNone = {'Clubs-9':null, 'Diamonds-8':null, 'Diamonds-9':null};
        
        const result9 = findCardMatch3(playerCards, bankCards9, 'symbol');
        expect(result9).toEqual(expect.arrayContaining(['Hearts-9', 'Hearts-8']));
        expect(result9[0]).toBe('Hearts-9');
        expect(result9[1]).toBe('Hearts-8');

        const resultNone = findCardMatch3(playerCards, bankCardsNone, 'symbol');
        expect(resultNone).toEqual(expect.arrayContaining(['None', 'None']));
        expect(resultNone[0]).toBe('None');
        expect(resultNone[1]).toBe('None');
    });
});

it('playerPass() It should return a string value to either pass or keep playing',()=>{
    const cards29 = {
        'Hearts-A': null,
        'Hearts-10': null,
        'Hearts-8': null,
    }

    const cards11 = {
        'Clubs-8': null,
        'Diamonds-8': null,
        'Hearts-A': null,
    }

    const result29 = playerPass(cards29, 28);
    expect(result29).toBe('Player Pass');

    const result11 = playerPass(cards11, 28);
    expect(result11).toBe('Keep Playing');
})

describe('pickACard() The main function that calls the findCardMatch functions',()=>{

    it('findCardMatch() It should return an Array with cardIDs where [0] is the pickBankCard and [1] is the dropHandCard', ()=>{

        const playerCards = {'Clubs-8':null, 'Diamonds-10':null, 'Hearts-K':null};
        const bankCardsChaseSymbols = {'Clubs-9':null, 'Diamonds-8':null, 'Hearts-10':null};
        const bankCardsChaseIcons = {'Spades-9':null, 'Spades-8':null, 'Spades-10':null};
        const playerCardsChaseNone = {'Clubs-9':null, 'Diamonds-J':null, 'Hearts-K':null};
        const bankCardsChaseNone = {'Spades-7':null, 'Spades-8':null, 'Spades-10':null};

        // Match with Symbol (Preferred) //
        const resultChaseSymbols = pickACard(playerCards, bankCardsChaseSymbols);
        expect(resultChaseSymbols).toEqual(expect.arrayContaining(['Hearts-10', 'Clubs-8']));
        expect(resultChaseSymbols[0]).toBe('Hearts-10');
        expect(resultChaseSymbols[1]).toBe('Clubs-8');
        // If NO match with Symbol use Icon //
        const resultChaseIcons = pickACard(playerCards, bankCardsChaseIcons);
        expect(resultChaseIcons).toEqual(expect.arrayContaining(['Spades-10', 'Clubs-8']));
        expect(resultChaseIcons[0]).toBe('Spades-10');
        expect(resultChaseIcons[1]).toBe('Clubs-8');
        // If NO match at all pick highest bankCard and lowest handCard //
        const resultNone = pickACard(playerCardsChaseNone , bankCardsChaseNone);
        expect(resultNone).toEqual(expect.arrayContaining(['Spades-10', 'Clubs-9']));
        expect(resultNone[0]).toBe('Spades-10');
        expect(resultNone[1]).toBe('Clubs-9');
    });

    it('findCardMatch2() It should return an Array with cardIDs where [0] is the pickBankCard and [1] is the dropHandCard', ()=>{
        
        const playerCardsSymbol = {'Hearts-8':null, 'Diamonds-10':null, 'Hearts-A':null};
        const playerCardsIcon = {'Hearts-8':null, 'Diamonds-8':null, 'Hearts-A':null};
        const playerCardsSymbolIcon = {'Hearts-8':null, 'Diamonds-8':null, 'Hearts-A':null};
        const bankCards = {'Clubs-8':null, 'Diamonds-9':null, 'Hearts-10':null};
        const bankCardsNone = {'Clubs-8':null, 'Diamonds-9':null, 'Diamonds-8':null};

        const resultSymbol = pickACard(playerCardsSymbol, bankCards);
        expect(resultSymbol).toEqual(expect.arrayContaining(['Hearts-10', 'Diamonds-10']));
        expect(resultSymbol[0]).toBe('Hearts-10');
        expect(resultSymbol[1]).toBe('Diamonds-10');

        const resultIcon = pickACard(playerCardsIcon, bankCards);
        expect(resultIcon).toEqual(expect.arrayContaining(['Clubs-8', 'Hearts-A']));
        expect(resultIcon[0]).toBe('Clubs-8');
        expect(resultIcon[1]).toBe('Hearts-A');

        const resultSymbolIcon = pickACard(playerCardsSymbolIcon, bankCards);
        expect(resultSymbolIcon).toEqual(expect.arrayContaining(['Clubs-8', 'Hearts-A']));
        expect(resultSymbolIcon[0]).toBe('Clubs-8');
        expect(resultSymbolIcon[1]).toBe('Hearts-A');

        const resultNone = pickACard(playerCardsSymbol, bankCardsNone);
        expect(resultNone).toEqual(expect.arrayContaining(['Diamonds-9', 'Diamonds-10']));
        expect(resultNone[0]).toBe('Diamonds-9');
        expect(resultNone[1]).toBe('Diamonds-10');
    });

    it('findCardMatch3() It should return an Array with cardIDs where [0] is the pickBankCard and [1] is the dropHandCard Or pass with cardsInHand', ()=>{
        const playerCards = {'Hearts-8':null, 'Hearts-10':null, 'Hearts-A':null};
        const playerCardsPassSymbol = {'Hearts-K':null, 'Hearts-10':null, 'Hearts-A':null};
        const playerCardsPassIcon = {'Clubs-8':null, 'Diamonds-8':null, 'Hearts-8':null};
        const bankCards9 = {'Clubs-9':null, 'Diamonds-10':null, 'Hearts-9':null};
        const bankCardsNone = {'Clubs-9':null, 'Diamonds-8':null, 'Diamonds-9':null};
        
        const result9 = pickACard(playerCards, bankCards9);
        expect(result9).toEqual(expect.arrayContaining(['Hearts-9', 'Hearts-8']));
        expect(result9[0]).toBe('Hearts-9');
        expect(result9[1]).toBe('Hearts-8');

        const resultSymbolPass = pickACard(playerCardsPassSymbol, bankCards9);
        expect(resultSymbolPass).toEqual(expect.arrayContaining(['Player Pass', playerCardsPassSymbol]));
        expect(resultSymbolPass[0]).toBe('Player Pass');
        expect(resultSymbolPass[1]).toEqual(playerCardsPassSymbol);

        const resultIconPass = pickACard(playerCardsPassIcon, bankCards9);
        expect(resultIconPass).toEqual(expect.arrayContaining(['Player Pass', playerCardsPassIcon]));
        expect(resultIconPass[0]).toBe('Player Pass');
        expect(resultIconPass[1]).toEqual(playerCardsPassIcon);

        const resultNone = pickACard(playerCards, bankCardsNone);
        expect(resultNone).toEqual(expect.arrayContaining(['Player Pass', playerCards]));
        expect(resultNone[0]).toBe('Player Pass');
        expect(resultNone[1]).toEqual(playerCards);
    });

    it('Should swap with bank if the score for bankCards is bigger than the score of handCards and a min score value (29)', ()=>{
        const playerCards = {'Hearts-8':null, 'Hearts-10':null, 'Hearts-A':null};
        const bankCards30 = {'Spades-10':null, 'Spades-J':null, 'Spades-Q':null};
        const bankCardsIcons = {'Clubs-9':null, 'Hearts-9':null, 'Diamonds-9':null};
        const bankCardsNoSwap = {'Spades-7':null, 'Spades-8':null, 'Spades-9':null}

        const result30 = pickACard(playerCards, bankCards30);
        expect(result30).toEqual(expect.arrayContaining(['Take Bank', bankCards30]));
        expect(result30[0]).toBe('Take Bank');
        expect(result30[1]).toEqual(bankCards30);

        const resultIcons = pickACard(playerCards, bankCardsIcons);
        expect(resultIcons).toEqual(expect.arrayContaining(['Take Bank', bankCardsIcons]));
        expect(resultIcons[0]).toBe('Take Bank');
        expect(resultIcons[1]).toEqual(bankCardsIcons);

        const resultNoSwap = pickACard(playerCards, bankCardsNoSwap);
        expect(resultNoSwap[0]).not.toBe('Take Bank');

    })

})

