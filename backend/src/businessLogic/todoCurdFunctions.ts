
import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoS3Access } from '../dataLayer/todoS3Access'

import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'


const todoAccess = new TodoAccess()

export async function getAllTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getAllTodosFromDynamodb(userId)
}

export async function createTodo(CreateTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {

  const itemId = uuid.v4()
  const s3Bucket:String= new TodoS3Access().getS3BucketName()
  return await todoAccess.createTodoToDynamodb({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: CreateTodoRequest.name,
    dueDate: CreateTodoRequest.dueDate,
    done: false,
  
  })
}

export async function updateAttachmentUrl(todoId: string) {
  return await todoAccess.updateAttachmentUrl(todoId)
}

export async function updateTodo(CreateTodoRequest: UpdateTodoRequest, todoId: string): Promise<TodoUpdate> {

    return await todoAccess.updateTodoInDynamodb(todoId,{
        name: CreateTodoRequest.name,
        dueDate: CreateTodoRequest.dueDate,
        done: CreateTodoRequest.done 
    })
}

export async function deleteTodo( todoId: string) {
    await todoAccess.deleteTodoFromDynamodb(todoId)
}

