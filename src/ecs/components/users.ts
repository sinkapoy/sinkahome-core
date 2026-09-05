export class UserComponent {
    constructor (
        public readonly id: number,
        public name: string,
    ) {

    }
}


export class UserTokenGeneratorInfo {
    constructor(
        public readonly secretKey: string,
        public readonly refreshSecretKey: string,
        public readonly totpKey: string,
    ){}
}

export class UserTokenInfo {
    constructor(
        public readonly token: string,
        public readonly refresh: string
    ) { }
}