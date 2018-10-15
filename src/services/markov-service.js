const Promise = require('bluebird');
const StringRepository = require ('../repositories/string-repository.js');
const Config = require ('../../config.json');


module.exports = {
  Consider : (input, markovClient) => {
    //console.log(markovClient);
    return StringRepository.Write(input)
      .then(res => ShouldRespond(input))
      //.then(res => res ? StringRepository.ReadRandom(500) : () => [])
      //.then(res => ExtractStrings(res))
      //.then(res => BuildMarkov(res))
      .then(res => res ? Respond(markovClient, input) : null);
  }
}

function ShouldRespond(text) {
  console.log(`should respond`);
  return text.toLowerCase().includes(Config.botname) || 
    Math.floor((Math.random() * 100) < parseInt(Config.responsechance));
}

function ShouldSmartReply() {
  console.log(``);
  return Math.floor((Math.random() * 100) < parseInt(Config.longresponsechance))
}

function Respond(markov, input) {
  console.log(`respond`);
  if(!markov) return null;
  try
  {
    console.log('smart');
    return SmartReply(markov, input);
  }
  catch (err)
  {
    console.log('dumb reply');
    return Reply(markov);
  }
}

function SmartReply(markov, input) {  
  let longestWord = input.split(Config.botname).join('').split(' ').sort((a, b) => a.length - b.length);
  console.log(`Longest word: ${longestword}`)
  let smartOptions = {
    maxLength: 0,
    minWords: 5,
    minScore: 10,
    stateSize: 3,
    maxTries: 1000,
    filter: (res) => res.string.includes(longestWord)
  }
  return markov.generateSentenceSync(smartOptions)
}

function Reply(markov) {
  console.log(`reply`);
  return markov.generateSentenceSync();
}