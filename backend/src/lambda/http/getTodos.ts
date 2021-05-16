import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import {getAllTodos} from '../../businessLogic/todoCurdFunctions'
import { getUserId } from'../utils'

import {createLogger} from '../../utils/logger'
const loggers= createLogger('get todos logger ..')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  loggers.info('Proccessing get event:  ',event)
  // TODO: Get all TODO items for a current user
  
  const userId=getUserId(event)
  const items=await getAllTodos(userId);

  return {
    statusCode:200,
    body:JSON.stringify({
      items
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
