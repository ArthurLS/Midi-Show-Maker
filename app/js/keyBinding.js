var Mousetrap = require("mousetrap");
Mousetrap.bind("space", function () {pause_or_resume();});
Mousetrap.bind("j", function(){switch_event("TEST");read_event();});
Mousetrap.bind("j", function(){switch_event("hello");read_event();});
Mousetrap.bind("y", function(){switch_event("mario");read_event();});
