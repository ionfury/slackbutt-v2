const Promise = require('bluebird');
const StringRepository = require ('../repositories/string-repository.js');
const Config = require ('../../config.json');
const Markov = require('markov-strings');

module.exports = {
  Consider : (input) => {
    return StringRepository.Write(input)
      .then(res => ShouldRespond(input))
      .then(res => res ? StringRepository.ReadRandom(50) : () => null)
      .then(res => ExtractStrings(res))
      .then(res => BuildMarkov(res))
      .then(markov => Respond(markov, input))
  }
}
function ExtractStrings(arr) {
  if(!arr) return;
  return arr.map(a => a.string);
}

function BuildMarkov(strings) {
  if(!strings) return null;
  let markov = new Markov(strings, Config.markovDefaultOptions);
  markov.buildCorpus();
  return markov;
}

function ShouldRespond(text) {
  return text.toLowerCase().includes(Config.botname) || 
    Math.floor((Math.random() * 100) < parseInt(Config.responsechance));
}

function ShouldSmartReply() {
  return Math.floor((Math.random() * 100) < parseInt(Config.longresponsechance))
}

function Respond(markov, input) {
  if(!markov) return null;
  try
  {
    console.log('smart reply');
    return SmartReply(markov, input);
  }
  catch
  {
    console.log('dumb reply');
    return Reply(markov);
  }
}

function SmartReply(markov, input) {
  let longestWord = input.split(' ').sort((a, b) => a.length - b.length);
  let smartOptions = {
    filter: (res) => res.string.includes(longestWord)
  }
  return markov.generateSentenceSync(smartOptions)
}

function Reply(markov) {
  return markov.generateSentenceSync();
}