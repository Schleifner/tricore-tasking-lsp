import type { Config } from 'jest';

const config: Config = {
	roots: ['server/tests'],
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true
}

export default config;