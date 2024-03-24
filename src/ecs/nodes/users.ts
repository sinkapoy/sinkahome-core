import { defineNode, JsonEngineCodec } from '@ash.ts/ash';
import { UserComponent } from '../components/users';

const CLASS_MAP = {
    user: UserComponent,
};

export const userEntityIOCodec = new JsonEngineCodec(CLASS_MAP as any);
export class UserNode extends defineNode(CLASS_MAP) {}
