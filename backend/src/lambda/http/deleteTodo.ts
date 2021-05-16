import middy from '@middy/core'
import cors from '@middy/cors'
// import { cors } from 'middy/middlewares'
import warmup from '@middy/warmup'

import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import{deleteTodo} from '../../businessLogic/todoCurdFunctions'

import {createLogger} from '../../utils/logger'
const loggers= createLogger('delete todo logger ..')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  loggers.info('Proccessing delete event: ',event)
  // TODO: Remove a TODO item by id
  await deleteTodo(todoId)
    
  return {
    statusCode:200,
    body:JSON.stringify({
      
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
