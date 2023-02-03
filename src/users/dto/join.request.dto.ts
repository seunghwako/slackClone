import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDTO {
  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: '파괴왕',
    description: '닉네임',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: 'mypassword',
    description: '패스워드',
    required: true,
  })
  public password: string;
}
