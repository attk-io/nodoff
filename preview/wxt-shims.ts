// Minimal stubs for WXT globals so the popup UI renders outside the extension context.
// Timer functionality won't work, but all UI/styling will.

/* eslint-disable @typescript-eslint/no-explicit-any */
(window as any).storage = {
  defineItem: () => ({
    getValue: async () => ({}),
    watch: () => () => {},
  }),
};

(window as any).browser = {
  tabs: {
    query: async () => [],
  },
  runtime: {
    sendMessage: async () => ({ state: null }),
  },
};
