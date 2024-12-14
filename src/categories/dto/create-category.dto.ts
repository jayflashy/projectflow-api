import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Bug Fix' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Tasks related to fixing software defects.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
