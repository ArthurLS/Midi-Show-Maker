var d3 = require('d3');
d3.tip = require('d3-tip');


var data_file = 'app/json/data.json';
var mario = JSON.parse(fs.readFileSync(data_file));

'use strict';
const element = document.getElementById('chart');

function makedata(mario) {

    var data = [];
    var start = 0; //on démarre à 0
    var obj = new Object();  //objet temporaire

    obj.label = "mario"; //temporaire
    obj.data = [];

    for (let i = 0; i < mario.cue_list.length; i++) {

        var one = mario.cue_list[i];

        var two = new Object();
        two.label = ''; //TODO: appeler fonction qui prend la hauteur et renvoie note CDEFGAB musique
        two.type = TimelineChart.TYPE.INTERVAL;
        two.from = new Date(start); //équivaut à des ms
        two.to = new Date(start + one.delay);
        two.customClass = 'blue-interval';
        two.hauteur = one.options.note;

        start += one.delay; //update pour les notes suivantes
        //console.log(two);
        obj.data.push(two);
    }

    return obj;

}

console.log( makedata(mario));

var data = [makedata(mario)]; /*[{
    label: 'Name',
    data: [{
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 5, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 6, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 7, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 8, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 9, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 10, 1]),
        customClass: 'blue-dot'
    }]
}, {
    label: 'Type',
    data: [{
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 5, 11])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 5, 15])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 7, 10])
    }, {
        label: 'I\'m a label with a custom class',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2016, 6, 1]),
        to: new Date([2016, 7, 1]),
        customClass: 'blue-interval'
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 10, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 11, 1])
    }]
}, {
    label: 'Imp',
    data: [{
        label: 'Label 1',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2016, 5, 15]),
        to: new Date([2016, 7, 1])
    }, {
        label: 'Label 2',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2016, 8, 1]),
        to: new Date([2016, 9, 12])
    }]
}];

/* const data = [{
    label: 'Name',
    data: [{
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 5, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 6, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 7, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 8, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 9, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 10, 1]),
        customClass: 'blue-dot'
    }]
}, {
    label: 'Type',
    data: [{
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 5, 11])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 5, 15])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 7, 10])
    }, {
        label: 'I\'m a label with a custom class',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2016, 6, 1]),
        to: new Date([2016, 7, 1]),
        customClass: 'blue-interval'
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 10, 1])
    }, {
        type: TimelineChart.TYPE.POINT,
        at: new Date([2016, 11, 1])
    }]
}, {
    label: 'Imp',
    data: [{
        label: 'Label 1',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2016, 5, 15]),
        to: new Date([2016, 7, 1])
    }, {
        label: 'Label 2',
        type: TimelineChart.TYPE.INTERVAL,
        from: new Date([2016, 8, 1]),
        to: new Date([2016, 9, 12])
    }]
}];
*/

const timeline = new TimelineChart(element, data, {
    enableLiveTimer: true,
    tip: function(d) {
        return d.at || d.from +"<br>" + d.to;
    }
}).onVizChange(e => console.log(e));

/*
note: penser à changer dans timeline-graph.js le fait qu'on commence à 0 (voir domaine de d3) -> FAIT
ajouter une classe particulière qui indiquera la chroma: selectionné par jquery pour changer la couleur, et ce en fonction du nombre de channels
à ce propos: comptabiliser le nombre de channel dans une première passe
modifier le système de label pour que si label = "" alors pas de traits de séparation d'une autre couleur -> FAIT

penser à appeler cette fonction (makedata) à chaque fois qu'on:
    - modifie le json (cue)

penser à faire bouger la ligne rouge à chaque fois:
    - qu'on est en lecture
*/
