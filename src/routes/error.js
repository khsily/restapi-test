/**
 * idErr
 *
 * 인딜라이트 표준 에러 오브젝트를 생성합니다.
 * API의 마지막 라우터에서 처리합니다.
 *
 * @param {number} code 응답으로 보낼 http 상태 코드
 * @param {string} msg 응답으로 보낼 에러 메세지
 * @param {any} anyError 로그에 남길 에러 (아무거나) optional
 */
export const idErr = (code, msg, anyError) => {
  return { code, msg, anyError: anyError.toString() };
};

/*
 * Common Errors
 */

/**
 * 파라메터 오류를 생성합니다.
 *
 * @param {object} result express-validator의 validation result (https://github.com/ctavan/express-validator#validation-result-api)
 */
export const parameter = result => idErr(400, '요청 인자 오류', result.mapped());
export const database = err => idErr(500, '데이터베이스 오류', err);
