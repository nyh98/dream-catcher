import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { SignUpDto } from './dto/sign-up';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, first, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { DecodedKakaoToken, KakaoAuthResponse } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  //임시 회원가입
  createUser(dto: SignUpDto) {
    const newUser = this.userRepository.create({ ...dto });
    return this.userRepository.save(newUser);
  }

  async createKakaoUser(userData: DecodedKakaoToken) {
    const { id, properties } = userData;
    const { nickname, profile_image } = properties;

    const newUser = this.userRepository.create({
      uid: id.toString(),
      name: nickname,
      profileImg: profile_image,
      provider: 'kakao',
    });

    return this.userRepository.save(newUser);
  }

  getKakaoUser(uid: number) {
    return this.userRepository.findOne({
      where: { uid: uid.toString(), provider: 'kakao' },
    });
  }

  //임시 인증 함수
  validKakaoToken(token: number) {
    //임시로 id값만 받음
    //나중에 토큰 검증 로직 구현할것
    return this.userRepository.findOne({ where: { id: token } });
  }

  async getKakaoToken(authCode: string) {
    const body = {
      grant_type: 'authorization_code',
      client_id: this.configService.get<string>('KAKAO_REST_API_KEY'),
      redirect_uri: this.configService.get<string>('REDIRECT_URI'),
      code: authCode,
    };

    const result = await firstValueFrom(
      this.httpService
        .post<KakaoAuthResponse>('https://kauth.kakao.com/oauth/token', body, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            const message = err.message;
            const status = err.status || 400;
            console.log(err.response?.data);
            throw new HttpException(message, status);
          }),
        ),
    );

    return result.data;
  }

  async decodeKakaoToken(accessToken: string) {
    const response = await firstValueFrom(
      this.httpService
        .get<DecodedKakaoToken>('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${accessToken}}` },
        })
        .pipe(
          catchError((err: AxiosError) => {
            const message = err.message;
            const status = err.status || 400;
            console.log(err.response?.data);
            throw new HttpException(message, status);
          }),
        ),
    );

    return response.data;
  }
}
