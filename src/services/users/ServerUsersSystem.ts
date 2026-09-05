import { UserComponent, UserTokenGeneratorInfo } from 'src/ecs/components/users';
import { serviceLocator } from 'src/serviceLocator';
import { IUserService } from './IUserService';
import { type ClassType, CodecManager, Entity } from '@ash.ts/ash';
import {jwtVerify, SignJWT} from 'jose';
import { alphabet, digits, generateFromCharset } from 'src/utils/common';
import { homeEngine } from 'src/ecs';
import { authenticator, totp } from 'otplib';
const secretKey = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
);
const refreskKey = secretKey;

export class ServerUsersService implements IUserService {

    // @ts-expect-error ....
    static classMap: Map<string, ClassType<any>> = new Map([
        ['core:UserComponent', UserComponent],
        ['core:UserTokenGeneratorInfo', UserTokenGeneratorInfo],
    ]);

    private users: Record<number, Entity> = {};
    private usersByNickname: Record<string,Entity> = {}; 
    private configPath: string;

    inited = false;

    init (): void {
        const fsService = serviceLocator().get('files');
        this.configPath = serviceLocator().get('config').get().configFilesPath;
        this.configPath = fsService.join(this.configPath, 'usersConfig.json');
    }

    isValidUserSign(sign: string, user: number): boolean {
        return false;
    }

    getUserById(id: number): Entity | undefined {
        return undefined;
    }

    getUserByNickname(name: string){
        return this.usersByNickname[name];
    }

    getUserToken(user: number) {
        return this.generateTokens(user);
    }

    async verifyToken(token: string, refresh = false){
        const result = {
            ... await jwtVerify(token, refresh ? refreskKey : secretKey),
            valid: true,
        };

        if((result.payload.exp ?? Infinity) > Date.now()/1000){
            result.valid = false
        }

        return result;
    }

    async generateNewUser(nickname: string){
        // todo: chech id for existing
        const id = (Math.random()*0xffffffff) >> 0;

        const user = new Entity('user-' + id);
        const userComponent = new UserComponent(id, nickname);
        const tokenData = new UserTokenGeneratorInfo(
            this.secretKeyGenerator(),
            this.secretKeyGenerator(),
            authenticator.generateSecret(20),
        );
        user
            .add(userComponent)
            .add(tokenData);
        homeEngine.addEntity(user);
        this.users[id] = user;

        await this.saveUsers();
        
        const totpUri = totp.keyuri(nickname, 'sinkahome', tokenData.totpKey);
        console.log(totpUri);
        return totpUri;
    }

    async readConfig (): Promise<void> {
        const fs = serviceLocator().get('files');
        const codec = new CodecManager(ServerUsersService.classMap);
        if (await fs.exist(this.configPath)) {
            
            try {
                const file = JSON.parse(await fs.read(this.configPath));
                for(const user of file.users){
                    const entity = new Entity('user-' + user.id);
                    for(const componentData of user.userComponents){
                        const component = codec.decodeComponent(componentData);
                        console.log(component);
                        entity.add(component);
                    }
                    const userInfo = entity.get(UserComponent);
                    if(!userInfo) continue;
                    this.users[userInfo.id] = entity;
                    this.users[userInfo.name] = entity;
                    homeEngine.addEntity(entity);
                }
            } catch  (e){
                console.error('Error reading users config' + (e as Error).message);
            }
        }
    }

    private async generateTokens(user: number){
        const userEntity = homeEngine.getByUUID('user-' + user);
        if(!userEntity) return {error: 'No such user'};
        const userTokenData = userEntity.get(UserTokenGeneratorInfo);
        if(!userTokenData) return {error: 'User is not ours'};

        const tokenIssuer = new SignJWT({user, clientId: Math.random()});
        tokenIssuer.setProtectedHeader({alg: 'HS256'})
            .setIssuedAt(Date.now())
            .setExpirationTime('2m');
        const textEncoder = new TextEncoder()
        const token = await tokenIssuer.sign(textEncoder.encode(userTokenData.secretKey));
        const refreshToken = await tokenIssuer.sign(textEncoder.encode(userTokenData.refreshSecretKey));
        
        return {token, refreshToken};
    }

    private async saveUsers(){
        const save: any[] = [];
        const codec = new CodecManager(ServerUsersService.classMap);
        for(const id in this.users){
            const user = this.users[id];
            const userComponents: any[] = [];
            for(const component of user.components.values()){
                try{
                    userComponents.push(codec.encodeComponent(component));
                } catch{
                    ///
                }
            }
            save.push({
                id,
                userComponents
            });
        }
        await serviceLocator().get('files').write(this.configPath, JSON.stringify({
            users: save,
        }, undefined, 2));
    }

    // utils
    private secretKeyGenerator(){
        return generateFromCharset(64, alphabet + digits);
    }
}
