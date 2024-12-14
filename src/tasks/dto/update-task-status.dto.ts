import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'The new status of the task',
    enum: Status,
    example: Status.IN_PROGRESS,
  })
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
