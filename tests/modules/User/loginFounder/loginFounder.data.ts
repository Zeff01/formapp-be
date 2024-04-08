import { UserTypeEnum } from "@prisma/client";

export const UserData = {
    id: '123456',
    email: 'email@example.com',
    password: 'password',
    type: UserTypeEnum.ADMIN
}