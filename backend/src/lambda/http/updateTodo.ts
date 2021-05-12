import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import 'source-map-support/register'
import { APIGatewayProxyEvent,APIGatewayProxyResult } from 'aws-lambda'


import { updateTodo } from '../../businessLogic/todoCurdFunctions'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import {createLogger} from '../../utils/logger'
const loggers= createLogger('update todo logger ..')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  loggers.info('Proccessing update event:  ',event)


  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const item =updateTodo(updatedTodo,todoId)

  return {
    statusCode:201,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body:JSON.stringify({
      item
    })
  }

})
handler.use([
  cors({
    credentials: true,
  } as any),
  warmup({
    isWarmingUp: e => e.source === 'serverless-plugin-warmup',
    onWarmup: e => "It's warm!"
  })
])