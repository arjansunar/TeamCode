import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  id: string;
  username: string;
  profileUrl: string;
  email: string;
  photo: string;
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: '55121485',
      username: 'arjansunar',
      profileUrl: 'https://github.com/arjansunar',
      email: 'arjan.gahatrajsunar@gmail.com',
      photo: 'https://avatars.githubusercontent.com/u/55121485?v=4',
    },
  ];

  async findOne(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }
}
