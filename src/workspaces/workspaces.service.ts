import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return this.workspacesRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: { WorkspaceMembers: [{ UserId: myId }] },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const returned = await queryRunner.manager
        .getRepository(Workspaces)
        .save({
          name: name,
          url: url,
          OwnerId: myId,
        });

      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: myId,
        WorkspaceId: returned.id,
      });

      const channelReturned = await queryRunner.manager
        .getRepository(Channels)
        .save({
          name: '일반',
          WorkspaceId: returned.id,
        });

      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: myId,
        ChannelId: channelReturned.id,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    // typeorm 쿼리 빌더 => typeorm이 sql과 비슷하게 sql 쿼리처럼 만들어 놓은 것
    this.usersRepository
      .createQueryBuilder('user') // 엔티티의 별명으로 사용
      .innerJoin('user.WorkspaceMembers', 'members') // parameter1 => user엔티티의 WorkspaceMembers / parameter2 => 별명
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url: url,
      })
      .getMany();
    /*
      getRawMany()와 getMany()의 차이점
      getRawMany()
      {
        id: '',
        email: '',
        'Workspace.name': ''
      }
      이처럼 join된 column을 문자열로 인식

      getMany()
      {
        id: '',
        email: '',
        Workspace: {
          name: ''
        }
      }
      // join된 column을 객체로 인식
      */
  }

  async createWorkspaceMembers(url, email) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    // const workspace = await this.workspacesRepository.findOne({
    //   where: { url },
    //   // relations: ['Channels'] 이렇게도 쓸 수 있음
    //   join: {
    //     alias: 'workspace',
    //     innerJoinAndSelect: {
    //       channels: 'workspace.Channels',
    //     },
    //   },
    // });
    const workspace = await queryRunner.manager
      .getRepository(Workspaces)
      .findOne({
        where: { url },
        join: {
          alias: 'workspace',
          innerJoinAndSelect: {
            channels: 'workspace.Channels',
          },
        },
      });
    // query빌더로는 이렇게 쓸 수 있음
    // this.workspacesRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'channels').getOne()

    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });

    if (!user) {
      return null;
    }

    try {
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        WorkspaceId: workspace.id,
        UserID: user.id,
      });

      await queryRunner.manager.getRepository(ChannelMembers).save({
        ChannelId: workspace.Channels.find((v) => v.name === '일반').id,
        UserId: user.id,
      });

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspace', 'workspaces', 'workspace.url = :url', {
        url,
      })
      .getOne();
  }
}
