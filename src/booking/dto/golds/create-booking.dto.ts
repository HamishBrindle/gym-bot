import { IsString, IsArray } from 'class-validator';
import { Booking } from 'src/shared/types/booking.type';
import { QueueOptionsDto } from '../queue-options.dto';

export class CreateBookingDto extends QueueOptionsDto {
  @IsString()
  readonly type!: Booking;

  @IsString()
  readonly time!: string;

  @IsString()
  @IsArray()
  readonly days?: (string|number)[];

  @IsString()
  readonly username!: string;

  @IsString()
  readonly password!: string;
}
