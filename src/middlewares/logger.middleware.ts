import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // HTTP(context)의 역할 -> HTTP 관련된 요청에서만 logger가 실행 됨 , express의 debug 라이브러리와 같은 역할

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || ''; // header에서 가져옴

    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}

// middleware 자체는 router 즉, controller보다 먼저 실행됨
// 실행순서
// line 9-10 -> request에 대한 기록을 하고 나서
// line 21 -> router로 이동
// line 13-19 -> router가 finish된 후 실행
