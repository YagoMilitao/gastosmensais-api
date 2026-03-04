export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ){
    super(message);
  }
}

export const badRequest= (message:string, code?:string) => 
    new AppError(message, 400, code);

export const unauthorized = (message= "Unauthorized", code?: string)=>
    new AppError(message, 401, code);

export const forbidden = (message = "Forbidden", code?: string)=>
    new AppError(message, 403, code);

export const notFound = (message = "Not Found", code?:string) =>
    new AppError(message,404, code);

export const internalServerError = (message = "Internal Server Error", code?: string) =>
    new AppError(message, 500, code);
