self.onmessage = (event) => {
  try {
    const value = Function(`"use strict";${event.data}`)();
    self.postMessage({
      ok: true,
      value: JSON.stringify(value),
      type: Array.isArray(value) ? "array" : typeof value,
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: String(error instanceof Error ? error.message : error),
    });
  }
};