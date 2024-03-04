import { serviceLocator } from 'src/serviceLocator';
import { type IService } from 'src/utils/ServiceLocator';

export class UsersService implements IService {
    private configPath: string;

    inited = false;

    init (): void {
        const fsService = serviceLocator().get('files');
        this.configPath = serviceLocator().get('config').get().configFilesPath;
        fsService.join(this.configPath, 'usersConfig.json');
    }

    private async serverReadUsers (): Promise<void> {
        const fs = serviceLocator().get('files');
        if (await fs.exist(this.configPath)) {
            // const file = fs.read(this.configPath);
            // const config = {};
            try {
                //
            } catch {
                //
            }
        }
    }
}
