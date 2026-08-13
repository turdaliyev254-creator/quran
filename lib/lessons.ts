export interface LessonBlock {
  sarlavha: string;
  matn: string;
}

export interface LessonPair {
  arabcha: string;
  ozbekcha: string;
}

export interface LessonLetter {
  harf: string;
  nomi: string;
  talaffuz: string;
}

export interface Lesson {
  id: string;
  sarlavha: string;
  daraja: string;
  kirish: string;
  boblar?: LessonBlock[];
  jadval?: LessonPair[];
  harflar?: LessonLetter[];
}
