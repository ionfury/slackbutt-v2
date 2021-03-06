let MongoClient = require('mongodb').MongoClient;
let Promise = require('bluebird');
const Config = require ('../../config.json');

Promise.promisifyAll(MongoClient);

const db = Config.db;
const col = 'strings';


function GetMongoConnection() {
  let url = `mongodb+srv://${process.env.database_username}:${process.env.database_password}@${process.env.database_connection_string}`;

  return MongoClient.connect(url, {promiseLibrary: Promise, useNewUrlParser: true})
    .disposer(conn => conn.close());
}

module.exports = {
  Write: (string) => {
    return new Promise.using(GetMongoConnection(), conn => {
      let value = { string: string };
      return conn.db(db).collection(col).insertOne(value);
    });
  },
  ReadRandom: (n) => {
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).aggregate( [ { $sample: {size: n} } ] ) .toArray();
    });
  },
  ReadAll: () => {
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).find().toArray();
    });
  },
  Remove: (string) => {
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).deleteMany({ string : string });
    });
  },
  Exists: (string) => {
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).findOne({ string : string });
    });
  }
}
