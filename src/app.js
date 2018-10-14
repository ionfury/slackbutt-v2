const Discord = require(`discord.js`);
const Client = new Discord.Client();
const Promise = require('bluebird');
const MarkovService = require('./services/markov-service');
Client.on('ready', () => {
console.log("connected")
});

Client.on('message', msg => {
  if(msg.author.bot) return;

  MarkovService.Consider(msg.content)
    //.then(console.log)
   .then(res => res != null ? msg.channel.send(res.string) : null)
   .catch(err => msg.channel.send(dump(err)));
});

Client.login(process.env.token);

function dump(err) {
  console.log(err.stack);
  return `:x: ${err.message}`;
}