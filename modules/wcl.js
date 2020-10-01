// File wcl.js
// const request = require('request');

module.exports = {
    info: function(msg, token) {

        console.log(msg.content)
        console.log(token)
        request(msg.content, { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
          console.log(body.url);
          console.log(body.explanation);
        });

        var min = 1, max = 100
        if(args.length == 2 && parseInt(args[0]) && parseInt(args[1])) {
            min = args[0] < args[1] ? args[0] : args[1];
            max = args[0] > args[1] ? args[0] : args[1];
        }

        min = Math.ceil(min);
        max = Math.floor(max);

        number = Math.floor(Math.random() * (max - min) + min)
        return 'Roll ['+min+'-'+max+']: **'+number+'**'
    }
};



        