// 인터셉터 -> AOP -> 컨트롤러 실행 전후에 특정 로직을 넣어줄 수 있다
// 미들웨어는 인터셉터와 달리 실행 전 or 실행 후 에만 특정 로직을 넣어줄 수 있음

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 컨트롤러 실행 전
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data))); // data는 contoller에서 return 해주는 data , 만약 data === user 라면 { data: user } 가 되는 것임
  }
}
