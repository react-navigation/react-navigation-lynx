---
'@react-navigation/lynx': patch
---

Drop the context bridge the container used to reach its own imperative handle. ReactLynx 0.126 moves to Preact 11, where a ref on a function component arrives as a prop the way React 19 delivers it, so `useLinking` can take the ref directly.
