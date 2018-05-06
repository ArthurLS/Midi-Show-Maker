var keys = {};
var content;
var data_file = './temp.json';
var project = JSON.parse(fs.readFileSync(data_file));

function add(key,event) {
    cmd='Mousetrap.bind("'+key+'", function(){switch_event("'+event+'");read_event();});';
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

    project.configuration.keysBindings[event]=key;
    fs.writeFileSync(data_file, JSON.stringify(project, null, 2));//Save du temp.json
    generateFile();
}

function generateFile(){
    var tmp = project.configuration.keysBindings;
    var tmp1="var Mousetrap = require(\"mousetrap\");\n"+
            +"Mousetrap.bind(\"space\", function () {pause_or_resume();});";

    fs.writeFileSync('app/js/keyBinding.js', '', function(){console.log('done')})

    fs.appendFileSync("app/js/keyBinding.js", tmp1+"\n", function(err) {
        if(err) {
            return console.log(err);
        }
    });

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
}
