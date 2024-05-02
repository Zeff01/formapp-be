import { Gender, UserTypeEnum } from '@prisma/client';

export const mockedUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    profilePic: 'example.jpg',
    address: '123 Main St',
    email: 'john@example.com',
    password: 'password123',
    phone: '123-456-7890',
    link: 'example.com/john',
    age: 30,
    dateofbirth: new Date('1990-03-01T15:18:21.610Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    gender: Gender.MALE,
    type: UserTypeEnum.USER,
    joinedLobbyId: 'lobby1',
    teamId: ['team1'],
    // Add other properties as needed
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Doe',
    profilePic: 'example.jpg',
    address: '456 Elm St',
    email: 'jane@example.com',
    password: 'password456',
    phone: '987-654-3210',
    link: 'example.com/jane',
    age: 28,
    dateofbirth: new Date('1990-03-01T15:18:21.610Z'),
    createdAt: new Date(),
    updatedAt: new Date(),
    gender: Gender.FEMALE,
    type: UserTypeEnum.USER,
    joinedLobbyId: 'lobby2',
    teamId: ['team2'],
    // Add other properties as needed
  },
];
