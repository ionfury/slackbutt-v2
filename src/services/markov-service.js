const Promise = require('bluebird');
const StringRepository = require ('../repositories/string-repository.js');
const Config = require ('../../config.json');


module.exports = {
  Consider : (input, markovClient) => {
    //console.log(markovClient);
    return StringRepository.Write(input)
      .then(res => ShouldRespond(input))
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
  console.log(`input: ${input}`)
  let longestWord = input.replace(Config.botname, '');
  
  console.log(`Step 1: ${longestWord}`);
  var l = longestWord.split(' ').sort((a, b) => b.length - a.length)[0];
  
  console.log(`Longest word: ${l}`);

  let smartOptions = {
    maxLength: 0,
    minWords: 5,
    minScore: 10,
    stateSize: 3,
    maxTries: 1000,
    filter: (res) => res.string.includes(l)
  };
  return markov.generateSentenceSync(smartOptions);
}

function Reply(markov) {
  console.log(`reply`);
  return markov.generateSentenceSync();
}