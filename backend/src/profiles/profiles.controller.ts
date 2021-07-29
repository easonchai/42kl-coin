import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CreateProfileBody } from './profiles.interface';
import { ProfileService } from './profiles.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':address')
  getProfile(@Param('address') address: string): string {
    return this.profileService.getProfile(address);
  }

  @Post()
  createProfile(@Body() body: CreateProfileBody) {
    return this.profileService.createProfile(body);
  }
}
