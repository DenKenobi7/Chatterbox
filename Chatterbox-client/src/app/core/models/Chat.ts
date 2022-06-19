import { MessageGetDto } from "./MessageGetDto"

export class Chat{
    id:string
    companionId:string
    userId:string
    messages:MessageGetDto[]
}