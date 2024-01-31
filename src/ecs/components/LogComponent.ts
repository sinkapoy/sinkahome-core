export class LogComponent {
    debugLog: string[] = [];

    infoLog: string[] = [];

    warningLog: string[] = [];

    errorLog: string[] = [];

    constructor (public limit = 1000) {
        //
    }

    debug (...args: any[]): void {
        this.write(this.debugLog, args);
    }

    info (...args: any[]): void {
        this.write(this.infoLog, args);
    }

    warning (...args: any[]): void {
        this.write(this.warningLog, args);
    }

    error (...args: any[]): void {
        this.write(this.errorLog, args);
    }

    private write (log: string[], args: any[]): void {
        const msg = args.map((arg) => {
            switch (typeof arg) {
                    case 'string':
                        return arg;
                    case 'bigint':
                    case 'number':
                        return arg.toString(10);
                    case 'function':
                        return `function ${arg.name}`;
                    case 'boolean':
                        return arg ? 'true' : 'false';
                    case 'object':
                        return JSON.stringify(arg, undefined, 2);
                    case 'symbol':
                    case 'undefined':
                        return String(arg);
                    default:
                        return '';
            }
        });

        log.push(msg.reduce((prev, current) => {
            prev += `\n${current}`;
            return prev;
        }));

        while (log.length > this.limit) {
            log.shift();
        }
    }
}
