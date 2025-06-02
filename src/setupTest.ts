import '@testing-library/jest-dom'; //Trea los matchers que necesitamos
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())