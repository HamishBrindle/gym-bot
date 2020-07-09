import { IsString, IsArray, IsOptional } from 'class-validator';
import { IUpdateBooking } from 'src/booking/interfaces/update-booking.interface';
import { QueueOptionsDto } from '../queue-options.dto';

export class GoldsUpdateBookingDto extends QueueOptionsDto implements IUpdateBooking {
  @IsString()
  readonly jobId!: string;

  @IsString()
  @IsOptional()
  readonly time?: string;

  @IsArray()
  @IsOptional()
  readonly days?: (string|number)[];

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;
}
