import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Q1 Marketing Campaign' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A project to launch the new marketing campaign for Q1.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
