const Discord = require(`discord.js`);
const Client = new Discord.Client();
const Promise = require('bluebird');
const MarkovService = require('./services/markov-service');
const StringRepository = require ('./repositories/string-repository.js');
const Config = require('../config.json');
const Markov = require('markov-strings');

global.markovClient;

function ExtractStrings(arr) {
  console.log(`extract`);
  if(!arr.map) return;
  return arr.map(a => a.string);
}

function BuildMarkov(strings) {
  console.log(`build markov`);
  if(!strings) return null;

  let markov = new Markov(strings, Config.markovDefaultOptions);
  console.log('building corpus...');
  markov.buildCorpus();
  console.log('corpus built')
  return markov;
}

StringRepository.ReadAll()
  .then(res => ExtractStrings(res))
  .then(res => BuildMarkov(res))
  .then(res => markovClient = res)
  .then(res => Client.login(process.env.token));


Client.on('ready', () => {
  console.log("Ready");
});

Client.on('message', msg => {
  if(msg.author.bot) return;
  console.log('msg');
  //console.log(markovClient)
  MarkovService.Consider(msg.content,markovClient)
   .then(res => res != null ? msg.channel.send(log(res)) : null)
   .catch(err => (dump(err)));
});

function log(msg) {
  console.log(msg);
  return msg.string;
}

function dump(err) {
  console.log(err.stack);
  return `:x: ${err.message}`;
}