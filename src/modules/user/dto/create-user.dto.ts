import { Match } from '@src/common/decorators/match.decorator';
import { Exclude } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidationArguments,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(15)
  @MinLength(3)
  name: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 0,
      minUppercase: 0,
    },
    {
      message: (args: ValidationArguments) => {
        const constraints = args.constraints[0] as Record<string, number>;
        const password = args.value as string;
        const missing: string[] = [];

        if (!password) {
          return `${args.property} is required`;
        }

        if (password.length < constraints.minLength) {
          missing.push(`minimum ${constraints.minLength} characters`);
        }

        const lowercaseCount = (password.match(/[a-z]/g) || []).length;
        if (lowercaseCount < constraints.minLowercase) {
          missing.push('lowercase letter');
        }

        const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
        if (uppercaseCount < constraints.minUppercase) {
          missing.push('uppercase letter');
        }

        const numbersCount = (password.match(/[0-9]/g) || []).length;
        if (numbersCount < constraints.minNumbers) {
          missing.push('number');
        }

        const symbolsCount = (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || [])
          .length;
        if (symbolsCount < constraints.minSymbols) {
          missing.push('special symbol');
        }

        return `${args.property} is too weak. You need to add: ${missing.join(', ')}`;
      },
    },
  )
  password: string;

  @Match('password', { message: 'Confirm password doesnt match' })
  passwordConfirm: string;

  @IsEmail()
  email: string;
}
