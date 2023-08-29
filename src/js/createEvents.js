function mouseOverEvent(elem){

    elem.addEventListener(
        "mouseenter",
        (event) => {
            // Hover UP //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target);
            }
        },
        false,
      );

      elem.addEventListener(
        "mouseleave",
        (event) => {
            // Hover DOWN //
            const cardID = findCardID(elem);
            if (cardsDB[cardID].access && !cardsDB[cardID].picked){
                event.target.style = cardHoverEffect(event.target, reverse=true);
            }
        },
        false,
      );
}


function cardClickEvent(elem){
    elem.addEventListener('click', (event)=>{
        const cardID = findCardID(event.target.parentElement);
    
        if (cardsDB[cardID].access && players[0].active){
            pickCardEffect(event.target.parentElement);
        }

        if (cardPickedBank.length == 1 && cardPickPlayer.length == 1){
            enableDisablePlayHoldBtn(holdCardsBtn, 'hidden');
            enableDisablePlayHoldBtn(playCardsBtn, 'visible');
        }else{
            enableDisablePlayHoldBtn(playCardsBtn, 'hidden');
            enableDisablePlayHoldBtn(holdCardsBtn, 'visible');
        }
    })
}


function playCardsEvent(elem){
    elem.addEventListener('click',()=> playCards());
}


function playerHoldEvent(elem){
    elem.addEventListener('click',()=> playerHold());
}


function swapBankEvent(elem, pass){
    elem.addEventListener('click',()=> swapBank(pass));
}


function pickCardEffect(pickedElem){
    const cardID = findCardID(pickedElem);
    const location = cardsDB[cardID].location;

    if (location == 'center'){
        if (cardPickedBank.length == 0){
            cardPickedBank.push(cardID);
            cardsDB[cardID].picked = true;
        }else{
            if (cardID == cardPickedBank[0]){
                const unPickSameBankID = cardPickedBank.pop();
                cardsDB[unPickSameBankID].picked = false;
            }else{
                const unPickBankID = cardPickedBank.pop();
                cardsDB[unPickBankID].picked = false;
                cardPickedBank.push(cardID);
                cardsDB[cardID].picked = true;
                mouseLeaveEffect(cardsDB[unPickBankID].elem);
            }
        }
    }

    if (location == 'south'){
        if (cardPickPlayer.length == 0){
            cardPickPlayer.push(cardID);
            cardsDB[cardID].picked = true;
        }else{
            if (cardID == cardPickPlayer[0]){
                const unPickSamePlayerID = cardPickPlayer.pop();
                cardsDB[unPickSamePlayerID].picked = false;
            }else{
                const unPickPlayerID = cardPickPlayer.pop();
                cardsDB[unPickPlayerID].picked = false;
                cardPickPlayer.push(cardID);
                cardsDB[cardID].picked = true;
                mouseLeaveEffect(cardsDB[unPickPlayerID].elem);
            }           
        }
    }
}


function cardHoverEffect(hoverElem, reverse=false){
    let matrixStr = ''
    let targetStyle = hoverElem.getAttribute('style').split(/\s/);
    targetStyle = targetStyle.map(item => item.replace(',',''));
    const transform = targetStyle[0];
    const matrix3D = targetStyle.slice(1, targetStyle.length-2);
    const zIndex = targetStyle.slice(targetStyle.length -2);

    let hoverX = hoverOffsetX;
    let hoverY = hoverOffsetY

    if (reverse){
        hoverX = -1 * hoverX;
        hoverY = -1 * hoverY;
    }

    matrix3D[12] = Number(matrix3D[12]) - hoverX;
    matrix3D[13] = Number(matrix3D[13]) - hoverY;

    matrixStr = `${transform} ${matrix3D.toString()} ${zIndex.toString().replace(',', '')}}`;
    
    return matrixStr;
}

// Card Pick Should leave card in Hover UP state //
function mouseLeaveEffect(elem){
    const hoverDown = new Event("mouseleave");
    elem.dispatchEvent(hoverDown);
}




