function filterPlayersById(ids, exclude=true){
    // Conversion num to string and vise versa //
    if (exclude){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !ids.includes(k)));
    }
    else{
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => ids.includes(k)));
    }
}

function filterPlayersByName(names, exclude=true){
    // Conversion to lower Case //
    if (exclude){
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => !names.includes(v.name)));
    } else {
        return Object.fromEntries(Object.entries(players).filter(([k,v]) => names.includes(v.name)));
    }
}

function filterPlayers(field, valuesArr, filterOut=true){
    // Conversion to lower Case //

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

const players = {
    '0': {"name":'Local Player', "location": 'south', 'cards-in-hand':{'a':{'elem': 'elem-a'},'b':{'elem': 'elem-b'}}, 'wins': 0, 'orientation': ''},
    '1': {"name":'Ziva', "location": 'west', 'cards-in-hand':{}, 'wins': 0, 'orientation': ''},
    '2': {"name":'Dad', "location": 'north', 'cards-in-hand':{}, 'wins': 0, 'orientation': ''},
    '3': {"name":'Mum', "location": 'east', 'cards-in-hand':{}, 'wins': 0, 'orientation': ''},
    '4': {"name":'Bank', "location": 'center', 'cards-in-hand':{}, 'wins': 0, 'orientation': ''},
}

// console.log(filterPlayersById(['4']));
// console.log(filterPlayersById(['4'], exclude=false));
// console.log(filterPlayersByName(['Bank']));
// console.log(filterPlayersByName(['Bank'], exclude=false));
// console.log(filterPlayers('name',['Bank']));
// console.log(filterPlayers('name',['Bank'], filterOut=false));
// console.log(filterPlayers('key',['0', '4']));
// console.log(filterPlayers('key',['0', '4'], filterOut=false));



for (const [id, card] of Object.entries(players[0]['cards-in-hand'])) {
 console.log(id, card)
}

