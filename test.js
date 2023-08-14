let cardInHand = {
    a: {x:0, y:0},
    b: {x:0, y:0},
    c: {x:0, y:0},
}

for (const [key, value] of Object.entries(cardInHand)) {
    console.log(`${key}: ${value}`);
  }

Object.keys(cardInHand).forEach((key, index) => console.log(key, index))