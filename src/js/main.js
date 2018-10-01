'use strict';

{
/* global config */
const myUL = document.getElementById('myUL');
const myInput = document.getElementById('myInput');

  function fetchJSON(url, reqType) {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest();
        xhr.open(reqType, url);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status < 400) {
            resolve(xhr.response);
            } else {
            reject(new Error(`Network error1: ${xhr.status} - ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => reject(new Error('Network request failed'));
        xhr.send();
    });
  }


  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'html') {
        elem.innerHTML = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  async function retrieveData(url, reqType) {
        try {
            const data = await fetchJSON(url, reqType);
            data.sort((a, b) => a.Task.localeCompare(b.Task, 'fr', {ignorePunctuation: true}));
            data.forEach((item, index) => {
            createAndAppend('li', myUL, {html: item.Task});
            });
            markAsX();
            deleteItem();
        }
        catch(error) {
        createAndAppend('div', root, { html: error.message, class: 'alert-error' });
        }
  }

  function main(homePage, saveData) {
    retrieveData(homePage, 'GET');
    const addNewElement = document.getElementById('addNewElement');   
    addNewElement.addEventListener('click', (event) => {
        //newElement();
        //////////////////////////////
        myUL.innerHTML = "";
        console.log('First one : ', myInput.value);
        const data = {id: null, task: myInput.value, done: true};
    
        postData(saveData, data)
        .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
        .catch(error => console.error(error));
        myInput.value = "";
        retrieveData(homePage, 'GET');
    });
  }
  

function postData(url, data) {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            //"Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "manual", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()); // parses response to JSON
}

  const homePage = '/home';
  const saveData = '/save_data';

  window.onload = () => main(homePage, saveData);
  //window.onload = () => console.log('hoiiii');

}