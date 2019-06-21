/**
 * idErr
 *
 * 인딜라이트 표준 에러 오브젝트를 생성합니다.
 * API의 마지막 라우터에서 처리합니다.
 *
 * @param {number} id_code 응답으로 보낼 http 상태 코드
 * @param {string} id_msg 응답으로 보낼 에러 메세지
 * @param {any} anyError 로그에 남길 에러 (아무거나) optional
 */
export const idErr = (code, msg, anyError) => {
  return {
    id_code: code,
    id_msg: msg,
    id_error: anyError.toString(),
  };
};

/*
 * Common Errors
 */

export const parameter = err => {
  return idErr(400, '요청 인자 오류', err);
}

export const database = err => {
  let errText = err.toString();
  if (err.errors) errText += ` (${err.errors[0].message})`;
  return idErr(500, '데이터베이스 오류', errText);
}
