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
    readonly args: IActionArgument[];
    readonly result: IActionResult[];
}

class Action implements IAction {
    constructor (
        public readonly id: string,
        public description?: string,
        public readonly args: IActionArgument[] = [],
        public readonly result: IActionResult[] = [],
    ) {}
}

export class ActionsComponent extends Map<string, Action> {
    addFromJson (json: IAction): Action {
        const action = new Action(
            json.id,
            json.description,
            JSON.parse(JSON.stringify(json.args)) as IActionArgument[],
            JSON.parse(JSON.stringify(json.args)) as IActionResult[],
        );
        this.set(json.id, action);

        return action;
    }
}
