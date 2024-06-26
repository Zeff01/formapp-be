import { Router } from 'express';
import Controller from './users.controller';
import {
  CreateUserDto,
  DeleteUserDto,
  CreateFounderDto,
  CreateClubDto,
  UpdateUserDto,
  LoginDto,
} from '@/dto/user.dto';
import RequestValidator from '@/middlewares/request-validator';
import { verifyAdmintAuthToken, verifyAuthToken } from '@/middlewares/auth';

const users: Router = Router();
const controller = new Controller();

/**
 * Create User Body
 * @typedef {object} CreateUserBody
 * @property {string} email.required - email of user
 * @property {string} password.required - password of user
 * @property {string} firstname.required - firstname of user
 * @property {string} lastname.required - lastname of user
 * @property {string} phone.required - phone number
 * @property {string} dateofbirth.required - birth date
 * @property {string} address.required - address of user
 * @property {'MALE' | 'FEMALE'} gender.required - gender of user
 * @property {string} profilePic.required - Profile Pic URL
 */

/**
 * Create User
 * @typedef {object} CreateUser
 * @property {string} email - email of user
 * @property {string} password - password of user
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} phone - phone number
 * @property {string} dateofbirth - birth date
 * @property {string} address - address of user
 * @property {'MALE' | 'FEMALE'} gender - gender of user
 * @property {string} profilePic - Profile Pic URL
 */

/**
 * POST /users
 * @summary Create user
 * @tags users
 * @param {CreateUserBody} request.body.required
 * @return {CreateUser} 201 - User Successfully Created
 */

users.post('', RequestValidator.validate(CreateUserDto), controller.createUser);

/**
 * POST /users/staff
 * @summary Create Staff
 * @tags users
 * @param {CreateUserBody} request.body.required
 * @return {CreateUser} 201 - Staff Successfully Created
 */

users.post(
  '/staff',
  RequestValidator.validate(CreateUserDto),
  controller.createStaff
);

/**
 * Create Founder Body
 * @typedef {object} CreateFounderBody
 * @property {string} firstName.required - Founder FirstName
 * @property {string} lastName.required - Founder LastName
 * @property {string} phone.required - Phone Number
 * @property {string} email.required - Founder Email
 * @property {string} password.required - Founder Password
 */

/**
 * Create Founder
 * @typedef {object} CreateFounder
 * @property {string} firstName - Founder FirstName
 * @property {string} lastName - Founder LastName
 * @property {string} phone - Phone Number
 * @property {string} email - Founder Email
 * @property {string} password - Founder Password
 */

/**
 * POST /users/Founder
 * @summary Create Founder
 * @tags users
 * @param {CreateFounderBody} request.body.required
 * @return {CreateFounder} 201 - Founder Successfully Created
 */

users.post(
  '/founder',
  RequestValidator.validate(CreateFounderDto),
  controller.createFounder
);

/**
 * Update User Body
 * @typedef {object} UpdateUserBody
 * @property {string} id.required - User ID
 * @property {string} firstname.required - firstname of user
 * @property {string} lastname.required - lastname of user
 * @property {string} phone.required - phone number
 * @property {string} dateofbirth.required - birth date
 * @property {string} address.required - address of user
 * @property {'MALE' | 'FEMALE'} gender.required - gender of user
 * @property {string} profilePic.required - Profile Pic URL
 */

/**
 * Update User
 * @typedef {object} UpdateUser
 * @property {string} id.required
 * @property {string} firstname - firstname of user
 * @property {string} lastname - lastname of user
 * @property {string} phone - phone number
 * @property {string} dateofbirth - birth date
 * @property {string} address - address of user
 * @property {'MALE' | 'FEMALE'} gender - gender of user
 * @property {string} profilePic - Profile Pic URL
 */

/**
 * PATCH /users/
 * @summary Update User
 * @tags users
 * @param {UpdateUserBody} request.body.required
 * @security BearerAuth
 * @return {UpdateUser} 200 - User Successfully Updated.
 */

users.patch(
  '/',
  verifyAdmintAuthToken,
  RequestValidator.validate(UpdateUserDto),
  controller.updateUser
);

/**
 * Login Founder Body
 * @typedef {object} LoginFounderBody
 * @property {string} email.required - Email address
 * @property {string} password.required - Password
 */

/**
 * Login Founder
 * @typedef {object} LoginFounder
 * @property {string} email - Email address
 * @property {string} password - Password
 */

/**
 * POST /users/founder/login
 * @summary Founder Login
 * @tags users
 * @param {LoginFounderBody} request.body.required
 * @return {LoginFounder} 200 - User Successfully Login
 */

users.post(
  '/founder/login',
  RequestValidator.validate(LoginDto),
  controller.founderLogin
);

/**
 * Login Staff Body
 * @typedef {object} LoginStaffBody
 * @property {string} email.required - Email address
 * @property {string} password.required - Password
 */

/**
 * Login Staff
 * @typedef {object} LoginStaff
 * @property {string} email - Email address
 * @property {string} password - Password
 */

/**
 * POST /users/staff/login
 * @summary Staff Login
 * @tags users
 * @param {LoginStaffBody} request.body.required
 * @return {LoginStaff} 200 - Staff Successfully Login
 */

users.post(
  '/staff/login',
  RequestValidator.validate(LoginDto),
  controller.staffLogin
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
  verifyAdmintAuthToken,
  RequestValidator.validate(DeleteUserDto),
  controller.deleteUser
);

/**
 * Create Club Body
 * @typedef {object} CreateClubBody
 * @property {string} name.required - Club Name
 */

/**
 * Create Club
 * @typedef {object} CreateClub
 * @property {string} name - Club Name
 */

/**
 * POST /users/club
 * @summary Create Club
 * @tags users
 * @param {CreateClubBody} request.body
 * @security BearerAuth
 * @return {CreateClub} 201 - Club Created
 */

users.post(
  '/club',
  verifyAdmintAuthToken,
  RequestValidator.validate(CreateClubDto),
  controller.createClub
);

/**
 * GET /users/club
 * @summary Get Club
 * @tags users
 * @param {string} clubName.query - Name of Club
 * @param {string} clubId.query - Id of Club
 */

users.get('/club', controller.getClub);

/** Return Packages
 * @typedef {object} PackageClub
 * @property {string} packageName.required - Name of Package
 * @property {string[]} features - features of Package
 * @property {number} MonthlyRate - Monthly Rate of Package
 */

//TODO: ARRANGE USER / CLUB

//TODO: Document getSubscription

users.get('/subscription', controller.getSubscriptionRate);

/**
 * PATCH /users/join
 * @summary Join a Lobby
 * @tags users
 * @security BearerAuth
 * @param {string} id.query.required - ID of the lobby to join
 * @return {string} 201 - Join Lobby Updated
 */

users.patch('/join', verifyAuthToken, controller.joinGame);

users.patch('/team/join', verifyAuthToken, controller.joinTeamPerSubSession);

users.get('/player', verifyAuthToken, controller.getPlayerById);

users.get('/player/find', verifyAdmintAuthToken, controller.getPlayerByName);

users.post(
  '/portal/customer',
  verifyAuthToken,
  controller.createCustomerXendit
);
users.post('/portal/plan', verifyAuthToken, controller.createRecurringPlan);
export default users;
