var Button = require('../button/button.js');
 
function createButtons() {
  var titles = document.querySelectorAll('.milestone-title-link');
 
  Array.prototype.forEach.call(titles, function(title) {
    var name = title.querySelector('a').innerText;
 
    var button = Button.create({
      name: name
    });
 
    title.appendChild(button);
  });
}
 
function handleError(error) {
  console.error(error);
}
 
Button.initialize()
  .then(createButtons)
  .catch(handleError);