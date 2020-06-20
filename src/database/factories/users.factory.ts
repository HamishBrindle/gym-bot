/* eslint-disable import/no-extraneous-dependencies */
import { User } from 'src/users/users.entity';
import Faker from 'faker';
import { define } from 'typeorm-seeding';

// @ts-ignore
define(User, (faker: typeof Faker, settings: { roles: Role[], password: string }) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);

  const user = new User();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = settings?.password;
  return user;
});
