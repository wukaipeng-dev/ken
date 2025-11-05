# 内部分享：开发利器 React Query

## 背景

`@tanstack/react-query` （下称 RQ）在 GitHub 上已经累积了 4w+ 的 ⭐，称得上 React 技术栈中必不可少的工具。

它并不像 Zustand 这些通用的状态管理库，而是**针对请求这一场景，做了相关的深度优化和功能定制**。

RQ 在当前项目已经引入将近两个月，但是使用情况并不多，障碍可能来自于 RQ 的学习曲线和心智认知，所以开展本次 RQ 分享，让团队各位更多地了解 RQ 的能力，进而利用好 RQ，提高开发效率。

## RQ 和 Axios 的关系

目前我们的项目中使用 Axios 作为请求器，而 RQ 并不是用来替代 Axios，而是用来增强 Axios 的。

看一下例子：

```typescript
// 👉 这是用 Axios 去实现的获取站内信未读总数的接口方法
export function getUnreadNotificationCount(): Promise<number> {
  return clientApi.get(URL.GET_UNREAD_NOTIFICATION_COUNT, {
    fetchOptions: {
      experimental_throw_all_errors: true,
      experimental_no_toast_when_error: true,
    },
  });
}

// 👉 使用 RQ 通过 hook 封装的方式，去增强未读总信接口
import { useQuery } from '@tanstack/react-query';
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notification', 'unread-count'],
    // 👉 RQ 最终调用我们提供给接口方法
    queryFn: getUnreadNotificationCount, 
  });
};
```

所以 RQ 其实是请求框架无关的工具，它可以和 Axios，GraphQL，或者原生 `fetch()` 方法等结合使用。

## 功能一：减少样板代码

### 不使用 RQ

假设我们不使用 RQ，那么正常调用一个接口就是：

```typescript
import { useState, useEffect } from 'react';

function NotificationBadge() {
  // 👉 定义一堆状态
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 👉 手动控制各个状态
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const count = await getUnreadNotificationCount();
        setCount(count);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notifications</div>;

  return <div>Unread: {count}</div>;
}
```

如果这个接口在多个地方使用，我们需要封装为一个自定义 hook：

```typescript
// 👉 创建自定义 hook
import { useState, useEffect } from 'react';

export function useUnreadNotificationCount() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setIsLoading(true);
        const count = await getUnreadNotificationCount();
        setCount(count);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCount();
  }, []);

  return [count, isLoading, error];
}

function NotificationBadge() {
  const { count, isLoading, error } = useUnreadNotificationCount();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notifications</div>;

  return <div>Unread: {count}</div>;
}
```

### 使用 RQ

使用 RQ 之后：

```typescript
// 1. 用 RQ 封装自定义 hook
import { useQuery } from '@tanstack/react-query';
export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ['notification', 'unread-count'],
    queryFn: getUnreadNotificationCount,
  });
};

// 2. 引用该 hook
function NotificationBadge() {
  const { data: count, isLoading, error } = useUnreadNotificationCount();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading notifications</div>;

  return <div>Unread: {count}</div>;
}
```

RQ 相当于语法糖，简化了自定义 hook 的封装，可以大大减少我们写样板代码。

## 功能二：减少重复请求

在我们的通知页中，中间菜单和右侧内容都有标题【点赞】以及未读数【3】，这里的未读数都是通过接口获取：

