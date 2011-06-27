const self = require("self");
const tabs = require("tabs");
const pageMod = require("page-mod");
const searcher = require("search");
const helpers = require("helpers");
const menuitem = require("menuitem")
const {Hotkey} = require("hotkeys");
const {Cc, Cu, Ci, Cm} = require("chrome");
const widgets = require("widget");
 

function recall() {
  let tab = tabs.open({
    "url" : self.data.url("dashboard.html"),
    "title" : "Recall",
    "favicon" : self.data.url("monkey.png"),
  });
}

widgets.Widget({
  id: "recall-monkey-launcher",
  label: "Launch Recall Monkey",
  contentURL: self.data.url("img/monkey.png"),
  onClick: function() {
    recall();
  }
});

let sr = new searcher.search();

let mod = pageMod.PageMod({
  include: "resource://recallmonkey-at-prospector-dot-labs-dot-mozilla-recallmonkey-data/*",
  contentScriptFile: self.data.url("monkey.js"),
  onAttach: function attached(worker) {
    worker.postMessage("message from chrome into content");
    worker.on("message", function(data) {
      console.log(JSON.stringify(data));
      if (data.action == "search") {
        let results = sr.search(data.params.query, data.params);
        console.log(JSON.stringify(results));
        worker.postMessage({
          "action" : "display",
          "results": results,
        })
      }
    });
  }
});




var showHotKey = Hotkey({
  combo: "accel-shift-m",
  onPress: function() {
    recall();
  }
});
//let tab = tabs.open(self.data.url("dashboard.html"));
