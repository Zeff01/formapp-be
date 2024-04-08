import { UserTypeEnum } from '@prisma/client';

export const UserData = {
  id: '81c9d08b-0cb8-4e1a-9be6-a9e6dab44a39',
  firstName: 'user',
  lastName: '1',
  email: 'user1@formapp.com',
  password: '$2b$10$Arbw8.6Cb22yW9bJvhZf2udRbUfJtc7CFEJdhmnIJsOyHPzuK234a',
  phone: '09584958674',
  profilePic: 'https://github.com/pic',
  link: null,
  age: null,
  address: 'Taguig',
  dateofbirth: null,
  gender: null,
  type: UserTypeEnum.USER,
  joinedLobbyId: 'e164119d-8c22-4cb8-9ad8-0336c82a1908',
  createdAt: null,
  updatedAt: null,
  teamId: [
    '78726528-5317-47ae-aaab-df76b8103c0e',
    'd45bf754-626d-4b95-af91-476df7e152bd',
  ],
};
