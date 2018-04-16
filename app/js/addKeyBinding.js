var keys = {};
var content;
var data_file = './temp.json';
var project = JSON.parse(fs.readFileSync(data_file));
var Mousetrap = require("mousetrap");

function add(key,event) {
    cmd='Mousetrap.bind("'+key+'", function(){switch_event("'+event+'");read_event();});';//String
    if(keys[event] == null){//if no key previously added
        keys[event]=[key];
    }
    else{//If key already added
        keys[event].push(key);
    }
    localStorage.setItem("keys",JSON.stringify(keys));

    fs.appendFileSync("app/js/keyBinding.js", cmd+"\n", function(err) {
        if(err) {
            return console.log(err);
        }
    });
    //var text = fs.readFileSync('app/js/keyBinding.js','utf8');
    //project.configuration.keysBindings[event]=[key];

    project.configuration.keysBindings[event]=key;
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));//Save du temp.json
    generateFile();
    //console.log(keys);
}
function generateFile(){

    var tmp =project.configuration.keysBindings;
    tmp1='Mousetrap.bind("space", function () {pause_or_resume();});';

    //fs.truncate("app/js/keyBinding.js", 0, function(){console.log('done')})
    fs.writeFileSync('app/js/keyBinding.js', '', function(){console.log('done')})

    fs.appendFileSync("app/js/keyBinding.js", tmp1+"\n", function(err) {
        if(err) {
            return console.log(err);
        }
    });
//to finish

    for(var key in project.configuration.keysBindings) {
        console.log("key:"+key+" val"+project.configuration.keysBindings[key]);
        cmd='Mousetrap.bind("'+project.configuration.keysBindings[key]+'", function(){switch_event("'+key+'");read_event();});';//String

        fs.appendFileSync("app/js/keyBinding.js", cmd+"\n", function(err) {
            if(err) {
                return console.log(err);
            }
        });
    }
    console.log("finished");

    //fs.writeFileSync(data_file, JSON.stringify(project, null, 2));//Save du temp.json

}
