import Koa from "koa";
import path from "path";
import resource from "koa-static";
import conditional from "koa-conditional-get";
import etag from "koa-etag";

const app = new Koa();
const host = "localhost";
const port = 5999;

// 强制缓存，5s后才会重新请求服务器资源
// 首次请求 200
// 第二次请求 状态代码: 200 OK （来自内存缓存）
app.use(async (ctx, next) => {
  ctx.set({
    "Cache-Control": "max-age=10", // 用来设置资源（representations）可以被缓存多长时间，单位为秒
    // "Cache-control": "no-store", // 禁止一切缓存（这个才是响应不被缓存的意思）。
    // "Cache-control": "no-cache", // 储存在本地缓存区中，只是在与原始服务器进行新鲜度再验证之前，缓存不能将其提供给客户端使用
    // "Cache-control": "private", // 内容只缓存到私有缓存中(仅客户端可以缓存，代理服务器不可缓存)
    // "Cache-control": "public", // 所有内容都将被缓存(客户端和代理服务器都可缓存)
  });
  await next();
});

// 协商缓存 Etag
// Response Headers ETag: W/"8c99-18720faf33c"
// 首次 200
// 第二次 304 Not Modified
// app.use(conditional());
// app.use(etag());

app.use(resource(path.join(__dirname, "./static")));

app.listen(port, () => {
  console.log(`server is listen in ${host}:${port}`);
});
