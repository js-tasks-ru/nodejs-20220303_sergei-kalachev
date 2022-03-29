const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let incomingMessageResolve;
let incomingMessagePromise = new Promise((resolve) => {
  incomingMessageResolve = resolve;
});

router.get('/subscribe', async (ctx, next) => {
  try {
    const message = await incomingMessagePromise;

    ctx.response.status = 200;
    ctx.response.body = message;
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = 'Ooops. Something went wrong.';
  }
});

router.post('/publish', async (ctx, next) => {
  try {
    if (!ctx.request.body.message) {
      ctx.response.status = 400;
      ctx.response.body = 'The message is empty.';
      return;
    }

    incomingMessageResolve(ctx.request.body.message);
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = 'Ooops. Something went wrong. Could not publish the message.';
    return;
  }

  incomingMessagePromise = new Promise((resolve) => {
    incomingMessageResolve = resolve;
  });

  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;
