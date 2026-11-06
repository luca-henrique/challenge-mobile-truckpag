export interface HttpRequestOptions extends RequestInit {
  timeoutMs?: number;
}

export class HttpClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

export async function httpClient<T>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const { timeoutMs = 10000, signal, ...rest } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const mergedSignal = signal || controller.signal;

  try {
    const response = await fetch(url, {
      ...rest,
      signal: mergedSignal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...rest.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: unknown;
      if (typeof response.text === 'function') {
        try {
          const errorText = await response.text();
          errorData = JSON.parse(errorText);
        } catch (e) {
          // Mantém errorData como undefined ou texto se falhar o parse
        }
      }
      throw new HttpClientError(
        `HTTP Error ${response.status}: ${response.statusText || ''}`,
        response.status,
        errorData
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof HttpClientError) {
      throw error;
    }
    const err = error as Error;
    if (err.name === 'AbortError') {
      throw new HttpClientError('A requisição excedeu o tempo limite ou foi abortada.');
    }
    throw new HttpClientError(err.message || 'Erro de comunicação de rede.');
  }
}
