import { homeEngine, type HomeEngine } from 'src/ecs/HomeEngine';

export interface IService {
    init: (egnine: HomeEngine) => void;
    inited: boolean;
}

export class ServiceLocator<ServicesT> {
    private services: Partial<ServicesT & Record<string, IService>> = {};

    set<T extends keyof ServicesT>(name: T, service: ServicesT[T]): void {
        // @ts-expect-error todo: fix types
        this.services[name] = service;
    }

    get<T extends keyof ServicesT>(name: T): ServicesT[T] {
        const service = this.services[name];
        if (!service) throw new Error(`service ${String(name)} doesn't present`);
        if (!service.inited) service.init(homeEngine);
        return service as ServicesT[T];
    }
}
