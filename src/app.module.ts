import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';

// .env 파일을 외부(클라우드 or 외부 저장소 ,,,,,)에서 받아오는 경우
// const getEnv = async () => {
//   const response = await axios.get('/env요청')
//   return response.data
// }

// 위 경우에는 ConfigModule.forRoot에 option으로 load: [getEnv]와 같이 추가해줘야 함
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
