import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorator/user.decorator';
import { UserDTO } from 'src/common/dto/user.dto';
import { JoinRequestDTO } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('api/users')
export class UsersController {
  constructor(private usersServive: UsersService) {}

  @ApiResponse({
    status: 200,
    description: '내 정보 조회 성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUsers(@Body() joinRequestDTO: JoinRequestDTO) {
    this.usersServive.postUsers(
      joinRequestDTO.email,
      joinRequestDTO.nickname,
      joinRequestDTO.password,
    );
  }

  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: UserDTO,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Req() req, @Res() res) {
    req.logout();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
