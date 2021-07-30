import { Module } from '@nestjs/common';
import { ProfileController } from './profiles.controller';
import { ProfileService } from './profiles.service';

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfilesModule {}
