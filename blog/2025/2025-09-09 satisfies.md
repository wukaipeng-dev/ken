---
slug: typescript-satisfies
title: TypeScript 为什么要增加一个 satisfies？
authors: wukaipeng
---

最近，在很多依赖库的类型定义文件中，经常能看到了一个陌生的朋友：`satisfies`。

相信很多人都和我一样，看完 TypeScript 的相关文档，对这个关键字还是一头浆糊。

`satisfies` 关键字是 TypeScript 4.9 版本引入的，用于**类型断言**。

先看一下连接数据库的例子：

```typescript
type Connection = {}

declare function createConnection(
  host: string,
  port: string,
  reconnect: boolean,
  poolSize: number,
): Connection;
```

这里，我们声明了一个函数 `createConnection`，它接收四个参数，返回一个 `Connection` 类型。

接着：

```typescript
type Config = {
  host: string;
  port: string | number;
  tryReconnect: boolean | (() => boolean);
  poolSize?: number;
}
```

我们又声明了一个 `Config` 类型，它包含了四个属性：`host`、`port`、`tryReconnect` 和 `poolSize`。

接下来：

```typescript
const config: Config = {
  host: "localhost",
  port: 3000,
  tryReconnect: () => true,
}
```

我们声明了一个 `config` 变量，它包含这三个属性的值：`host`、`port`、`tryReconnect`。

OK，现在我们来调用 `createConnection` 函数，并传入 `config` 参数：

```typescript
function main() {
  const { host, port, tryReconnect, poolSize } = config;
  const connection = createConnection(host, port, tryReconnect, poolSize);
}
```

问题出现了：

![port 类型错误](https://img.wukaipeng.com//2025/09/09-201148-sgKZDN-image-20250909201147856.png)

这里 `port` 的类型是 `string | number`，而 `createConnection` 函数的参数类型是 `string`，所以会报错。

为了解决类型定义问题，我们需要加上类型断言的逻辑代码：

```typescript
function main() {
  let { host, port, tryReconnect, poolSize } = config;

  if (typeof port === "number") {
    port = port.toString();
  }

  const connection = createConnection(host, port, tryReconnect, poolSize);
}
```

`port` 类型正确了，但 `tryReconnect` 类型错误了：

![tryReconnect 类型错误](https://img.wukaipeng.com//2025/09/09-202039-skL0mC-image-20250909202039012.png)

我们一次性将这些类型修复：

```typescript
function main() {
  let { host, port, tryReconnect, poolSize } = config;

  if (typeof port === "number") {
    port = port.toString();
  }
  if (typeof tryReconnect === "function") {
    tryReconnect = tryReconnect();
  }
  if (typeof poolSize === "undefined") {
    poolSize = 10;
  }

  const connection = createConnection(host, port, tryReconnect, poolSize);
}
```

`port`、`tryReconnect`、`poolSize` 都进行了类型断言，问题解决了。

但是，这样写起来很麻烦，有没有更简单的方法呢？

一种方式是，去掉 `config` 的类型定义，放飞自我，让它自动被推断：

```typescript
const config = {
  host: "localhost",
  port: 3000,
  tryReconnect: () => true,
}
```

这样，我们可以一步到位：
```typescript
function main() {
  let { host, port, tryReconnect } = config;

  const connection = createConnection(host, port.toString(), tryReconnect(), 10);
}
```

但这样放飞类型，会引起另外的错误，比如 `config` 随便添加一个属性：

```typescript
const config = {
  host: "localhost",
  port: 3000,
  tryReconnect: () => true,
  pool: 10, // 新增了一个属性
}
```

这样 TypeScript 是一点都不会报错，但却会埋下隐藏炸弹，在代码上线的时候，可能会抓马，**为什么 `poorSize` 不生效？**

层层排查，最后才发现原来 `poolSize` 写错成了 `pool`。

这个时候，`satisfies`，千呼万唤始出来：

```typescript
const config = {
  host: "localhost",
  port: 3000,
  tryReconnect: () => true,
  pool: 10,
} satisfies Config;
```

![pool 类型错误](https://img.wukaipeng.com//2025/09/09-203123-7CAJns-image-20250909203123363.png)

不负众望，TypeScript 终于报错，告诉我们 `pool` 属性不存在。

`satisfies` 关键字为我们提供了一种两全其美的解决方案：

1.  **保证类型安全**：它会检查我们的对象结构是否**满足**（satisfies）指定的类型（如 `Config`）。如果你写了多余的属性（如 `pool`），或者属性类型不匹配，TypeScript 会立刻报错。这避免了“放飞自我”带来的隐患。
2.  **保留原始类型**：与使用类型注解 (`: Config`) 不同，`satisfies` **不会改变变量被推断出的原始具体类型**。变量 `config` 的 `port` 属性类型仍然是 `number`，`tryReconnect` 属性类型仍然是 `() => boolean`。

总结来说，`satisfies` 的核心优势在于：**在不丢失（泛化）原始推断类型的前提下，对该值进行类型检查。**

这使得我们既能获得编辑器对于具体类型的智能提示和类型推断的好处，又能确保这个值的结构符合我们预先定义好的更宽泛的类型约束，从而写出更安全、更灵活的代码。


## REFERENCES

- [TypeScript 4.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)
- [Satisfies Operator - new TypeScript 4.9 feature!](https://www.youtube.com/watch?v=6uJeT7y6CCo)