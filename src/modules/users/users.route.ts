import { Router } from 'express';
import Controller from './users.controller';
import {
  CreateUserDto,
  DeleteUserDto,
  ICreateMemberDto,
  LoginFounderDto,
  UpdateUserDto,
} from '@/dto/user.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAuthToken } from '@/middlewares/auth';

const users: Router = Router();
const controller = new Controller();

/**
 * User
 * @typedef {object} User
 * @property {string} email - email of user
 * @property {string} password - password of user
 * @property {string} firstName - firstname of user
 * @property {string} lastName - lastname of user
 * @property {string} profilePic - Profile Pic URL
 * @property {string} phone - Phone Number
 * @property {string} type - User Type | ADMIN, FOUNDER,USER
 */

/**
 * POST /
 * @typedef {object} CreateUserDto
 * @summary Create user
 * @tags users
 * @property {string} email.required - User Email
 * @property {string} password.required - User Password
 * @property {string} firstName.required - User Firstname
 * @property {string} lastName.required - User LastName
 * @property {string} profilePic - Profile pic URL
 * @property {string} phone - Phone Number
 * @param {CreateUserDto} request.body.required
 * @return {User} 201 - User Created
 */
users
  .route('')
  .post(RequestValidator.validate(CreateUserDto), controller.createUser)
  .get(verifyAuthToken, controller.getFounderInfo);
/**
 * PATCH /
 * @typedef {object} UpdateUserDto
 * @summary Update User
 * @tags users
 * @property {string} firstName - Firstname of user
 * @property {string} lastName - Lastname of user
 * @property {string} phone - Mobile phone of user
 * @param {UpdateUserDto} request.body
 * @security BearerAuth
 * @return {User} 201 - User Updated
 */
users.patch(
  '/',
  verifyAuthToken,
  RequestValidator.validate(UpdateUserDto),
  controller.updateUser
);

/**
 * POST /login
 * @typedef {object} LoginFounderDto
 * @summary Login
 * @tags users
 * @property {string} email.required - The email address
 * @property {string} password.required - The password
 * @param {LoginFounderDto} request.body.required
 * @return {User} 201
 */
users.post(
  '/login',
  RequestValidator.validate(LoginFounderDto),
  controller.login
);
/**
 * POST /member
 * @typedef {object} ICreateMemberDto
 * @summary Create Member
 * @tags users
 * @property {string} email.required - The email address
 * @property {string} firstName.required - The Firstname
 * @property {string} lastName.required - The Lastname
 * @property {string} profilePic - The Profile Picture
 * @param {ICreateMemberDto} request.body.required
 * @return {User} 201 - Member Successfully Created
 */
users
  .route('/member')
  .post(RequestValidator.validate(ICreateMemberDto), controller.createMember)
  .get(controller.getMemberInfo);
/**
 * DELETE /
 * @typedef {object} DeleteUserDto
 * @summary Delete User
 * @tags users
 * @security BearerAuth
 * @property {string} email.required - Email of user
 * @param {DeleteUserDto} request.body.required
 * @return {User} 200 - User Deleted Successfully
 */
users.delete(
  '/',
  verifyAuthToken,
  RequestValidator.validate(DeleteUserDto),
  controller.deleteUser
);

export default users;
