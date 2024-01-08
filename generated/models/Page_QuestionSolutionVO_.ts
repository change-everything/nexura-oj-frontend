/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OrderItem } from "./OrderItem";
import { QuestionSolutionVO } from "./QuestionSolutionVO";

export type Page_QuestionSolutionVO_ = {
  countId?: string;
  current?: number;
  maxLimit?: number;
  optimizeCountSql?: boolean;
  orders?: Array<OrderItem>;
  pages?: number;
  records?: Array<QuestionSolutionVO>;
  searchCount?: boolean;
  size?: number;
  total?: number;
};
