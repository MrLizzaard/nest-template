import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class WeatherService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  getWeather() {
    return '이거보세요오오오오오오';
  }
}
