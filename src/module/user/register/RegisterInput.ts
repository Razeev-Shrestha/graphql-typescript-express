import { IsEmail, Length } from 'class-validator'
import { PasswordInput } from '../../../shared/passwordInput'
import { Field, InputType } from 'type-graphql'
import { IsEmailAlreadyExist } from './isEmailAlreadExist'

@InputType()
export class RegisterInput extends PasswordInput {
	@Field()
	@Length(1, 255)
	// @Length(1, 255, { message: 'you can add custom message here' })
	firstName: string

	@Field()
	@Length(1, 255)
	lastName: string

	@Field()
	@IsEmail()
	@IsEmailAlreadyExist({ message: 'Email Already in Use' })
	email: string
}
