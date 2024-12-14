import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'Q1 Marketing Campaign V2', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example:
      'An updated project to launch the new marketing campaign for Q1 2025.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
