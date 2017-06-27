// ==UserScript==
// @name         Add Filter by Tag to SteemIt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add Filter by Tag to SteemIt
// @author       netuoso
// @match        https://steemit.com/*
// @grant        WTFPL
// ==/UserScript==

function filterPosts(filterTag) {
    // Get all posts vcards (author,rating,tag)
    var elements = document.getElementsByClassName("vcard");

    for (var i=0; i<elements.length; i++) {
        if (filterTag !== "") {
            // Loop over the posts and hide the entire post if tag is different than filter
            // Aka, enable filter
            var postTag = elements[i].lastChild.innerText;
            if (postTag !== filterTag) {
                elements[i].parentElement.parentElement.parentElement.style.display="none";
            }
        } else {
            // If filter is "" then ensure all posts are displayed
            // Aka, disable filter
            elements[i].parentElement.parentElement.parentElement.style.display="list-item";
        }
    }
}

function enablePostFilter() {
    // Get tag to filter from input field
    filterTag = document.getElementById("tagInput");
    filterPosts(filterTag.value);

    // Automatically filter new posts as the page loads more
    document.getElementById("posts_list").addEventListener("DOMNodeInserted", function(event) {
        filterPosts(filterTag.value);
    });
}

function disablePostFilter() {
    // Get tag to filter from input field
    filterTag = document.getElementById("tagInput");
    filterTag.value = "";
    enablePostFilter("");
}

// Create a text field called "Enable Filter"
var enableFilterNode = document.createElement("li");
var enableFilterLink = document.createElement("a");
enableFilterLink.innerHTML = "enable filter";
enableFilterLink.onclick = function() { enablePostFilter(); };
enableFilterLink.href = "#";
enableFilterNode.appendChild(enableFilterLink);

// Create a text field called "Disable Filter"
var disableFilterNode = document.createElement("li");
var disableFilterLink = document.createElement("a");
disableFilterLink.innerHTML = "disable filter";
disableFilterLink.onclick = function() { disablePostFilter(); };
disableFilterLink.href = "#";
disableFilterNode.appendChild(disableFilterLink);

// Input field for desired tag
var tagInput = document.createElement("input");
tagInput.id = "tagInput";
tagInput.type = "text";

// Append the link to the navigation bar on the right side of screen by tags
document.getElementsByClassName('Topics__title')[0].appendChild(enableFilterNode);
document.getElementsByClassName('Topics__title')[0].appendChild(tagInput);
document.getElementsByClassName('Topics__title')[0].appendChild(disableFilterNode);
