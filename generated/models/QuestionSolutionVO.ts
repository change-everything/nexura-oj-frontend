/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { QuestionVO } from "./QuestionVO";
import type { UserVO } from "./UserVO";

export type QuestionSolutionVO = {
  questionId?: number;
  questionVO?: QuestionVO;
  userVO?: UserVO;
  userId?: number;
  solution?: string;
  createTime?: string;
};
