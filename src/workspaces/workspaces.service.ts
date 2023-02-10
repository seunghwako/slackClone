import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

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
    // transaction 적용해야 함
    const workspace = new Workspaces();
    workspace.name = name;
    workspace.url = url;
    workspace.OwnerId = myId;
    const returned = await this.workspacesRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    const channelReturned = await this.channelsRepository.save(channel);

    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
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
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // relations: ['Channels'] 이렇게도 쓸 수 있음
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    // query빌더로는 이렇게 쓸 수 있음
    // this.workspacesRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'channels').getOne()

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    //트랜잭션 적용해야 함
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);

    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
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
