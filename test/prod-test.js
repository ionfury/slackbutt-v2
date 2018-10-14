let Chai = require('chai');
let Expect = Chai.expect;

var randomWords = require('random-words');

let Service = require('../src/services/markov-service.js');
let Repo = require('../src/repositories/string-repository.js');

let TestConfig = require('../test-data.json'); 

it('prod-test slackbutt', async () => {
  process.env.database_username = TestConfig.database_username;
  process.env.database_password = TestConfig.database_password;
  process.env.database_connection_string = TestConfig.database_connection_string;

  process.env.db = "slackbutt-prod";

  var res = await Service.Consider("is a respectable fellow");
  console.log(res);
  Expect(res.string).to.a('string');

}).timeout(20000);