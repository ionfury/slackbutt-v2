let Chai = require('chai');
let Expect = Chai.expect;

var randomWords = require('random-words');

let Service = require('../src/services/markov-service.js');
let Repo = require('../src/repositories/string-repository.js');

let TestConfig = require('../test-data.json'); 

it('markov-service generate a string', async () => {
  process.env.database_username = TestConfig.database_username;
  process.env.database_password = TestConfig.database_password;
  process.env.database_connection_string = TestConfig.database_connection_string;

  process.env.db = "test";

  var res = await Service.Consider("slackbutt");
  Expect(res.string).to.a('string');

  await Repo.Remove("slackbutt");
}).timeout(2000);