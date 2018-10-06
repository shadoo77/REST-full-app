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

  async function main(homePage, saveData) {
    const addNewElement = document.getElementById('addNewElement'); 
    try {
      const items = await fetchJSON(homePage, 'GET');
      items.forEach((item, index) => {
        if(item.Done == 0) {
          createAndAppend('li', myUL, {html: item.Task, value: item.ID});
        }else {
          createAndAppend('li', myUL, {html: item.Task, value: item.ID, class: "checked"});
        }
      });
      markAsX();
      addNewElement.addEventListener('click', async () => {
        const taskData = {id: null, task: myInput.value, done: true};
      
        postData(saveData, taskData, 'POST')
          .then(taskData => JSON.stringify(taskData)) // JSON-string from `response.json()` call
          .catch(error => console.error(error));
        try {
          const allItems = await fetchJSON(homePage, 'GET');
          const maxId = allItems.reduce((prev, next) => prev.ID > next.ID ? prev.ID : next.ID);
          newElement(maxId);
          myInput.value = "";
        } catch(err) { console.log(err) }
      });

      ////////////////// Delete item here ////////////////////
      try {
        const why = await fetchJSON(homePage, 'GET');
        const closeClass = document.getElementsByClassName("close");
        for(let i = 0; i < why.length; i++) {
          closeClass[i].addEventListener('click', (event) => {
            const elemId = event.target.parentNode.value;
            const div = event.target.parentNode;
            div.style.display = "none";
            const data = {index: elemId};
            postData(deleteData, data, 'DELETE')
              .then(data => JSON.stringify(data)) // JSON-string from `response.json()` call
              .catch(error => console.error(error));          
          });
        }
      }
      catch(err) {
        console.log(err);
      }
      
      ////////////////////////////////////////////////////////
    }
    catch(error) {
      createAndAppend('div', root, { html: error.message, class: 'alert-error' });
    }
  }

function postData(url, data, methodType) {
  // Default options are marked with *
    return fetch(url, {
        method: methodType, // *GET, POST, PUT, DELETE, etc.
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
  const deleteData = '/delete_data';

  window.onload = () => main(homePage, saveData);

}