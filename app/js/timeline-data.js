var d3 = require('d3');
d3.tip = require('d3-tip');
'use strict';
const element = document.getElementById('chart');
const data = [{
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

const timeline = new TimelineChart(element, data, {
    enableLiveTimer: true,
    tip: function(d) {
        return d.at || d.from +"<br>" + d.to;
    }
}).onVizChange(e => console.log(e));
