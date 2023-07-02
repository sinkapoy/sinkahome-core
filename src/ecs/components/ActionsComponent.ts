export abstract class ActionPrototype{
    constructor(
        public readonly id: string,
        public description?: string,
    ){}

    abstract execute(): void;
}

export class ActionsComponent extends Map<string, ActionPrototype>{
    
}