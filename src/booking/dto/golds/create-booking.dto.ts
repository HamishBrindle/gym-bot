import { IsString, IsArray } from 'class-validator';
import { ICreateBooking } from 'src/booking/interfaces/create-booking.interface';
import { QueueOptionsDto } from '../queue-options.dto';

export class GoldsCreateBookingDto extends QueueOptionsDto implements ICreateBooking {
  @IsString()
  readonly time!: string;

  @IsArray()
  readonly days!: (string|number)[];

  @IsString()
  readonly username!: string;

  @IsString()
  readonly password!: string;
}
