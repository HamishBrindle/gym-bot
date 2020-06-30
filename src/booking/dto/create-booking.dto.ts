import { IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  readonly date: string;

  @IsString()
  readonly time: string;
}
