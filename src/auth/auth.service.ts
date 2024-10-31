import { HttpException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/user.repository';
import { SignUpDto } from './dto/sign-up';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  DecodedKakaoToken,
  KakaoAuthResponse,
  RefreshKakaoTorkenRes,
  TokenData,
} from 'src/types/types';

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

  getKakaoUser(uid: string) {
    return this.userRepository.findOne({
      where: { uid, provider: 'kakao' },
    });
  }

  //임시 인증 함수
  getUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async validKakaoToken(accessToken: string) {
    const response = await firstValueFrom(
      this.httpService
        .get<TokenData>('https://kapi.kakao.com/v1/user/access_token_info', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .pipe(
          catchError((err: AxiosError) => {
            const message = err.message;
            const status = err.status || 400;

            throw new HttpException(message, status);
          }),
        ),
    );

    return response.data;
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
            console.error(err.response?.data);
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
            console.error(err.response?.data);
            throw new HttpException(message, status);
          }),
        ),
    );

    return response.data;
  }

  async refreshKakaoToken(refreshToken: string) {
    const body = {
      grant_type: 'refresh_token',
      client_id: this.configService.get<string>('KAKAO_REST_API_KEY'),
      refresh_token: refreshToken,
    };
    const response = await firstValueFrom(
      this.httpService
        .post<RefreshKakaoTorkenRes>(
          'https://kauth.kakao.com/oauth/token',
          body,
          {
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
          },
        )
        .pipe(
          catchError((err: AxiosError) => {
            const message = err.message;
            const status = err.status || 400;
            throw new HttpException(message, status);
          }),
        ),
    );

    return response.data;
  }
}
