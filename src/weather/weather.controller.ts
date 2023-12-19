import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { WeatherService } from './weather.service';

@ApiTags('Weather')
@Controller('weather')
export class WeatherController {
  constructor(private service: WeatherService) {}

  @Get()
  getWeather() {
    return this.service.getWeather();
  }
}
