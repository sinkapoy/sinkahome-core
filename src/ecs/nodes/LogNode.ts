import { defineNode } from '@ash.ts/ash';
import { LogComponent } from '../components/LogComponent';

export class LogNode extends defineNode({
    logger: LogComponent
}) {}
