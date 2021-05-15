

import * as AWS  from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import{UpdateTodoRequest}from '../requests/UpdateTodoRequest'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate'

import {createLogger}from '../utils/logger'
import {TodoS3Access} from './todoS3Access'

const todoS3Access=new TodoS3Access();
const logger=createLogger('todo access')
export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODO_TABLE,
    private readonly userindex = process.env.TODOS_BY_USER_INDEX) {
  }

  async getAllTodosFromDynamodb(userId :String): Promise<TodoItem[]> {

    const todos = await this.docClient.query({
        TableName: this.todoTable,
        IndexName: this.userindex,
        KeyConditionExpression : 'userId = :id',
        ExpressionAttributeValues:{
          ':id':userId
        }
      }).promise()

    const items = todos.Items
    return items as TodoItem[]
  }

  async createTodoToDynamodb(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todoTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async updateAttachmentUrl(todoId: string) {
    logger.info(`Updating attachment URL for todo ${todoId}`)

    await this.docClient.update({
        TableName: this.todoTable,
        Key: {
            todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': `https://${todoS3Access.getS3BucketName()}.s3.amazonaws.com/${todoId}`
        }
    }).promise()

    logger.info(`Updated attachment URL for todo ${todoId} successfully`)
    return
  }

  async updateTodoInDynamodb( todoId :String, todoItem: UpdateTodoRequest) {
  
        
    await this.docClient.update({
        TableName:this.todoTable,
        Key:{"todoId": todoId,}, 
        UpdateExpression: "set name = :name, dueDate=:dueDate, done=:isDone",
        ExpressionAttributeValues:{
            ":name":todoItem.name,
            ":dueDate":todoItem.dueDate,
            ":isDone":todoItem.done
        }
    }).promise()
    logger.info(`Updated the todo with ID ${todoId} successfully`)
    return
    // return todoItem

    
  }


    async deleteTodoFromDynamodb( todoId :String): Promise<String> {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key:{
            "todoId":todoId
         }
        }).promise()
      return todoId 
    }
}

