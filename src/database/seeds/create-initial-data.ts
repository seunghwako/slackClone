import { Channels } from '../../entities/Channels';
import { Workspaces } from '../../entities/Workspaces';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const workspacesRepository = dataSource.getRepository(Workspaces);
    await workspacesRepository.insert([
      { id: 1, name: 'Sleact', url: 'sleact' },
    ]);
    const channelsRepository = dataSource.getRepository(Channels);
    await channelsRepository.insert([{ id: 1, name: '일반', private: false }]);
  }
}
