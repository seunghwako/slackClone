import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDTO } from 'src/users/dto/join.request.dto';

export class UserDTO extends JoinRequestDTO {
  @ApiProperty({
    required: true,
    example: 1,
    description: '아이디',
  })
  id: number;
}
