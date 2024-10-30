import { type PropertyDataType } from './PropertiesComponent';

export interface IActionArgument {
    name?: string;
    type: PropertyDataType;
    description?: string;
}

export interface IActionResult {
    name: string;
    type: PropertyDataType;
    description?: string;
}
export interface IAction {
    readonly id: string;
    description?: string;
    readonly argsT: IActionArgument[];
    readonly resultT: IActionResult[];
}

export enum GadgetActionState {
    none,
    invoking,
    finished,
}

class Action implements IAction {
    public lastArgs: any[] = [];
    public lastResult: any[] = [];
    public state: GadgetActionState = GadgetActionState.none;
    public lastFinishTime: number = 0;
    constructor (
        public readonly id: string,
        public description?: string,
        public readonly argsT: IActionArgument[] = [],
        public readonly resultT: IActionResult[] = [],
    ) {}
}

export class ActionsComponent extends Map<string, Action> {
    addFromJson (json: IAction): Action {
        const action = new Action(
            json.id,
            json.description,
            JSON.parse(JSON.stringify(json.argsT)) as IActionArgument[],
            JSON.parse(JSON.stringify(json.resultT)) as IActionResult[],
        );
        this.set(json.id, action);

        return action;
    }
}

export type ActionT = Action;
