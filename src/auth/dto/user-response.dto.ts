import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @ApiProperty({ example: 'clx123abc', description: 'User ID' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @Expose()
  name: string | null;

  @ApiProperty({ example: 'USER', description: 'User role' })
  @Expose()
  role: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  @Expose()
  updatedAt: Date;
}
