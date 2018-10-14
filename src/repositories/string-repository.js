let MongoClient = require('mongodb').MongoClient;
let Promise = require('bluebird');

Promise.promisifyAll(MongoClient);

const col = 'strings';


function GetMongoConnection() {
  let url = `mongodb+srv://${process.env.database_username}:${process.env.database_password}@${process.env.database_connection_string}`;

  return MongoClient.connect(url, {promiseLibrary: Promise, useNewUrlParser: true})
    .disposer(conn => conn.close());
}

module.exports = {
  Write: (string) => {
    let db = process.env.db;

    return new Promise.using(GetMongoConnection(), conn => {
      let value = { string: string };
      return conn.db(db).collection(col).insertOne(value);
    });
  },
  ReadRandom: (n) => {
    let db = process.env.db;
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).aggregate( [ { $sample: {size: 5000} } ] ) .toArray();
    });
  },
  ReadAll: () => {
    let db = process.env.db;
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).find().toArray();
    });
  },
  Remove: (string) => {
    let db = process.env.db;
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).deleteMany({ string : string });
    });
  },
  Exists: (string) => {
    let db = process.env.db;
    return new Promise.using(GetMongoConnection(), conn => {
      return conn.db(db).collection(col).findOne({ string : string });
    });
  }
}