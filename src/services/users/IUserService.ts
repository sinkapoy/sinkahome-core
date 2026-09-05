import { Entity } from '@ash.ts/ash';
import type { IService } from 'src/utils/ServiceLocator';

export interface ITokenData {
    user: number;
    iat: number;
    exp: number;
}

export interface IUserService extends IService {
    getUserById(id: number): Entity | undefined;
    
    isValidUserSign(sign: string, user: number): boolean;

    getUserToken(user: number, pwd: string): Promise<{token: string; refreshToken: string;} | {error: string}>;

    verifyToken(token: string, refresh?: boolean): Promise<any>;

    generateNewUser(nickname: string): Promise<string>;

    readConfig(): Promise<void>;
}