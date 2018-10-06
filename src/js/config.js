'use strict';


  // Create a new list item when clicking on the "Add" button
function newElement(maxId) {
  const li = document.createElement("li");
  li.setAttribute('value', maxId);
  const textValue = document.createTextNode(myInput.value);
  li.appendChild(textValue);
  if (myInput.value === '') {
    alert("You must write something!");
  } else {
    myUL.appendChild(li);
  }
  
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
}
// Create a "close" button and append it to each list item

function markAsX() {
  var myNodelist = document.getElementsByTagName("LI");
  for (let i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
  }
}

// Click on a close button to hide the current list item
async function deleteItem() {
  
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);
