export abstract class App_ErrorBase extends Error {
  constructor(
    public message: string,
    public errorCode: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message);
  }
}

export class App_ErrorBadRequest extends App_ErrorBase {
  constructor(message: string = 'Bad Request') {
    super(message, 'BAD_REQUEST');
  }
}

export class App_ErrorUnauthorized extends App_ErrorBase {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED');
  }
}

export class App_ErrorNotFound extends App_ErrorBase {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND');
  }
}
