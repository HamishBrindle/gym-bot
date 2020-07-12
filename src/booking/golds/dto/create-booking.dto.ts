import { IsString, IsArray } from 'class-validator';
import { ICreateBooking, SupportedOffsetUnits } from 'src/booking/interfaces/create-booking.interface';
import { QueueOptionsDto } from '../../dto/queue-options.dto';

export class GoldsCreateBookingDto extends QueueOptionsDto implements ICreateBooking {
  /**
   * 24hr Time string (HH:MM)
   */
  @IsString()
  readonly time!: string;

  /**
   * Array of days of the week (Sun = 0, Mon = 1, etc.)
   */
  @IsArray()
  readonly days!: (string|number)[];

  /**
   * Golds Login username
   */
  @IsString()
  readonly username!: string;

  /**
   * Golds Login password
   */
  @IsString()
  readonly password!: string;

  /**
   * Offset - plus or minus a unit of time (ex. ['hours', -72])
   */
  offset: [SupportedOffsetUnits, number] = ['hours', -72];
}
