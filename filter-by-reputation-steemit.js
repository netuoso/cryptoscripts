// ==UserScript==
// @name         Add Filter by Reputation to SteemIt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add Filter by Reputation to SteemIt
// @author       netuoso
// @match        https://steemit.com/*
// @grant        WTFPL
// ==/UserScript==

function filterPosts(filterReputation) {
    // Get all posts vcards (author,rating,tag)
    var elements = document.getElementsByClassName("Reputation");

    for (var i=0; i<elements.length; i++) {
        if (filterReputation !== "" || filterReputation !== "0") {
            // Loop over the posts and hide the entire post if tag is different than filter
            // Aka, enable filter
            var authorReputation = Number(elements[i].innerText);
            if (authorReputation < filterReputation) {
                elements[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display="none";
            }
        } else {
            // If filter is "" then ensure all posts are displayed
            // Aka, disable filter
            elements[i].parentElement.parentElement.parentElement.parentElement.parentElement.style.display="list-item";
        }
    }
}

function enablePostFilter() {
    // Get tag to filter from input field
    filterReputation = document.getElementById("reputationInput");
    filterPosts(filterReputation.value);

    // Automatically filter new posts as the page loads more
    document.getElementById("posts_list").addEventListener("DOMNodeInserted", function(event) {
        filterPosts(filterReputation.value);
    });
}

function disablePostFilter() {
    // Unhide previously hidden posts
    var renderedElements = document.getElementsByClassName("PostsList__summaries")[0].children;
    for (var i=0; i<renderedElements.length; i++) {
        renderedElements[i].style.display = "list-item";
    }
    // The footer someone hides itself; unhide it
    var footerElements = document.getElementsByClassName("PostSummary__footer");
    for (var j=0; j<footerElements.length; j++) {
        footerElements[j].style.display = "list-item";
    }

    // Get tag to filter from input field
    filterReputation = document.getElementById("reputationInput");
    filterReputation.value = "0";
    filterReputation.innerText = "0";
    enablePostFilter("0");
}

// Input field for minimum reputation
var reputationInput = document.createElement("input");
reputationInput.id = "reputationInput";
reputationInput.type = "text";
reputationInput.placeholder = "filter by min rep";
reputationInput.style.display = "block";
reputationInput.style.width = "80%";
reputationInput.style.marginTop = "10px";

// Enable button field for minimum reputation
var reputationEnable = document.createElement("button");
reputationEnable.id = "reputationEnable";
reputationEnable.type = "submit";
reputationEnable.className = "button";
reputationEnable.onClick = "enablePostFilter()";
enableSpan = document.createElement("span");
enableSpan.title = "enable reputation filter";
enableSpan.innerHTML = "ON";
reputationEnable.appendChild(enableSpan);

// Disable button field for minimum reputation
var reputationDisable = document.createElement("button");
reputationDisable.id = "reputationDisable";
reputationDisable.type = "submit";
reputationDisable.className = "button";
reputationDisable.onClick = "disablePostFilter()";
disableSpan = document.createElement("span");
disableSpan.title = "disable reputation filter";
disableSpan.innerHTML = "OFF";
reputationDisable.appendChild(disableSpan);

// New container to hold the created buttons
reputationContainer = document.createElement("div");
reputationContainer.style.width = "100%";
reputationButtons = document.createElement("div");
reputationButtons.style.width = "90%";
reputationButtons.style.margin = "0 auto !important";
reputationButtons.appendChild(reputationDisable);
reputationButtons.appendChild(reputationEnable);
reputationContainer.appendChild(reputationButtons);

// Append the reputation container to the nav bar on the right side of the page
document.getElementsByClassName('Topics__title')[0].appendChild(reputationInput);
document.getElementsByClassName('Topics__title')[0].appendChild(reputationContainer);

document.getElementById("reputationEnable").addEventListener("click", enablePostFilter);
document.getElementById("reputationDisable").addEventListener("click", disablePostFilter);
