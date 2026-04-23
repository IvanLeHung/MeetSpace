import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DecideBookingDto } from './dto/decide-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  listBookings(
    @Query('date') date?: string,
    @Query('month') month?: string
  ) {
    return this.bookingsService.list({ date, month });
  }

  @Post()
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Patch(':id/decision')
  decideBooking(@Param('id') id: string, @Body() dto: DecideBookingDto) {
    return this.bookingsService.decide(id, dto);
  }
}
