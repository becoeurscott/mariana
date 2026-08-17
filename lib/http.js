import { NextResponse } from 'next/server';

/**
 * Wrap a Route Handler to auto-convert thrown errors to JSON responses.
 * Route Handlers must therefore stay THIN — validate + delegate to a Service.
 */
export function handler(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      const status = e?.status || 500;
      const message = e?.message || 'Internal error';
      if (status >= 500) console.error('[api]', e);
      return NextResponse.json({ error: message }, { status });
    }
  };
}

export function ok(data, init) { return NextResponse.json(data, init); }
export function created(data)  { return NextResponse.json(data, { status: 201 }); }

export function httpError(status, message) {
  const e = new Error(message);
  e.status = status;
  return e;
}
