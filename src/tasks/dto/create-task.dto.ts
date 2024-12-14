import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement user authentication' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Set up JWT authentication with refresh tokens.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ example: 'user-uuid-string' })
  @IsUUID()
  assignedToId: string;

  @ApiProperty({ example: 'project-uuid-string' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: 'category-uuid-string' })
  @IsUUID()
  categoryId: string;
}
