if (!globalThis.TextEncoder) {
  globalThis.TextEncoder = require('util').TextEncoder;
}
if (!globalThis.TextDecoder) {
  globalThis.TextDecoder = require('util').TextDecoder;
}
if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = require('stream/web').ReadableStream;
}
if (!globalThis.WritableStream) {
  globalThis.WritableStream = require('stream/web').WritableStream;
}
if (!globalThis.MessagePort) {
  globalThis.MessagePort = require('worker_threads').MessagePort;
}
if (!globalThis.MessageChannel) {
  globalThis.MessageChannel = require('worker_threads').MessageChannel;
}

// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

const { fetch, Headers, Request, Response } = require('undici');

if (!globalThis.fetch) globalThis.fetch = fetch;
if (!globalThis.Headers) globalThis.Headers = Headers;
if (!globalThis.Request) globalThis.Request = Request;
if (!globalThis.Response) globalThis.Response = Response;

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock environment variables
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret' 