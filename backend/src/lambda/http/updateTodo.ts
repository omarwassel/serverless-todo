import middy from '@middy/core'
import cors from '@middy/cors'
// import { cors } from 'middy/middlewares'
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
  await updateTodo(updatedTodo,todoId)

  return {
    statusCode:200,
    body:JSON.stringify({ })
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