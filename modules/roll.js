// File roll.js
module.exports = {
    roll: function(args) {
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



        