![](https://img.wukaipeng.com//2025/11/06-001511-aZvvkL-image-20251106001508753.png)

### 不使用 RQ

那么两个地方引用了相同的数据，没有 RQ 的情况下，处理方式有：

**状态提升**。把请求接口提升到他们的共同的父组件中。
- 优点: 简单直接，单一数据源。
- 缺点: 父组件需要知道子组件的数据需求

```javascript
function NotificationPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true);
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MiddleMenu unreadCount={unreadCount} />
      <RightContent unreadCount={unreadCount} onRefresh={fetchUnreadCount} />
    </div>
  );
}
```

**Context API**：使用 `<Context>` 组件，跨层级共享数据。
- 优点: 避免 Props 穿透（props drilling），组件解耦。
- 缺点: 任何 context 值变化会导致所有消费者重新渲染，需要额外的 Provider 包裹

```javascript
const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnreadCount = async () => {
    try {
      setIsLoading(true);
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, isLoading, refetch: fetchUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

// 使用
function MiddleMenu() {
  const { unreadCount, isLoading } = useContext(NotificationContext);
  return <div>未读: {unreadCount}</div>;
}

function RightContent() {
  const { unreadCount, refetch } = useContext(NotificationContext);
  return <div>未读: {unreadCount}</div>;
}
```

**封装 Hook**：把请求封装到 hook 中
- 优点：共享请求状态
- 缺点：每个组件都会重复请求

### 使用 RQ

使用 RQ 之后：

```javascript
function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notificationCount'],
    queryFn: getUnreadNotificationCount,
  });
}

function MiddleMenu() {
  const { data: unreadCount, refresh } = useUnreadNotificationCount();
  return <div>未读: {unreadCount}</div>;
}

function RightContent() {
  const { data: unreadCount } = useUnreadNotificationCount();
  return <div>未读: {unreadCount}</div>;
}
```

**优点：**
✅ **自动去重**: 两个组件同时挂载只发 1 次请求（`queryKey` 相同）  
✅ **无需 Provider**: 不需要包裹父组件  
✅ **组件独立**: 每个组件独立使用，不依赖父组件传递  

> 这里提到"两个组件同时挂载只会发起 1 次请求"，其原理就是 RQ 会缓存请求的数据。RQ 的很多功能都是基于缓存来操作。

## 功能三：重刷新

还是通知的例子，当用户打开"点赞"页面，在这里查看消息的时候，【未读数】需要动态更新：

![](https://img.wukaipeng.com//2025/11/06-001654-6ZWEZX-image-20251106001653820.png)



### 不使用 RQ

没有 RQ 的情况下，我们需要对这么多个组件做数据联动，方案还是状态提升、Context，当然，还可以通过事件总线（EventEmitter）的方式：

```javascript
// 定义一个事件总线通用方法：eventBus.js
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
  }
}

export const eventBus = new EventBus();


// 对于左侧菜单
function LeftMenu() {
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getUnreadTotalNotificationCount();
      setTotalUnreadCount(count);
    };
    
    fetchCount();
    
    // ⚠️ 监听刷新事件
    const handleRefresh = () => fetchCount();
    eventBus.on('notification:read', handleRefresh);
    
    return () => {
      eventBus.off('notification:read', handleRefresh);
    };
  }, []);

  return <div>通知 ({totalUnreadCount})</div>;
}

// 对于中间的菜单
function MiddleMenu() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    };
    
    fetchCount();
    
    // ⚠️ 监听刷新事件
    const handleRefresh = () => fetchCount();
    eventBus.on('notification:read', handleRefresh);
    
    return () => {
      eventBus.off('notification:read', handleRefresh);
    };
  }, []);

  return <div>点赞 ({unreadCount})</div>;
}

// 对于右侧内容
function RightContent() {
  const handleMarkAsRead = async (id) => {
    await markNotificationAsRead(id);
    
    // ⚠️ 触发刷新事件
    eventBus.emit('notification:read');
  };

  return (
    <button onClick={() => handleMarkAsRead(123)}>
      标记已读
    </button>
  );
}
```

### 使用 RQ

使用 RQ，利用它的 `invalidateQueries()` 方法可以实现同样的效果：

```javascript
// 对于左侧菜单
function LeftMenu() {
  const { data: unreadTotalCount, refresh } = useQuery({
    queryKey: ['totalNotificationCount'],
    queryFn: getTotalUnreadNotificationCount,
    staleTime: Infinite,
  });

  return <div>点赞 ({unreadCount})</div>;
}


// 对于中间的菜单
function MiddleMenu() {
  const { data: unreadCount } = useQuery({
    queryKey: ['notificationCount'],
    queryFn: getUnreadNotificationCount,
  });

  return <div>点赞 ({unreadCount})</div>;
}

// 对于右侧内容
function RightContent() {
  const queryClient = useQueryClient();
  const { data: unreadCount } = useQuery({
    queryKey: ['notificationCount'],
    queryFn: getUnreadNotificationCount,
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications', 'print-and-collect'],
    queryFn: () => getNotifications('print-and-collect'),
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // ✅ 自动让所有相关查询失效并重新获取
      queryClient.invalidateQueries({ queryKey: ['totalNotificationCount'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] }); 
    },
  });

  return (
    <div>
      <h2>点赞 (未读: {unreadCount})</h2>
      {notifications?.map(n => (
        <div key={n.id}>
          {n.content}
          {!n.isRead && (
            <button onClick={() => markAsReadMutation.mutate(n.id)}>
              标记已读
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

**优势**:
✅ **零配置自动同步**: `invalidateQueries` 一个方法搞定  
✅ **组件完全解耦**: `<RightMenu>`，`<MiddleMenu>` 和 `<RightContent>` 互不依赖  
✅ **数据一致性**: 始终从服务器获取最新数据  
✅ **无需手动管理**: 不需要回调、Context、事件总线  
✅ **乐观更新**: 可以先更新 UI，再同步服务器  

> RQ 底层也是使用发布/订阅（pub/sub）设计模式。

## 功能四：乐观更新

### 什么是乐观更新？

乐观更新对应的是悲观更新，悲观更新也就是比较传统的做法——先请求 API，再更新 UI。  
而**乐观更新是先更新 UI，再请求 API**。

| ✅ 适合场景 | ❌ 不适合场景 |
|------------|--------------|
| 点赞/收藏（高概率成功） | 支付、转账等关键操作 |
| 标记已读/未读 | 复杂的业务逻辑（服务器可能拒绝） |
| 切换开关状态 | 数据结构复杂，难以预测结果 |
| 简单的增删改操作 | 需要服务器计算的数据（如库存扣减） |
| 用户期望即时反馈的操作 | |

了解了乐观更新，我们来引用它去优化上一节提到的内容，先更新未读数的 UI，再请求 API：

```javascript
const markAsReadMutation = useMutation({
  mutationFn: markNotificationAsRead,
  
  // ✅ 乐观更新：立即更新 UI，不等待服务器响应
  onMutate: async (notificationId) => {
    // 取消正在进行的查询
    await queryClient.cancelQueries({ queryKey: ['notificationCount'] });
    
    // 保存之前的值（用于回滚）
    const previousCount = queryClient.getQueryData(['notificationCount']);
    
    // 立即更新未读数
    queryClient.setQueryData(['notificationCount'], (old) => old - 1);
    
    return { previousCount };
  },
  
  // ❌ 如果失败，回滚
  onError: (err, variables, context) => {
    queryClient.setQueryData(['notificationCount'], context.previousCount);
  },
  
  // ✅ 无论成功失败，最终都重新获取确保数据一致
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['notificationCount'] });
  },
});
```

## DevTools

RQ 提供了一个 Devtools，可以作为调试使用，可以提升我们的开发效率。

可以在项目本地开发环境下集成 Devtools，在右下角这个浮动按钮：

![DevTools 按钮位置]()

对于 Devtools 来说，比较好用的主要有 Actions 和 Data Explorer，可以手动查看相关数据，也可以触发 RQ 的相关方法：

![DevTools 界面]()

## 深入学习

1. **中文文档**  
   目前官方文档只有英文，目前有挺多的相关中文文档镜像，比如：  
   https://tanstack.com.cn/query/latest/docs/framework/react/overview  
   也可以自行 google "tanstack 中文文档"

2. **沉浸式翻译**  
   一款 web 插件，一键把英文翻译成中文，原汁原味，适合 RQ 原文档学习。  
   https://chromewebstore.google.com/detail/bpoadfkcbjbfhfodiogcnhhhpibjhbnh?utm_source=item-share-cb

3. **Zread**  
   如果想进一步了解 RQ 的源码或者功能，可以使用 Zread，它已经索引了 RQ 的 GitHub 仓库，并且提供 AI 问答，目前免费： https://zread.ai/TanStack/query

## 扩展：服务端组件中如何使用？

留一个问题