---
slug: infinite-chrome
title: 如何同时打开多个 Chrome 呢？
authors: wukaipeng
---

哈喽，我是楷鹏。

今天想要分享 Chrome 的一个小技巧，可以一次性打开多个干净独立的 Chrome，让你的开发更丝滑。

开头做个小调查，你平时开发的时候，会使用哪些浏览器呢？

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] 其他

我平时开发的时候，主力就是使用 Chrome。

Chrome 的 DevTools 功能非常强大，满足前端开发调试的绝大数需求。

但是长期来有一个困扰我的问题，就是我的日常使用和开发是**耦合**在一起的。

比如，我的 Chrome 会装载很多的插件：

![Chrome Extensions](https://img.wukaipeng.com//2025/07/08-213533-tgVkG2-image-20250708213533037.png)

这些插件会影响我的开发，因为他们可能在页面中会插入 HTML 或者 CSS 代码，以及会产生很多额外的请求，干扰我的正常开发调试。

比如下面侧边栏的插件 HTML：

![Chrome Layer Tab](https://img.wukaipeng.com//2025/08/06-000130-dQfKmL-image-20250806000129455.png)

此时的选择，要么是开启无痕窗口，要么是换另外一个浏览器。

这两种方式都不错，但无痕窗口还是使用同一个 Chrome 实例，并且重新打开无痕窗口，所有的状态都会被清空。

另外一种方式是换另外一个浏览器，我曾经尝试过，但是后来又放弃了，换一个浏览器就相当于换一种全新的开发环境，需要重新适应界面、操作习惯等等，真的很别扭。

最近学到了另一种新方式，就是可以通过使用不同的用户数据目录，来创建不同的 Chrome 实例。

运行命令：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome_user_dir_1"
```

你就可以创建一个全新的 Chrome 实例，并且这个实例的配置、插件、历史记录等都是独立的。

![Create Chrome Instance](https://img.wukaipeng.com//2025/07/08-002759-3B2OHR-image-20250708002759144.png)

甚至在 Dock 栏，你还可以看到两个 Chrome 图标：

![Chrome Instances in Dock](https://img.wukaipeng.com//2025/07/08-003053-0GuO3E-image-20250708003053037.png)

这个新创建的 Chrome 实例，完全可以看作是一个全新的 Chrome 浏览器。

你可以修改主题，来和其他 Chrome 实例区分开来：

![Modify Theme](https://img.wukaipeng.com//2025/07/08-210920-t5HzRo-image-20250708210919880.png)

或者登录不同的账号等等操作，这是完全属于你的第二 Chrome。

通过运行这条命令，理论上你可以创建无限个 Chrome 实例，只需要修改 `--user-data-dir` 参数即可，比如：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome_user_dir_2"
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome_user_dir_3"
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir="/tmp/chrome_user_dir_4"
......
```

不过平时实际使用的时候，我一般使用两个 Chrome 实例，来回切换，一个用于网站浏览，一个用于开发调试。

在开发调试的时候，每次打开项目再打开新的 Chrome 会有一点点烦躁，所以你可以考虑将这条命令写入到你的前端项目 `package.json` 的脚本中：

```json
  "scripts": {
    "dev": "next dev --turbopack",
    "open-chrome": "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --args --user-data-dir=/tmp/ChromeNewProfile http://localhost:3000",
    "dev:chrome": "npm run open-chrome && npm run dev"
  },
```

这样你就可以通过 `npm run dev:chrome` 来打开 Chrome 实例，并且自动运行 `next dev` 命令。

> Windows PowerShell 用户可以使用：
> ```json
>  "scripts": {
>    "dev": "next dev --turbopack",
>    "open-chrome": "powershell -Command \"Start-Process 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' -ArgumentList '--user-data-dir=D:\\temp\\ChromeNewProfile', 'http://localhost:3000'\"",
>    "dev:chrome": "npm run open-chrome && npm run dev"
>  },
>```

如果你希望打开 Chrome 实例的时候，同时打开 `localhost:3000` 页面来看到页面效果，可以在命令后面直接添加 `http://localhost:3000`：

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:chrome": "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=\"/tmp/chrome_user_dir_1\" http://localhost:3000 && npm run dev"
  }
}
```

好了，这就是本期的全部内容，如果对你有帮助，欢迎点赞、收藏、转发。

我是楷鹏，我们下期再见。