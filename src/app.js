const Discord = require(`discord.js`);
const Client = new Discord.Client();
const Promise = require('bluebird');
const MarkovService = require('./services/markov-service');
const StringRepository = require ('./repositories/string-repository.js');
const Config = require('../config.json');
const Markov = require('markov-strings');

function ExtractStrings(arr) {
  console.log(`extract`);
  if(!arr.map) return;
  return arr.map(a => a.string);
}

function BuildMarkov(strings) {
  console.log(`build markov`);
  if(!strings) return null;
  console.log(strings);

  let markov = new Markov(strings, Config.markovDefaultOptions);
  markov.buildCorpus();
  return markov;
}

StringRepository.ReadRandom(10000)
  .then(res => ExtractStrings(res))
  .then(res => BuildMarkov(res))
  .then(res => process.env.markov = res)
  .then(res => Client.login(process.env.token));


Client.on('ready', () => {
  console.log("Ready");
});

Client.on('message', msg => {
  if(msg.author.bot) return;

  MarkovService.Consider(msg.content)
   .then(res => res != null ? msg.channel.send(res.string) : null)
   .catch(err => msg.channel.send(dump(err)));
});



function dump(err) {
  console.log(err.stack);
  return `:x: ${err.message}`;
}