import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import {getUserId} from '../utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import {createTodo} from '../../businessLogic/todoCurdFunctions'

import {createLogger} from '../../utils/logger'
const loggers= createLogger('create todo logger ..')

export const handler =middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  loggers.info('Proccessing create event:  ',event)
  // TODO: Implement creating a new TODO item
  const userId=getUserId(event)
  const req:CreateTodoRequest= JSON.parse(event.body)
  const item=await createTodo(req,userId)

  
  return {
    statusCode:201,
    body:JSON.stringify({
      item,
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



