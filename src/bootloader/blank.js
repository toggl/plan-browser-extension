var Button = require('../button/button.js');

Button.initialize()
  .then(function() {
    var el = Button.create({
      name: 'Testing 123',
      start_date: new Date('1993-02-13'),
      end_date: new Date('2023-09-28')
    });

    document.body.appendChild(el);
  })
  .catch(function(error) {
    console.error(error);
  });
