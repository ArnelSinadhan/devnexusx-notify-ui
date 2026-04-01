# @devnexusx/notify-ui

A lightweight, customizable notification system — toasts + modals — for **vanilla JavaScript** and **React**.
No dependencies. Tiny. Accessible.

```
npm install @devnexusx/notify-ui
```

---

## Features

- Toast notifications — success, error, warning, info
- Modal dialogs — confirm, alert, success
- Promise-based API (`confirm`)
- Multiple positions (top/bottom, left/right/center)
- Built-in animations (slide, fade, bounce)
- Queue system for multiple toasts
- Light / dark / auto theme
- Fully customizable content (HTML)
- Accessible (ARIA + keyboard support)
- ESM + CJS + TypeScript types

---

## Usage

### Vanilla JS

```js
import { showSuccess, showError, confirm } from "@devnexusx/notify-ui";

showSuccess("Saved!");
showError("Something went wrong.");

const ok = await confirm({ message: "Continue?" });
```

---

### React

```tsx
import { NotifyProvider, useNotify } from "@devnexusx/notify-ui/react";

function App() {
  return (
    <NotifyProvider>
      <Demo />
    </NotifyProvider>
  );
}

function Demo() {
  const { showSuccess, confirm } = useNotify();

  return (
    <button
      onClick={async () => {
        if (await confirm({ message: "Are you sure?" })) {
          showSuccess("Done!");
        }
      }}
    >
      Click
    </button>
  );
}
```

---

## API

### Toast

```ts
showSuccess(message, options?)
showError(message, options?)
showWarning(message, options?)
showInfo(message, options?)
toast(options)
dismiss(id)
dismissAll()
```

---

### Modal

```ts
confirm(options): Promise<boolean>
alert(message, options?)
alertSuccess(message, options?)
```

---

### Config

```ts
configure({
  position: "top-right",
  duration: 4000,
  animation: "slide",
  theme: "light",
  maxVisible: 5,
});
```

---

## Install & Build

```bash
npm install
npm run build
```

---

## License

MIT
