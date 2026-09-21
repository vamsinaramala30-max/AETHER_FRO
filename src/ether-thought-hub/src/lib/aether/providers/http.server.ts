import { AetherProviderError } from "./types";

/** Reads an HTTP body as newline-delimited SSE `data:` payloads. */
export async function* readSseData(
  response: Response,
): AsyncGenerator<string, void, unknown> {
  if (!response.body) throw new AetherProviderError("Empty provider response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let index = buffer.indexOf("\n");
    while (index !== -1) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (line.startsWith("data:")) {
        const payload = line.slice(5).trim();
        if (payload) yield payload;
      }
      index = buffer.indexOf("\n");
    }
  }
  const tail = buffer.trim();
  if (tail.startsWith("data:")) {
    const payload = tail.slice(5).trim();
    if (payload) yield payload;
  }
}

/** Reads an HTTP body as newline-delimited JSON objects (Ollama native). */
export async function* readJsonLines(
  response: Response,
): AsyncGenerator<unknown, void, unknown> {
  if (!response.body) throw new AetherProviderError("Empty provider response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let index = buffer.indexOf("\n");
    while (index !== -1) {
      const line = buffer.slice(0, index).trim();
      buffer = buffer.slice(index + 1);
      if (line) {
        try {
          yield JSON.parse(line);
        } catch {
          /* ignore malformed keep-alive lines */
        }
      }
      index = buffer.indexOf("\n");
    }
  }
  const tail = buffer.trim();
  if (tail) {
    try {
      yield JSON.parse(tail);
    } catch {
      /* ignore */
    }
  }
}

export async function assertOk(response: Response, providerLabel: string) {
  if (response.ok) return;
  let detail = "";
  try {
    detail = (await response.text()).slice(0, 600);
  } catch {
    detail = response.statusText;
  }
  throw new AetherProviderError(
    `${providerLabel} request failed (${response.status}): ${detail || response.statusText}`,
    response.status >= 400 && response.status < 600 ? response.status : 502,
    "upstream_error",
  );
}
