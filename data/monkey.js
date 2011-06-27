console.log("this is content script with no privileges");
const reportError = console.log
let $ = document.getElementById
let C = document.createElement;
let J = JSON.stringify;

function Dashboard() {
  let me = this;
  me.fluidLists = {
    "prioritized" : [],
    "excluded" : [],
  }

  function handleSubmit (e) {
    reportError("handling submission 1/2");
    e.preventDefault();
    me.handleSubmit(e);
  }

  function handleChangeSubmit(e) {
    me.handleSubmit(e);
  }

  $('search-form').addEventListener("submit", handleSubmit, false);
  $('search-form').addEventListener("keyup", handleSubmit, false);
  $('time-form').addEventListener("click", handleChangeSubmit, false);

}

Dashboard.prototype.handleSubmit = function(e) {
  try {
  let me = this;
  if (e) {
    me.e = e;
  } else if (me.e) {
    e = me.e;
  }

  let params = {
    "preferredHosts": me.fluidLists["prioritized"],
    "excludedHosts": me.fluidLists["excluded"],
    "limit": 50,
    "skip": 0,
  };

  let timeRange = 0;
  let elems = document.getElementsByName('timerange');

  for (let i = 0; i < elems.length; i++) {
    let elem = elems[i];
    if (elem.checked) {
      timeRange = parseInt(elem.value);
    }
  }
  reportError("TIME RANGE: " + timeRange);

  params['timeRange'] = timeRange;
  params['query'] = $('search-field').value;
  reportError(J(params));
  self.postMessage({
    "action" : "search",
    "params" : params,
  });
  } catch (ex) {console.log(ex) }
}

Dashboard.prototype.addPinned = function(revHost, listType) {
  console.log("adding pinned")
  try {
  let me = this;
  for (let list in me.fluidLists) {
    let i = me.fluidLists[list].indexOf(revHost);
    if (list != listType && i >= 0) {
      me.fluidLists[list].splice(i, 1);
      me.refreshPinned(list);
    }
  }
  let idx = me.fluidLists[listType].indexOf(revHost);
  reportError(revHost);
  reportError(idx);
  if (idx < 0) {
    me.fluidLists[listType].push(revHost);
  }
  console.log(listType);
  me.refreshPinned(listType);

  } catch (ex) { console.log(ex) }
};

Dashboard.prototype.removePinned = function(revHost, listType) {
  let me = this;
  let idx = me.fluidLists[listType].indexOf(revHost);
  reportError(idx);
  if (idx < 0) {
    return;
  }
  me.fluidLists[listType].splice(idx, 1);
  me.refreshPinned(listType);
}

Dashboard.prototype.refreshPinned = function(listType) {
  let me = this;

  function handleUnpinClick(e) {
    me.handleUnpinClick(e);
  }

  $(listType + '-list').innerHTML = "";
  me.fluidLists[listType].forEach(function(revHost) {
    let link = C('a')
    link.setAttribute('class', 'website');
    let webName = revHost.split('').reverse().join('').slice(1);
    link.innerHTML = 'X ' + webName;
    link.setAttribute('href', '#');
    link.setAttribute('value', listType);
    link.addEventListener("click", handleUnpinClick, false);
    let el = C('li');
    el.appendChild(link);
    $(listType + '-list').appendChild(el);
  });
  me.handleSubmit();
}

Dashboard.prototype.handleUnpinClick = function(e) {
  let me = this;
  e.preventDefault();
  let webName = e.target.innerHTML;
  let listType = e.target.getAttribute('value');
  let revHost = webName.slice(2).split('').reverse().join('') + '.';
  me.removePinned(revHost, listType);
}



Dashboard.prototype.populate = function(results) {
  let me = this;
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

    function handlePlusClick(e) {
      me.handlePlusClick(e);
    }

    function handleMinusClick(e) {
      me.handleMinusClick(e);
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

Dashboard.prototype.handlePlusClick = function(e) {
  let me = this;
  e.preventDefault();
  let revHost = ("." + e.target.getAttribute('value')).split('').reverse().join('');
  me.addPinned(revHost, "prioritized");
}

Dashboard.prototype.handleMinusClick = function(e) {
  let me = this;
  e.preventDefault();
  let revHost = ("." + e.target.getAttribute('value')).split('').reverse().join('');
  me.addPinned(revHost, "excluded");
}

var dash = new Dashboard();


self.on("message", function(data) {
  if (data.action == "display") {
    dash.populate(data.results);
  } else {

  }
  console.log("got message from chrome");
});

self.postMessage({
  "search": "",
});

