import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Decorator만 붙여 놓으면 나머지는 Nest에서 알아서 다 해줌 -> IOC(Inversion Of Control) : 제어의 역전
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// Nest는 module을 직접 구성해야 한다는 점에서 스프링보다 IOC가 약하다.
