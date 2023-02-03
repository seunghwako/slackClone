import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

// service의 역할 -> 비즈니스 로직의 분리
// 요청, 응답 없이 순수하게 비즈니스 로직만 작성
// 테스트 할 때 편리
// 재사용성 높아짐
// Injectable -> DI(Dependency Injection): 의존성 주입
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string {
    return this.configService.get('PORT');
  }
}
