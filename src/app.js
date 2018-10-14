const Discord = require(`discord.js`);
const Client = new Discord.Client();
const Promise = require('bluebird');
const MarkovService = require('./services/markov-service');

Client.on('ready', () => {

});

Client.on('message', msg => {
  if(msg.author.bot) return;
  if(!msg.guid) {
    msg.reply(`STRANGER DANGER!`);
    return;
  }

  MarkovService.Consider(msg.content)
    .then(res => res ? msg.channel.send : null)
    .catch(err => msg.channel.send(dump(err)));
});

Client.login(process.env.token);

function dump(err) {
  console.log(err.stack);
  return `:x: ${err.message}`;
}