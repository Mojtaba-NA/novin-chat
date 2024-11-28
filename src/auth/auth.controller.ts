import { type SigninDto, signin_schema } from '@/lib/dto/auth.dto';
import { Validate } from '@/lib/pipe/validate.decorator';
import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  signin(@Validate('Body', signin_schema) body: SigninDto) {
    return this.authService.signin(body);
  }
}
