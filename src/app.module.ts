import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

// .env 파일을 외부(클라우드 or 외부 저장소 ,,,,,)에서 받아오는 경우
// const getEnv = async () => {
//   const response = await axios.get('/env요청')
//   return response.data
// }

// 위 경우에는 ConfigModule.forRoot에 option으로 load: [getEnv]와 같이 추가해줘야 함
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  // provider의 원형
  // -> providers: [
  //   {
  //     provide: AppService,
  //     useClass: AppService
  //   }
  // ]
})

//implement -> 사용시 아래 코드를 반드시 구현해야하는 강제성이 생김 / 없어도 오류는 나지 않지만, 만약 오타를 작성했을 때 implements를 사용하지 않는다면 에러를 확인하기 어렵지만 implements를 사용하여 강제성이 생김으로써 좀 더 에러를 찾는데 수월함 ( 타입 검사도 용이 )
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
