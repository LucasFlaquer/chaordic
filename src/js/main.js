var listEl = document.querySelector('.top-five--list');
var LinksUrl = function() {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './js/data/urls.json');
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject('errp de reqiosocao');
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  LinksUrl()
  .then(function(response) {
    renderLinks(orderLinks(response));
  })
  .catch(function(error) {
    console.log(error);
  });

});

function orderLinks(links) {
  links.sort(function(a,b) {
    if(a.hits < b.hits) 
      return 1;
    if(a.hits > b.hits)
      return -1;
    return 0;
  });
  return links;
}
function renderLinks(links) {
  listEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    var itemEl = document.createElement('li');
    itemEl.setAttribute('class', 'top-five--item');

    var linkEl = document.createElement('a');
    linkEl.setAttribute('class', 'top-five--link');
    linkEl.setAttribute('href', links[i].url);
    linkEl.setAttribute('target', '_blank');
    linkEl.appendChild(document.createTextNode(links[i].shortUrl));
    
    var hitsEl = document.createElement('span');
    hitsEl.setAttribute('class', 'top-five--number');
    hitsEl.appendChild(document.createTextNode(links[i].hits));

    itemEl.appendChild(linkEl);
    itemEl.appendChild(hitsEl);
    listEl.appendChild(itemEl);    
  }
}