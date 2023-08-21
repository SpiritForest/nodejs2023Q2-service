import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login-auth.dto';

export class SignUpDto extends PartialType(LoginDto) {}