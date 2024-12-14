import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Feature Request', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Tasks related to implementing new features.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
