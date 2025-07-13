const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@prisma/client$': '<rootDir>/node_modules/@prisma/client/index.js',
    '^@prisma/client/(.*)$': '<rootDir>/node_modules/@prisma/client/$1',
    '^jose$': '<rootDir>/node_modules/jose/dist/node/cjs/index.js',
    '^jose/(.*)$': '<rootDir>/node_modules/jose/dist/node/cjs/$1',
    '^@panva/hkdf$': '<rootDir>/node_modules/@panva/hkdf/dist/node/cjs/index.js',
    '^@panva/hkdf/(.*)$': '<rootDir>/node_modules/@panva/hkdf/dist/node/cjs/$1',
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
    '^uuid/(.*)$': '<rootDir>/node_modules/uuid/dist/$1',
    '^preact-render-to-string$': '<rootDir>/node_modules/preact-render-to-string/dist/commonjs.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/test/**',
    '!src/**/tests/**',
    '!src/**/node_modules/**',
    '!src/**/.next/**',
    '!src/**/coverage/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!(jose|openid-client|next-auth|@panva|oidc-token-hash|@panva/hkdf|uuid|@next-auth|@auth|@auth/core|@auth/nextjs|preact-render-to-string|preact)/).+\\.js$'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 