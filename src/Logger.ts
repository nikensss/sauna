import pino from 'pino';
import { options } from './Commander.js';

export const logger = pino(
  { level: 'debug', enabled: options.debug },
  pino.destination(options.debug ? './sauna.log' : '/dev/null')
);
