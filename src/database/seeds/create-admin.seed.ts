/* eslint-disable import/no-extraneous-dependencies */
import { Seeder } from 'typeorm-seeding';
import bcrypt from 'bcryptjs';
import { getRepository } from 'typeorm';
import { User } from 'src/users/users.entity';
import constants from 'src/database/constants';

export default class CreateAdmin implements Seeder {
  public async run(): Promise<any> {
    const userRepository = getRepository(User);
    const foundAdmin = await userRepository.findOne({
      where: {
        email: constants.users[0].email,
      },
    });

    const {
      firstName,
      lastName,
      email,
      password: rawPassword,
    } = constants.users[0];

    if (!foundAdmin) {
      // Create the Admin user and save to database
      const admin = new User();
      admin.firstName = firstName;
      admin.lastName = lastName;
      admin.email = email as string;
      admin.password = await bcrypt.hash(rawPassword as string, 12);
      await admin.save();
    }
  }
}
