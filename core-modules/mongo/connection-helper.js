function randomize(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 *  config object format
 *
 * {
 *    database_name: "pushengage",
 *    server: [
 *      {
 *        host: "54.234.148.229",
 *        port: 27017
 *      }
 *    ],
 *    "replica_set": [],
 *    "mongos": [],
 *    "connect_timeout_ms": 10000
 * }
 */
function prepareMongoURI(dbConfig) {
  const databaseName = dbConfig.database_name;
  const hostPort = [];

  dbConfig.servers.forEach((server) => {
    hostPort.push(`${server.host}:${server.port}`);
  });

  randomize(hostPort);
  return `mongodb://${hostPort.join(',')}/${databaseName}`;
}

function getConnectionSettings(dbConfig) {
  const params = { uri: null, options: {} };

  params.uri = prepareMongoURI(dbConfig);
  return params;
}

module.exports = {
  getConnectionSettings,
};
