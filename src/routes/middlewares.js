
export const logger = (req, res, next) => {
  const info = {
    from: req.ip,
    path: req.originalUrl,
    method: req.method,
    header: req.header,
    body: req.body,
  };

  const log = JSON.stringify(info, null, 2);
  console.log(log);

  next();
}


// 기본 결과 핸들러
export const resultHandler = (req, res, next) => {
  const payload = res.locals.payload;

  if (payload) {
    const data = {
      valid: true,
      code: 200,
      msg: '정상 처리',
      payload,
    };

    res.status(200);
    res.send(data);
  } else {
    next();
  }
}


//만약 알 수 없는 요청일 시 기본 핸들러
export const notFoundCommand = (req, res) => {
  res.status(404);
  res.send({
    valid: false,
    code: 404,
    msg: 'Not Found'
  });
}


//기본 에러 로거
export const defaultErrorLogger = (err, req, res, next) => {
  console.log('######## 에러 발생 ########');
  console.log(JSON.stringify(err, null, 2));
  console.log('###########################');
  next(err);
}

export const defaultErrorHandler = (err, req, res, next) => {
  const { id_code, id_msg, id_error } = err;
  let code, msg;

  code = id_code || 500;
  msg = id_msg || '알 수 없는 오류';

  res.status(code);
  res.send({
    valid: false,
    code,
    msg,
    error: id_error,
  });
}