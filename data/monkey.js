console.log("this is content script with no privileges");
let $ = document.getElementById

self.on("message", function(data) {
  console.log("got message from chrome");
});

document.getElementById('search-field').addEventListener("keyup", function(e) {
  e.preventDefault();
  self.postMessage({
    "action" : "search",
    "params" : {
      "query": $('search-field').value,
    }
  })
}, false);

self.postMessage({
  "search": "",
});
