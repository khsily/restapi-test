// TODO: 에러 class 및 상속을 통해 에러 관리하기

export const apiErr = (status, msg, anyError) => {
  return {
    status,
    msg,
    error: anyError.toString(),
  };
};

/*
 * Common Errors
 */

export const parameter = err => {
  return apiErr(400, '[Bad Request] 요청 인자 오류', err);
}

export const database = err => {
  let errText = err.toString();
  if (err.errors) errText += ` (${err.errors[0].message})`;
  return apiErr(500, '[Internal Server Error] 데이터베이스 오류', errText);
}

export const auth = err => {
  return apiErr(401, '[Unauthorized] 유저 인증 오류', err);
}

export const owner = err => {
  return apiErr(403, '[Forbidden] 소유자 인증 오류', err);
}