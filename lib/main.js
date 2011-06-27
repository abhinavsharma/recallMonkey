const self = require("self");
const tabs = require("tabs");
const pageMod = require("page-mod");
const searcher = require("search");
let sr = new searcher.search();

let mod = pageMod.PageMod({
  include: "resource://recallmonkey-dot-labs-dot-mozilla-at-jetpack-recallmonkey-data/*",
  contentScriptFile: self.data.url("monkey.js"),
  onAttach: function attached(worker) {
    worker.postMessage("message from chrome into content");
    worker.on("message", function(data) {
      console.log(JSON.stringify(data));
      if (data.action == "search") {
        sr.search(data.params.query, {
          timeRange: 0,
          limit: 50,
          skip: 0,
        });
      }
    });
  }
});

let tab = tabs.open(self.data.url("dashboard.html"));
