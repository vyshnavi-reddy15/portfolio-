export function captureError(e: unknown) {
  (globalThis as any).__lastError = e;
}
export function consumeLastCapturedError() {
  const e = (globalThis as any).__lastError;
  (globalThis as any).__lastError = undefined;
  return e;
}
