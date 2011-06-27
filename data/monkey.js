console.log("this is content script with no privileges");
let $ = document.getElementById
let C = document.createElement;

function populate(results) {
  $('result-list').innerHTML = "";
  results.forEach(function ({title, url, revHost, isBookmarked, faviconData}) {
    let li = C('li');
    let el = C('div');
    let link = C('a');
    let blank1 = C('br');
    let blank2 = C('br');
    let blank3 = C('br');
    let website = C('span');
    let plus = C('a');
    let minus = C('a');

    function handleHostClick(e) {
    }

    function handlePlusClick(e) {
    }

    function handleMinusClick(e) {
    }

    let host = revHost.split('').reverse().join('').slice(1);
    website.setAttribute('class', 'website');
    website.innerHTML = host;
    
    plus.innerHTML = '(prioritize)';
    plus.setAttribute('class', 'website');
    plus.setAttribute('href', '#');
    plus.setAttribute('value', host);
    plus.addEventListener("click", handlePlusClick, false);
    minus.innerHTML = '(exclude)';
    minus.setAttribute('class', 'website');
    minus.setAttribute('href', '#');
    minus.setAttribute('value', host);
    minus.addEventListener("click", handleMinusClick, false);
    website.addEventListener("click", handleHostClick, false);
    
    let images = C('span')
    let favicon = C('img');
    let bookmarkI = C('img');
    favicon.setAttribute('src', faviconData);
    bookmarkI.setAttribute('src', 'img/star.png')
    let loc = C('span')
    loc.setAttribute('class', 'location');
    loc.innerHTML = url.slice(0,100);
    link.innerHTML = title;
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    el.setAttribute('class', 'result-info');
    el.appendChild(link);
    el.appendChild(blank1);
    el.appendChild(website);
    el.appendChild(plus);
    el.appendChild(minus);
    el.appendChild(blank2);
    el.appendChild(loc);
    images.setAttribute('class', 'icon-bookmark')
    images.appendChild(favicon);
    images.appendChild(blank3);
    bookmarkI.style.visibility = isBookmarked ? 'visible' : 'hidden';
    images.appendChild(bookmarkI);
    li.appendChild(images)
    li.appendChild(el);
    $('result-list').appendChild(li);

  });
}

self.on("message", function(data) {
  if (data.action == "display") {
    populate(data.results);
  } else {

  }
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

