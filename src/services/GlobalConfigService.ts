import { type IService } from '../utils/ServiceLocator';

interface IBaseConfigs {
    configFilesPath: string
    configIntegrationFilesPath: string
}

export class GlobalConfigService implements IService {
    private initedFlag = false;

    private readonly config: Record<string, any> & IBaseConfigs = {
        configFilesPath: 'serverData',
        configIntegrationFilesPath: 'serverData/integrations'
    };

    get inited (): boolean {
        return this.initedFlag;
    }

    init (): void {
        this.initedFlag = true;
    }

    get<T extends object = Record<string, any>>(): T & IBaseConfigs {
        return this.config as T & IBaseConfigs;
    }
}
