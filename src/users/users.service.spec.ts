import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelMembers } from '../entities/ChannelMembers';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { Users } from '../entities/Users';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';

class MockUserRepository {
  #data = [{ id: 1, email: 'test@test.com' }];
  findOne({ where: { email } }) {
    const data = this.#data.find((v) => v.email === email);
    if (data) {
      return data;
    }
    return null;
  }
}
class MockWorkspaceMembersRepository {}
class MockChannelMembersRepository {}
class MockDataSource {}

describe('UsersService', () => {
  let service: UsersService;

  // beforeEach는 각각의 it 전에 실행된다. service를 새로 할당
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        /*
        원래 UsersService도 
        {
          provide: UsersService,
          useClass: UsersService,
        }
        처럼 쓰이지만, 실제 값과 실제 객체가 일치하므로 축약 가능하다.
        */
        UsersService,
        {
          // 가짜 DB를 사용하기 위한 Mocking
          provide: getRepositoryToken(Users),
          useClass: MockUserRepository,
        },
        {
          // 가짜 DB를 사용하기 위한 Mocking
          provide: getRepositoryToken(WorkspaceMembers),
          useClass: MockWorkspaceMembersRepository, // 함수 mocking => useFactory, 값 mocking => useValue
        },
        {
          // 가짜 DB를 사용하기 위한 Mocking
          provide: getRepositoryToken(ChannelMembers),
          useClass: MockChannelMembersRepository,
        },
        {
          provide: DataSource,
          useClass: MockDataSource,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail은 이메일을 통해 유저를 찾아야 함', () => {
    expect(service.findByEmail('test@test.com')).resolves.toStrictEqual({
      email: 'test@test.com',
      id: 1,
    });
  });

  it('findByEmail은 유저를 못 찾으면 null을 반환해야 함', () => {
    expect(service.findByEmail('test@tes.com')).resolves.toBe(null);
  });
});
