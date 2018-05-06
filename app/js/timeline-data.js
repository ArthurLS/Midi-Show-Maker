var d3 = require('d3');
d3.tip = require('d3-tip');

/*note: the first event_obj is now called event_obj*/

'use strict';
const element = document.getElementById('chart');

function hauteurtostring(hauteur){
    var pitch = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const result = pitch[hauteur%12] + (((hauteur - hauteur%12)/12) - 1).toString(); //démo 10 min ou 15 min par groupe. -> 7 min chacun
    return result;
}

function channeltostring(channel){
    var color = ['blue-interval', 'red-interval', 'orange-interval', 'purple-interval', 'light-green-interval', 'green-interval'];
    return color[(channel % color.length)];
}

function makedata(event_obj) {

    if ((event_obj === '{}' || event_obj === 'undefined' || event_obj == null) || (event_obj.cue_list === '{}' || event_obj.cue_list === 'undefined' || event_obj.cue_list == null)){
        return ({
            label : "",
            data : []
        });
    }


    var data = [];
    var start = 0; //on démarre à 0
    var obj = new Object();  //objet temporaire

    obj.label = event_selected; //temporaire
    obj.data = [];

    for (let i = 0; i < event_obj.cue_list.length; i++) {

        var one = event_obj.cue_list[i];

        var two = new Object();
        two.label = hauteurtostring(one.options.param1);//'a'; //TODO: appeler fonction qui prend la hauteur et renvoie note CDEFGAB musique

        two.type = TimelineChart.TYPE.INTERVAL;
        two.from = new Date(one.delay); //équivaut à des ms
        //two.from = (new Date(one.delay - 100)); //équivaut à des ms
        two.to = new Date(one.delay+10);

        two.customClass = channeltostring(one.channel);
        two.hauteur = one.options.param1;

        start = one.delay; //update pour les notes suivantes
        obj.data.push(two);
    }

    return obj;

}

var data = [makedata(event_obj)]; 
var timeline = new TimelineChart(element, data, {
    enableLiveTimer: true,
    tip: function(d) {
        return d.at || d.from +"<br>" + d.to;
    }
}).onVizChange(e => console.log(e));

function refresh_Timeline() {
    var chartDiv = document.getElementById('svgChart');
    if (chartDiv != null){
        chartDiv.remove();
    }

    data = [makedata(event_obj)];
    timeline = new TimelineChart(element, data, {
        enableLiveTimer: true,
        tip: function(d) {
            return d.at || d.from +"<br>" + d.to;
        }
    }).onVizChange(e => console.log(e));
}

$(window).on('resize', function(e) {
        refresh_Timeline();
})
