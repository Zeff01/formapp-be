import { Router } from 'express';
import Controller from './users.controller';
import {
  CreateUserDto,
  DeleteUserDto,
  CreateFounderDto,
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
 * POST /users
 * @typedef {object} CreateUserDto
 * @summary Create Player
 * @tags users
 * @property {string} firstName.required - User Firstname
 * @property {string} lastName.required - User LastName
 * @property {string} phone.required - Phone Number
 * @property {string} dateofbirth.required - Date of Birth (1998-01-01 00:00:00Z)
 * @property {string} address.required - Date of Birth (1998-01-01 00:00:00Z)
 * @property {string} email.required - User Email
 * @property {string} gender.required -  Gender
 * @property {string} password.required - User Password
 * @property {string} profilePic - Profile pic URL
 * @param {CreateUserDto} request.body.required
 * @return {User} 201 - Player Successfully Created
 */
users
  .route('')
  .post(RequestValidator.validate(CreateUserDto), controller.createUser)
  .get(verifyAuthToken, controller.getFounderInfo);
/**
 * POST /users/staff
 * @typedef {object} CreateUserDto
 * @summary Create Staff
 * @tags users
 * @property {string} firstName.required - Staff Firstname
 * @property {string} lastName.required - Staff LastName
 * @property {string} phone.required - Phone Number
 * @property {string} dateofbirth.required - Date of Birth (1998-01-01 00:00:00Z)
 * @property {string} address.required - Date of Birth (1998-01-01 00:00:00Z)
 * @property {string} email.required - User Email
 * @property {string} gender.required -  Gender
 * @property {string} password.required - Staff Password
 * @property {string} profilePic - Profile pic URL
 * @param {CreateUserDto} request.body.required
 * @return {User} 201 - Staff Successfully Created
 */
users
  .route('/staff')
  .post(RequestValidator.validate(CreateUserDto), controller.createStaff)
  .get(controller.getMemberInfo);

/**
 * POST /users/Founder
 * @typedef {object} CreateFounderDto
 * @summary Create Founder
 * @tags users
 * @property {string} firstName.required - Founder FirstName
 * @property {string} lastName.required - Founder LastName
 * @property {string} phone.required - Phone Number
 * @property {string} email.required - Founder Email
 * @property {string} password.required - Founder Password
 * @param {CreateFounderDto} request.body.required
 * @return {User} 201 - Staff Successfully Created
 */
users
  .route('/founder')
  .post(RequestValidator.validate(CreateFounderDto), controller.createFounder)
  .get(controller.getFounderInfo);

/**
 * PATCH /users/
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
 * POST /users/login
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
 * DELETE /users/
 * @typedef {object} DeleteUserDto
 * @summary Delete User
 * @tags users
 * @security BearerAuth
 * @property {string} email.required - Email of user
 * @param {DeleteUserDto} request.body.required
 * @return {User} 200 - Account Deleted Successfully
 */
users.delete(
  '/',
  verifyAuthToken,
  RequestValidator.validate(DeleteUserDto),
  controller.deleteUser
);

users.patch('/join', verifyAuthToken, controller.joinGame);

users.patch('/team/join', verifyAuthToken, controller.joinTeamPerSubSession);
export default users;
