import { defineNode } from '@ash.ts/ash';
import { UserComponent } from '../components/users';

const CLASS_MAP = {
    user: UserComponent,
};

export class UserNode extends defineNode(CLASS_MAP) {}
