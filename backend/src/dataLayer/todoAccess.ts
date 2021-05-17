import * as AWS  from 'aws-sdk'
import * as AWSXRay  from 'aws-xray-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import{UpdateTodoRequest}from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import {createLogger}from '../utils/logger'

const XAWS=AWSXRay.captureAWS(AWS);
const logger=createLogger('todo access')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly attachmentsBucket = process.env.TODO_S3_BUCKET,
    private readonly todoTable = process.env.TODOS_TABLE,
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
            ':attachmentUrl': `https://${this.attachmentsBucket}.s3.amazonaws.com/${todoId}`
        }
    }).promise()

    logger.info(`Updated attachment URL for todo ${todoId} successfully`)
    return
  }

  async updateTodoInDynamodb( todoId :String, todoItem: UpdateTodoRequest) {
  
    logger.info('Updating the todo with ID: ', todoId)

    const { done, dueDate, name } = todoItem
    await this.docClient.update({
        TableName: this.todoTable,
        Key: {
            todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": name,
            ":dueDate": dueDate,
            ":done": done
        }
    }).promise()

    logger.info(`Updated the todo with ID ${todoId} successfully`)
    return

  }


    async deleteTodoFromDynamodb( todoId :String) {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key:{
            "todoId":todoId
         }
        }).promise()
      return 
    }
}

