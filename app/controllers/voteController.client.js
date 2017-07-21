'use strict';

(function () {

  var bars = document.querySelectorAll('.bar');

  function voteUrl(bar) { return window.location.href + '/' + bar.id + '/patrons'; }

  ajaxFunctions.ready(() => {
    bars.forEach(bar => {
      bar.writePatronCount = function(patronCount) {
        console.log('in writePatronCount: ' + patronCount);
        patronCount = JSON.parse(patronCount);
        bar.innerHTML = patronCount + ' Going';
      };
      ajaxFunctions.ajaxRequest('GET', voteUrl(bar), bar.writePatronCount);
    })
  });

  bars.forEach((bar) => {
    bar.addEventListener('click', function (event) {
      event.preventDefault();
      ajaxFunctions.ajaxRequest('POST', voteUrl(bar), bar.writePatronCount);
    }, false);
  });

})();
