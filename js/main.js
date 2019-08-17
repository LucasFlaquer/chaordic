const listEl = document.querySelector('.top-five--list');
const formEl = document.getElementById('short-link');
const input = document.querySelector('#short-link input');
const button = document.querySelector('#short-link button');
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
formEl.onsubmit = event => {
  event.preventDefault();
  let input = document.querySelector('#short-link input');
  let button = document.querySelector('#short-link button');
  if (input.value === '') return;
  input.classList.add('hide');
  button.classList.add('hide');
  let random = Math.random().toString(36).substr(2, 3);
  input.value = `http://ch.dc/${random}`;
  button.innerHTML = 'Copiar';
  button.removeAttribute('type');
  button.setAttribute('onclick', 'copyLink()');
  input.classList.remove('hide');
  button.classList.remove('hide');
  input.classList.add('show');
  button.classList.add('show');
  setTimeout(() => {
    input.classList.remove('show');
  } , 1000);
  button.classList.remove('show');
  input.parentElement.classList.toggle('shorted');
  let clear = document.createElement('span');
  clear.appendChild(document.createTextNode('\u00D7'));
  clear.setAttribute('class', 'clear');
  input.parentElement.appendChild(clear);
  clear.setAttribute('id', 'clear-field');
  clear.setAttribute('onclick', `clearfield('${clear.id}')`);
};


function clearfield(id) {
  document.getElementById(id).remove();
  input.parentElement.classList.remove('shorted');
  input.classList.add('hide');
  input.classList.remove('hide');
  input.classList.add('show');
  input.classList.remove('show');
  button.innerHTML = 'Encurtar';
  button.removeAttribute('onclick');
  button.setAttribute('type','submit');
  input.value = '';

}
function copyLink() {
  input.select();
  document.execCommand("copy");
  alert("Este link foi copiado com sucesso: " + input.value);
  clearfield('clear-field');
}