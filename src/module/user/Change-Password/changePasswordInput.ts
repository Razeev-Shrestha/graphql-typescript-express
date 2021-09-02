import { PasswordInput } from '../../../shared/passwordInput'
import { Field, InputType } from 'type-graphql'

@InputType()
export class ChangePasswordInput extends PasswordInput {
	@Field()
	token: string
}
