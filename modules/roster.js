// File roster.js
'use strict';

const fs = require('fs');

const filename = 'roster.json';

module.exports = {
    get: function(msg) {
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);

            let returnMsg = ".\n__**Players:**__\n\n";

            for (var player in roster) {
                // skip loop if the property is from prototype
                if (!roster.hasOwnProperty(player)) continue;

                returnMsg += "**"+player+"**\n";

                // Add character names and lvls here.
                for (var j = roster[player].characters.length - 1; j >= 0; j--) {
                    let char = roster[player].characters[j];
                    returnMsg += "- "+char.name+" ["+char.class+" - "+char.lvl+"]\n";
                }
                returnMsg += "\n";
            }

            msg.channel.send(returnMsg);
        });
    },
    add: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(!roster[msg.author.username]) {
                msg.channel.send("No player registered with that name. Use `!roster register`");
                return;
            }
            
            var newCharData = msg.content.split(' ').splice(2)
            console.log(newCharData)

            let newChar = {
                "name":newCharData[0],
                "class":newCharData[1],
                "lvl":newCharData[2]
            }

            roster[msg.author.username].characters.push(newChar);

            fs.writeFile(filename, JSON.stringify(roster), (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        });
    },
    delete: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(!roster[msg.author.username]) {
                msg.channel.send("No player registered with that name. Use `!roster register`");
                return;
            }
            
            console.log(msg.content)
            var nameOfCharToBeDeleted = msg.content.split(' ').splice(2)
            console.log(nameOfCharToBeDeleted)

            for (var i = roster[msg.author.username].characters.length - 1; i >= 0; i--) {
                if(roster[msg.author.username].characters[i].name.toLowerCase() == nameOfCharToBeDeleted[0].toLowerCase()) {
                    roster[msg.author.username].characters.splice(i, 1)
                    fs.writeFile(filename, JSON.stringify(roster), (err) => {
                        if (err) throw err;
                        console.log('Data written to file');
                    });
                    return
                }
            }

            msg.channel.send("You have no character with that name.");
        });
    },
    ding: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(!roster[msg.author.username]) {
                msg.channel.send("No player registered with that name. Use `!roster register`");
                return;
            }
            
            console.log(msg.content)
            var nameOfCharDinged = msg.content.split(' ').splice(2)
            console.log(nameOfCharDinged)

            for (var i = roster[msg.author.username].characters.length - 1; i >= 0; i--) {
                if(roster[msg.author.username].characters[i].name.toLowerCase() == nameOfCharDinged[0].toLowerCase() &&
                    roster[msg.author.username].characters[i].lvl < 60) {
                    roster[msg.author.username].characters[i].lvl = parseInt(roster[msg.author.username].characters[i].lvl) + 1;
                    fs.writeFile(filename, JSON.stringify(roster), (err) => {
                        if (err) throw err;
                        console.log('Data written to file');
                        if(roster[msg.author.username].characters[i].lvl == 60) {
                            msg.reply("@everyone look at this pumper! Gratz, motherfucker!")
                        } else {
                            msg.reply("Gz! Keep pumping!")
                        }
                    });
                    return
                }
            }

            msg.channel.send("You have no character below lvl60 with that name.");
        });
    },
    register: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(roster[msg.author.username]) {
                msg.channel.send("Player already registered.");
                return;
            }

            roster[msg.author.username] = [];
            

            fs.writeFile(filename, JSON.stringify(roster), (err) => {
                if (err) throw err;
                console.log('Data written to file');
                msg.channel.send("Player with username: **"+msg.author.username+"** has been registered.");
            }); 
        });
    },
};
