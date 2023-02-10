import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '슬랙트',
    description: '워크스페이스명',
  })
  public workspace: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sleact',
    description: 'url 주소',
  })
  public url: string;
}
