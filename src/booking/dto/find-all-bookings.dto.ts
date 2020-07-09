import { IsString } from 'class-validator';
import { Booking } from 'src/shared/types/booking.type';

export class FindAllBookings {
  @IsString()
  readonly type!: Booking;
}
