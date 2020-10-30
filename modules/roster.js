// File roster.js
'use strict';

const fs = require('fs');

const filename = 'roster.json';

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const CLASSES = ['warrior','warlock','rogue','priest','druid','hunter','shaman','paladin','mage']

module.exports = {
    help: function(msg) {
        let response = "";

        response += "**__ROSTER COMMANDS__**\n\n"
        response += "**__!roster__**\nPrints all users registered and all characters added to each user.\n\n"
        response += "**__!roster register__**\nRegisters your discord name, so you can start adding characters.\n\n"
        response += "**__!roster add <character name> <class> <level>__**\nAdds a character to your roster with class and level.\n\n"
        response += "**__!roster delete <character name>__**\nDeletes said character from your roster.\n\n"
        response += "**__!roster ding <character name>__**\nIncreases said character level with 1.\n\n"
        response += "**__!roster help__**\nPrints this message.\n\n"

        msg.author.send(response);
        msg.delete();
    },
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
                msg.author.send("No player registered with that name. Use `!roster register`");
                return;
            }
            
            var newCharData = msg.content.split(' ').splice(2)

            if(CLASSES.indexOf(newCharData[1].toLowerCase()) == -1) {
                msg.author.send("That class does not exist.");
                return;
            }

            if(parseInt(newCharData[2]) == NaN) {
                msg.author.send("Level needs to be a number.");
                return;
            }

            let newChar = {
                name:capitalize(newCharData[0].toLowerCase()),
                class:capitalize(newCharData[1].toLowerCase()),
                lvl:parseInt(newCharData[2])
            }

            roster[msg.author.username].characters.push(newChar);

            fs.writeFile(filename, JSON.stringify(roster), (err) => {
                if (err) throw err;
                console.log('Data written to file');
                msg.author.send("**"+newChar.name+"** ["+newChar.class+" - "+newChar.lvl+"] added.");
            });
        });
    },
    delete: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(!roster[msg.author.username]) {
                msg.author.send("No player registered with that name. Use `!roster register`");
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
                        msg.author.send("**"+nameOfCharToBeDeleted+"** has been deleted.");
                    });
                    return
                }
            }

            msg.author.send("You have no character with that name.");
        });
    },
    ding: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(!roster[msg.author.username]) {
                msg.author.send("No player registered with that name. Use `!roster register`");
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
                            msg.reply("@everyone look at this pumper! Gratz with lvl60, motherfucker!")
                        } else {
                            msg.reply("Gz with lvl"+roster[msg.author.username].characters[i].lvl+"! Keep pumping!")
                        }
                    });
                    return
                }
            }

            msg.author.send("You have no character below lvl60 with that name.");
        });
    },
    register: function(msg) {
        console.log(msg.author.username);
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let roster = JSON.parse(data);
            if(roster[msg.author.username]) {
                msg.author.send("Player already registered.");
                return;
            }

            roster[msg.author.username] = {characters:[]};
            

            fs.writeFile(filename, JSON.stringify(roster), (err) => {
                if (err) throw err;
                console.log('Data written to file');
                msg.author.send("Player with username: **"+msg.author.username+"** has been registered.");
            }); 
        });
    },
};
