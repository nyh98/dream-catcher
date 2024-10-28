import { ApiResponseOptions } from '@nestjs/swagger';

export const PROVIDER_GROUP = { kakao: 'kakao', google: 'google' };

export const SWAGGER_SUCCESS_RESPONSE_EXAMPLE: {
  [key: string]: ApiResponseOptions;
} = {
  signUp: {
    status: 201,
    example: {
      name: '나용환1',
      profileImg:
        'https://cdn.pixabay.com/photo/2024/05/29/16/49/lizard-8796682_640.jpg',
      provider: 'kakao',
      uid: '12345',
      email: null,
      id: 2,
    },
  },

  getDiary: {
    status: 200,
    example: {
      id: 10,
      title: '제목',
      contents: [
        {
          section: '섹션1',
          detail: '내용1',
        },
        {
          section: '섹션2',
          detail: '내용2',
        },
      ],
      image: 'http://image.com | null',
      interpretation: ' 해몽 내용| null',
      createdAt: '2024-10-26T22:54:12.218Z',
      tags: [
        {
          id: 2,
          tag: '루시드 드림',
        },
      ],
    },
  },

  getDiaries: {
    status: 200,
    example: {
      diaries: [
        {
          id: 10,
          title: '제목',
          contents: [
            {
              section: '섹션1',
              detail: 'ㅁㄴㅇ',
            },
            {
              section: '섹션1',
              detail: '섹션1',
            },
          ],
          image: 'http://image.com | null',
          interpretation: ' 해몽 내용| null',
          createdAt: '2024-10-26T22:54:12.218Z',
          tags: [
            {
              id: 2,
              tag: '루시드 드림',
            },
          ],
        },
      ],
    },
  },

  updateDiary: {
    status: 200,
    example: {
      id: 14,
      title: '변경된 제목123',
      contents: [
        {
          section: '변경된 섹션1',
          detail: '변경된 내용',
        },
      ],
      image: 'http://image.com | null',
      interpretation: ' 해몽 내용| null',
      createdAt: '2024-10-27T19:46:59.769Z',
      tags: [
        {
          id: 1,
          tag: '악몽',
        },
      ],
    },
  },

  getTags: {
    status: 200,
    example: {
      tags: [
        {
          id: 1,
          tag: '악몽',
        },
        {
          id: 2,
          tag: '루시드 드림',
        },
        {
          id: 3,
          tag: '예지몽',
        },
        {
          id: 4,
          tag: '반복되는 꿈',
        },
        {
          id: 5,
          tag: '좋은 꿈',
        },
      ],
    },
  },
};

export const SWAGGER_ERROR_RESPONSE_EXAMPLE: {
  [key: string]: ApiResponseOptions;
} = {
  bad: {
    status: 400,
    example: {
      message: "['에러 메세지'] | '에러메세지'",
      error: 'Bad Request',
      statusCode: 400,
    },
  },
};
