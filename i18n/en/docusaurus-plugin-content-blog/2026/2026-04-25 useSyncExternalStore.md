---
slug: use-sync-external-store
title: "A Less-Known but Powerful React Hook: useSyncExternalStore"
authors: wukaipeng
---

In general, React state comes from inside the component itself, such as values created with `useState`.

But sometimes, the state comes from somewhere else. As shown in the classic example from the React docs, we may need to track whether the browser is online:

If the network is available, show ✅ Online; otherwise show ❌ Disconnected.

![Online](https://img.wukaipeng.com//2026/04/20-231445-S5GJtQ-image-20260420231445629.png)

![Offline](https://img.wukaipeng.com//2026/04/20-231537-VF0caA-image-20260420231536896.png)

*Use Chrome DevTools > Network to simulate online/offline states.*

Here, the **online status** comes from the external value `navigator.onLine`, so `useSyncExternalStore` is a perfect fit:

```typescript
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

As you can see, the basic setup for `useSyncExternalStore` includes a subscribe function and a getSnapshot function:

```typescript
const isOnline = useSyncExternalStore(subscribe, getSnapshot);
```

If you look closely at the subscribe function, it runs logic inside the function, calls `callback`, and finally returns a cleanup function. This feels very similar to the usual effect hook `useEffect`:

```typescript
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

That `callback` is important: React calls it like a delivery person, and it asks `getSnapshot` for the latest value. If the value has changed, React immediately updates the component.

```mermaid
flowchart LR
  subscribe --> callback
  callback --> getSnapshot["getSnapshot()"]
  getSnapshot --> callback
  callback --> |"update"| react-component["React component"]
```

At this point, you might think that `useEffect` could also do the same thing:

```typescript
import { useState, useEffect } from 'react';

export default function ChatIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

If `useEffect` can do the same thing, is `useSyncExternalStore` just unnecessary extra work?

This is where React tearing becomes important. Consider a simple component like this:

![React Tearing Demo](https://img.wukaipeng.com//2026/04/23-234243-jd51P7-20260423-234140.gif)

If you look carefully, when the page first opens, these counters show different values such as 218, 219, and 220, and then they all eventually become 221.

In reality, all of these counters are reading from the same external data source. In theory, they should always stay in sync.

But React 18’s concurrent rendering model doesn’t always behave politely.

```mermaid
flowchart TB
React --> Counter1("Counter 1 = 218")
React --> Counter2("Counter 2 = 219")
React --> Counter3("Counter 3 = 220")
Counter3 --> ExternalStore("External data = 220")
```

Because rendering happens concurrently, some components may update to the latest external value while others lag behind.

That lag creates the visual effect of components being “torn” apart.

This is exactly why `useSyncExternalStore` exists. It calls `getSnapshot` during rendering to check whether the value is still current. If not, React discards the current render and performs a **synchronous, non-blocking** rerender with the latest value:

```mermaid
graph TD
    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px,color:#333;
    classDef check fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000;
    classDef danger fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000;
    classDef success fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000;
    classDef event fill:#fff3e0,stroke:#f57c00,stroke-width:2px,color:#000;

    Start([Rendering begins]) --> Read1["1. During render:<br>React calls getSnapshot"]

    Read1 --> Pause["2. Concurrency pauses:<br>React yields control"]

    Pause -. "External store may change here" .-> Commit["3. Early layout/commit phase"]

    Commit --> Read2[React calls getSnapshot again]

    Read2 --> Compare{"Tear check:<br>Is the snapshot still consistent?"}:::check

    Compare -- "No (tearing detected)" --> Bail[Abort the render!<br>Discard current output]:::danger
    Bail --> SyncRender[Force an immediate<br>synchronous rerender]:::danger
    SyncRender --> Subscribe

    Compare -- "Yes (data is safe)" --> Paint[Render UI to screen]:::success
    Paint --> Subscribe["4. Subscription phase:<br>Attach listeners to store"]

    Subscribe --> Idle([Idle / wait for store changes])

    Idle -- External event fires --> CheckChange[Call getSnapshot]:::event
    CheckChange --> CompareUpdate{"Did the value really change?"}:::check
    CompareUpdate -- Yes --> SyncRender
    CompareUpdate -- No --> Idle
```
