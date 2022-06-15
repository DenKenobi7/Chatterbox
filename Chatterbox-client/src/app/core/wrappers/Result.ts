export class Result<T>{
    Succeeded?: boolean
    Errors?: { [key: string]:string }
    Message?: string
    Data?: T
}