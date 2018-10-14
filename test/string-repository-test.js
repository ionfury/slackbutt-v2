let Chai = require('chai');
let Expect = Chai.expect;

let Repo = require('../src/repositories/string-repository.js');

let TestConfig = require('../test-data.json'); 

it('string-repositories should write-exists-remove', async () => {
  process.env.database_username = TestConfig.database_username;
  process.env.database_password = TestConfig.database_password;
  process.env.database_connection_string = TestConfig.database_connection_string;

  process.env.db = "test";
  let test = '!!test-string!!';
  await Repo.Write(test);

  let res = await Repo.Exists(test);

  Expect(res.string).to.equal(test);

  await Repo.Remove(test);  
});