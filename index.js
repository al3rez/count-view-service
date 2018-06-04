const redis = require("redis");

const client = redis.createClient();
const { send, json } = require("micro");

module.exports = async function(request, response) {
  client.incr("visits", (err, reply) => {
    if (err) {
      return send(response, 500, { errors: [err] });
    }
    send(response, 200, { visits: reply });
  });
};
