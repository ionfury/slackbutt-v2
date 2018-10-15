let Chai = require('chai');
let Expect = Chai.expect;
let Markov = require('markov-strings');
const Config = require('../config.json');
var randomWords = require('random-words');

let Service = require('../src/services/markov-service.js');
let Repo = require('../src/repositories/string-repository.js');

let TestConfig = require('../test-data.json'); 


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


it('prod-test slackbutt', async () => {
  process.env.database_username = TestConfig.database_username;
  process.env.database_password = TestConfig.database_password;
  process.env.database_connection_string = TestConfig.database_connection_string;

  process.env.db = "slackbutt-prod";

  var m = await Repo.ReadRandom(20)
    .then(res => ExtractStrings(res))
    .then(res => BuildMarkov(res));
    
  var res = await Service.Consider("slackbutt is a respectable fellow", m);
  console.log(res);
  if(res)
  Expect(res.string).to.a('string');

}).timeout(20000);