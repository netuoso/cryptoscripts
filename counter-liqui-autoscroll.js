// ==UserScript==
// @name         Counter Liqui Trollbox AutoScroll
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When Liqui trollbox updates it autoscrolls the user to the bottom. This counters that function.
// @author       netuoso
// @match        https://liqui.io/*
// @grant        WTFPL
// ==/UserScript==

// extension:
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

$("#chat-container").on('mousewheel', function(){
    $customScrollPos = angular.element($("#chat-container"))[0].scrollTop;
    $('.resetPosButton').show();
});

$("#chat-container").scrollEnd(function(){
    if (typeof($customScrollPos) !== 'undefined') {
        $("#chat-container").animate( { scrollTop: $customScrollPos }, "fast");
    }
}, 250);

$(document).ready(function() {
    var resetButton = '<div><a href="#" onclick="resetScrollPos()" class="resetPosButton"><button id="buy" class="button full-width"><span>Reset Scroll Position</span></button>';

    $('.chatting > .block-header').append(resetButton);
    $('.resetPosButton').hide();

    $(".resetPosButton").on('click', function() {
        $customScrollPos = 999999999;
        $('#chat-container').animate( { scrollTop: $customScrollPos }, 'fast');
        $('.resetPosButton').hide();
    });
});
