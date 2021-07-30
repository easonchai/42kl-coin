import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { CreateProfileBody } from './profiles.interface';
const filename = path.resolve(__dirname + '../../../../profiles.json');

@Injectable()
export class ProfileService {
  getProfile(address: string): string {
    try {
      const rawData = fs.readFileSync(filename).toString();
      const jsonData = JSON.parse(rawData);
      const profileId = jsonData[address];
      return profileId;
    } catch (error) {
      console.log("File doesn't exist. Creating file...");
      fs.writeFile(filename, '{}', { flag: 'w' }, (err) => {
        if (err) {
          console.log('Error creating file!', err);
          throw new HttpException(
            {
              status: 500,
              error: 'Error creating file',
            },
            500,
          );
        }
      });
      return null;
    }
  }

  createProfile(body: CreateProfileBody) {
    const { address, login } = body;

    try {
      const rawData = fs.readFileSync(filename).toString();
      const jsonData = JSON.parse(rawData);
      jsonData[address] = login;
      fs.writeFile(filename, JSON.stringify(jsonData), { flag: 'w' }, (err) => {
        if (err) {
          console.log('Error writing to file!');
          throw new HttpException(
            {
              status: 500,
              error: 'Error writing to file',
            },
            500,
          );
        }
      });
    } catch (error) {
      console.log("File doesn't exist. Creating file...");
      const jsonData = {
        address,
        login,
      };
      fs.writeFile(filename, JSON.stringify(jsonData), { flag: 'w' }, (err) => {
        if (err) {
          console.log('Error creating file!', err);
          throw new HttpException(
            {
              status: 500,
              error: 'Error creating file',
            },
            500,
          );
        }
      });
    }
    console.log(`New profile created for ${login}!`);
    return;
  }
}
