import middy from '@middy/core'
import cors from '@middy/cors'
import warmup from '@middy/warmup'

import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import{getPresignedUrl} from '../../businessLogic/attachmentUploadFunction'
import{updateAttachmentUrl} from '../../businessLogic/todoCurdFunctions'

import {createLogger} from '../../utils/logger'
const loggers= createLogger('generate url todo logger ..')


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  
  loggers.info('Proccessing generate_url event:  ',event)


  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const presignedUrl=getPresignedUrl(todoId)
  await updateAttachmentUrl(todoId)
  
  return {
    statusCode:200,
    headers:{
      'Access-Control-Allow-Origin':'*'
    },
    body:JSON.stringify({
      uploadUrl:presignedUrl
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
