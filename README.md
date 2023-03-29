## HTTP 1.0

- TCP 连接无法复用，每次请求都需要重新建立 TCP 通道，这就需要重复进行三次握手和四次挥手，也就是说每个 TCP 连接只能发送一个请求
- 对头阻塞，每个请求都要过“独木桥”，桥宽为一个请求的宽度，也就是说，即使多个请求并行发出，也只能一个接一个地进行排队

## HTTP 1.1

- 长连接：HTTP 1.1 支持长连接，且会默认开启 Connection: keep-alive，这样在一个 TCP 连接上可以传送多个 HTTP 请求和响应，减少了建立和关闭连接的消耗和延迟。
- 管线化：管线化在长连接的基础上使多个请求可以用同一个 TCP 连接，这样复用 TCP 连接就使得并行发出请求成为可能。当浏览器同时发出多个 HTTP 请求时，浏览器无需等待上一个请求返回结果，即可处理其他请求。但是需要注意，管线化只是可以使浏览器并行发出请求，并没有从根本上解决对头阻塞问题，因为对请求的响应仍然要遵循先进先出的原则，第一个请求的处理结果返回后，第二个请求才会得到响应。同时，浏览器供应商很难实现管线化，而且大多数浏览器默认禁用管线化特性，有的设置完全删除了它。
- 增加了与缓存相关的请求头
- 进行了带宽优化，并能够使用 range 头等来支持断点续传
- 新增错误类型，并增强了错误和响应码的语义特性
- 新增了 Host 头处理，如果请求消息中没有 Host 头，则会报错
- 添加了 put、delete、options 等请求

缺点：

- 没有真正解决对头堵塞问题
- 明文传输，安全性有隐患
- header 中携带的内容过多，增加了传输成本
- 默认开启 Connection: keep-alive 可能会给服务器造成性能压力。比如，对于一次性的请求（如兔皮哦按 CDN 服务），在文件被请求之后还保持了很长时间不必要的连接

## HTTP 2.0

### 新增相关基础概念

- 帧：在 HTTP 2.0 中，客户端与服务端通过交换帧来通信，帧是基于这个新协议通信的最小单元
- 消息：是指逻辑上的 HTTP 消息，如请求、响应等，由一帧或多帧组成
- 流：流是连接中的一个虚拟信道，可以承载双向消息；每个流都有一个唯一的标识符

### 最主要特性

1. 二进制分帧  
   二进制协议将通信传输信息分解为帧，这些帧交织在客户端与服务器之间的双向逻辑流中，使所有通信都可以在单个 TCP 连接上执行，而且该连接在整个对话期间一直处于打开状态
2. 请求/响应复用  
   一个请求对应一个流并分配一个 id，这样一个连接上可以有多个流，所有流的帧都可以相互混杂在一起，接收方可以根据流的 id 将帧分配到各自不同的请求中。【此技术实现了完全双向的请求和响应消息复用，解决了队头阻塞的问题】
   所有相同域名的请求都会通过同一个 TCP 连接并发送。同一个 TCP 连接中可以发送多个请求，对端可以通过帧中的标识符知道该帧属于哪一个请求。通过这个技术，便可以避免 HTTP 旧版本中的对头阻塞问题，极大地提高传输性能。这是真正意义上的多路复用。
3. 报头压缩  
   浏览器只发送与前一个报头的不同之处，而对于相同之处，服务器可以从报头的列表中获取。
4. 流优先化  
   给流分配优先级。服务器根据优先级确定它的处理顺序
5. 服务端推送
6. 流控制  
   流控制允许接受者主动示意停止发送或减少发送的数据量。比如：视频的暂停，则客户端会通知服务器端停止发送视频数据，以免耗尽自身的缓存

### 核心两点

1. 长连接
2. 队头阻塞
