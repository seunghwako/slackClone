/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from '../entities/Users';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async join(email: string, nickname: string, password: string) {
    // 트랜잭션을 위한 queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();
    // const user = await this.usersRepository.findOne({ where: { email } }); 이렇게 하게 되면 transaction connection이 아니라서 queryRunner.connect()의 transaction에 안걸림
    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });

    if (user) {
      // 이미 존재하는 유저
      throw new UnauthorizedException('이미 존재하는 유저입니다');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: returned.id,
        WorkspaceId: 1,
      });
      /*
      다른방법 1)
      const workspaceMember = new WorkspaceMembers(); ===  const workspaceMember = this.workspaceMembersRepository.create()
      workspaceMember.UserId = returned.id
      workspaceMember.WorkspaceId = 1;
      await this.workspaceMembersRepository.save(workspaceMember)
      */
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });
      await queryRunner.commitTransaction(); // 성공후 transaction commit
      return true;
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction(); // 실패하면 rollback -> startTransaction 상태로 돌아감
      throw error;
    } finally {
      await queryRunner.release(); // 연결을 끊어줌
    }
  }
}
