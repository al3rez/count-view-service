const test = require("ava");
const request = require("ava-http");

const micro = require("micro");
const listen = require("test-listen");
const rewire = require("rewire");

test("returns 1 for the first time", async t => {
  const counter = rewire("./index");
  counter.__set__("client", {
    incr(key, callback) {
      return callback(null, 1);
    }
  });
  const service = micro(counter);
  const url = await listen(service);

  await request.getResponse(url).then(res => {
    t.is(res.statusCode, 200);
    t.deepEqual(res.body, { visits: 1 });
  });

  service.close();
});

test("increases after the first time", async t => {
  const counter = rewire("./index");
  counter.__set__("client", {
    called: 0,
    incr(key, callback) {
      this.called += 1;
      if (this.called > 1) {
        return callback(null, 2);
      }
      return callback(null, 1);
    }
  });
  const service = micro(counter);
  const url = await listen(service);

  await request.getResponse(url).then(res => {
    t.is(res.statusCode, 200);
    t.deepEqual(res.body, { visits: 1 });
  });

  await request.getResponse(url).then(res => {
    t.is(res.statusCode, 200);
    t.deepEqual(res.body, { visits: 2 });
  });

  service.close();
});

test("something bad happens in redis", async t => {
  const counter = rewire("./index");
  counter.__set__("client", {
    incr(key, callback) {
      return callback("err");
    }
  });
  const service = micro(counter);
  const url = await listen(service);

  await request.get(url).catch(err => {
    t.is(err.statusCode, 500);
    t.deepEqual(err.response.body, { errors: ["err"] });
  });

  service.close();
});
