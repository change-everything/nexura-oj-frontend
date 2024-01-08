/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_long_ } from "../models/BaseResponse_long_";
import type { BaseResponse_Page_QuestionSubmitVO_ } from "../models/BaseResponse_Page_QuestionSubmitVO_";
import type { QuestionSubmitAddRequest } from "../models/QuestionSubmitAddRequest";
import type { QuestionSubmitQueryRequest } from "../models/QuestionSubmitQueryRequest";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
import { QuestionSolutionAddRequest } from "../models/QuestionSolutionAddRequest";
import { BaseResponse_Page_QuestionSolutionVO_ } from "../models/BaseResponse_Page_QuestionSolutionVO_";
import { QuestionSolutionQueryRequest } from "../models/QuestionSolutionQueryRequest";

export class QuestionSolutionControllerService {
  public static doQuestionSolutionAddUsingPost(
    questionSolutionAddRequest: QuestionSolutionAddRequest
  ): CancelablePromise<BaseResponse_long_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/question/solution/add",
      body: questionSolutionAddRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }

  public static listQuestionSolutionByPageUsingPost(
    questionSolutionQueryRequest: QuestionSolutionQueryRequest
  ): CancelablePromise<BaseResponse_Page_QuestionSolutionVO_ | any> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/question/solution/list/page",
      body: questionSolutionQueryRequest,
      errors: {
        401: `Unauthorized`,
        403: `Forbidden`,
        404: `Not Found`,
      },
    });
  }
}
