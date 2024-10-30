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
      id: 36,
      title: '잠온다..',
      contents: {
        sections: [
          {
            section: '등장인물',
            detail: 'qwe',
          },
        ],
        freeContent: null,
      },
      image: null,
      interpretation: null,
      createdAt: '2024-10-28T22:57:00.639Z',
      templateType: 'beginner',
      tags: [
        {
          id: 3,
          name: '예지몽',
        },
      ],
    },
  },

  createDiary: {
    status: 201,
    example: {
      title: '배고프다..',
      contents: {
        sections: null,
        freeContent: '나는 윤석열이 되었다',
      },
      templateType: 'beginner',
      user: {
        id: 2,
        name: '나용환1',
        email: null,
        profileImg:
          'https://cdn.pixabay.com/photo/2024/05/29/16/49/lizard-8796682_640.jpg',
        provider: 'kakao',
        uid: '1234',
        templateType: '',
      },
      tags: [],
      image: null,
      interpretation: null,
      id: 43,
      createdAt: '2024-10-29T20:20:23.659Z',
    },
  },

  getDiaries: {
    status: 200,
    example: {
      diaries: [
        {
          id: 10,
          title: '제목',
          contents: {
            sections: [
              {
                section: '등장인물',
                detail: 'qwe',
              },
            ],
            freeContent: null,
          },
          image: null,
          interpretation: null,
          createdAt: '2024-10-26T22:54:12.218Z',
          templateType: 'beginner',
          tags: [
            {
              id: 2,
              name: '루시드 드림',
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
      contents: {
        sections: [
          {
            section: '변경된 섹션',
            detail: '변경된 내용',
          },
        ],
        freeContent: null,
      },
      image: 'http://image.com | null',
      interpretation: ' 해몽 내용| null',
      createdAt: '2024-10-27T19:46:59.769Z',
      tags: [
        {
          id: 1,
          name: '악몽',
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
          name: '악몽',
        },
        {
          id: 2,
          name: '루시드 드림',
        },
        {
          id: 3,
          name: '예지몽',
        },
        {
          id: 4,
          name: '반복되는 꿈',
        },
        {
          id: 5,
          name: '좋은 꿈',
        },
      ],
    },
  },

  getSections: { status: 200, example: { sections: ['핵심사건', '태그'] } },
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
