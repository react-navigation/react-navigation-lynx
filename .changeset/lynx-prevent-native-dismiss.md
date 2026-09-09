---
'@react-navigation/lynx': minor
---

Accept `preventNativeDismiss` as a screen option. `usePreventRemove` was the only way to refuse a native dismissal; a screen that handles its own close flow and only needs the gesture kept out can now say so in its options. `onNativeDismissPrevented` dispatches only when the hook asked, since only the hook has a `beforeRemove` listener to satisfy.
