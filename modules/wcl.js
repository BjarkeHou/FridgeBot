// File wcl.js
// const request = require('request');
const Discord = require('discord.js');
const { graphql, buildSchema } = require('graphql');
const fetch = require('node-fetch');

const CLIENT_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MjI4MjcxZC1lMjJmLTRhNzgtOTgxMy1kN2FjMDVlYzkyNzgiLCJqdGkiOiI1MmJmOTQwYTEyMDU1NTZjZTQyNmEyZjc3YzYxMzdiYWExNDE0MDhkMDI1ZDMwNTdkZTdiNzlhZWJjZmEzN2MzYzA2ZDMxZTEwNjE0ZDU4YyIsImlhdCI6MTYxNTQ4MDc4MCwibmJmIjoxNjE1NDgwNzgwLCJleHAiOjE2MTgwNzI3ODAsInN1YiI6IiIsInNjb3BlcyI6WyJ2aWV3LXByaXZhdGUtcmVwb3J0cyJdfQ.cTLzoXRS800w7-5EfsM57yQrqjJHdQuhCvxHxwkY_vwC0G7-4OPvFPM4bZxV923EDHXvDcGOisYULPdvxXBt6cJJ0o0nkWVa3SR07InUuwcYVizHj_RtMWhU84w-rN00Kzrqy0P6e83nOBLb_v1OCdWaNYIhpip9XEdeWvOp-D4LJ7shlZ-OuQust9V8TFRZcfvOyNLDYtJuaPW9bbYZwKxWwoznR_KxKHy_FoophE5ZvJ3hyUYGMu6YGZzTAq_D9CgFjskw7cLbR1NHaJemp0Fn8wdSSNrS-80LaH_z8hbLV2dz-vLddKeWlcHdgPIDE-Vla0wJZPEFxyeh1C9lWFtDi3K5qDLXRnjm7-EY1eIXOI6CS7oDBg09KvzMQEg8RTEZxFonDb_SGE1VMfKPmg4QKCI8mEoq-fY0vMQ2nAij-Ld-_UaISnyYfbtrSGhqH4sFYtti94z6y7OieAj-xVm0H5FysY_dnXHnOTIr10WSrjfRqfGGVmWU6l86xtaN9keXLDmOufMZd2fb19oIo7K2zuJYkZanuUnSJvJLq65dEY2Q7TBDJ6_bu_y3fmPBsd3JmxpCUrVTrJFiXUQzodqUYBwb0a6qZu2jKsFVPYc1ZYe31_Ka1Czdh7Kw4sBHlih7bqnwNsb2WmSFNOroWGVvfTpBDEQ-kASwvGsWVH8";

// function formatMillis(millis) {
//   var hours = Math.floor(millis / 3600000)
//   var minutes = Math.floor((millis / 3600000) / 60000);
//   var seconds = ((millis % 60000) / 1000).toFixed(0);
//   return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
// }

function msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
  var pad = (n, z = 2) => ('00' + n).slice(-z);
  return pad(s/3.6e6|0) + ':' + pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0);
}

function msToMinSec(s) {
    // Pad to 2 or 3 digits, default is 2
  var pad = (n, z = 2) => ('00' + n).slice(-z);
  return pad((s%3.6e6)/6e4 | 0) + ':' + pad((s%6e4)/1000|0);
}

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
    },
    log: function(msg, token) {
        
        let link = msg.content.substring(msg.content.indexOf('http'))
        if(link.endsWith('/')) {
          link = link.slice(0,-1);
        }
        const urlTokens = link.split('/');
        const logId = urlTokens[urlTokens.length-1];
        const endTime = Date.now()

        const query = `
        {
          reportData {
            report (code:"${logId}"){
              startTime,
              endTime,
              guild {
                name
              }
              zone {
                name
              }
              fights(difficulty:3) {
                encounterID,
                startTime,
                endTime,
                name,
                kill,
              },
              damageDone: table(
                startTime:0,
                endTime:${endTime},
                dataType:DamageDone,
                difficulty:3
                killType:Kills
              )
              healingDone: table(        
                startTime:0,
                endTime:${endTime},
                dataType:Healing,
                difficulty:3
                killType:Kills
              )
            }
          }
        }`;
         
        fetch('https://www.warcraftlogs.com/api/v2', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'grant_type': 'client_credentials',
            'Authorization': 'Bearer ' + CLIENT_TOKEN,
          },
          body: JSON.stringify({
            query
          })
        })
        .then(r => r.json())
        .then(r => {
          let data = r.data.reportData.report;
          let fightDurations = data.fights.map(item => {
            return `${item.name}: *${msToMinSec(item.endTime-item.startTime)}*`
          });
          let killTimes = data.fights.map(item => {
            return `${item.name}: *${msToTime(item.endTime)}*`
          });


          const top_size = 5;
          let topDps = data.damageDone.data.entries.map( player => {
            return {name: player.name, class: player.type, damage: player.total}
          }).sort((a,b) => {return b.damage - a.damage});
          let formattedTopDps = topDps.slice(0,top_size).map(item => {
            return `${item.name} - *${item.damage.toLocaleString()}*`
          });
          
          let topHeal = data.healingDone.data.entries.map( player => {
            return {name: player.name, class: player.type, healing: player.total}
          }).sort((a,b) => {return b.healing - a.healing});
          let formattedTopHeal = topHeal.slice(0,top_size).map(item => {
            return `${item.name} - *${item.healing.toLocaleString()}*`
          });

          let title = data.guild ? `${data.zone.name} - ${data.guild.name}` : `${data.zone.name}`

          const embedMsg = new Discord.MessageEmbed()
            .setColor('#0099FF')
            .setTitle(title)
            .setURL(link)
            .addField("Date:",`${new Date(data.startTime).toDateString()}`)
            .addField('\u200B', '\u200B')
            .addFields(
              { name: "__Fight Length__", value: fightDurations.join('\n'), inline: true },
              { name: '\u200B', value: '\u200B', inline: true},
              { name: "__Kill Times__", value: killTimes.join('\n'), inline: true },
            )
            .addField('\u200B', '\u200B')
            .addFields(
              { name: "__Top Damage__", value: formattedTopDps.join('\n'), inline: true },
              { name: '\u200B', value: '\u200B', inline: true},
              { name: "__Top Healing__", value: formattedTopHeal.join('\n'), inline: true },
            )
            .addField('\u200B', '\u200B')
            .addField("Link:",`${link}`)

          // console.log(`Kill Times`)
  //           .addFields(
  //   { name: 'Regular field title', value: 'Some value here' },
  //   { name: '\u200B', value: '\u200B' },
  //   { name: 'Inline field title', value: 'Some value here', inline: true },
  //   { name: 'Inline field title', value: 'Some value here', inline: true },
  // )
          // for (var i = 0; i < data.fights.length; i++) {
          //   let fight = data.fights[i]
          //   let fighttime = fight.endTime-fight.startTime;
          //   console.log(`${fight.name}: ${msToTime(fighttime)} - ${msToTime(fight.endTime)}`)
          // }
          console.log(`Posted log: ${link}`)
          msg.channel.send(embedMsg);
        });
    }
};



        