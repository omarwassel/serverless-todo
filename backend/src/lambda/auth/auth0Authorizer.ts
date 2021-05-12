import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, VerifyErrors } from 'jsonwebtoken'
import * as jwksClient from 'jwks-rsa'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')

const jwksUrl = process.env.AUTH0_JWKS_URL

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const client = jwksClient({
    jwksUri: jwksUrl,
  })

  const decoded = await decodeTokenAsync(token, client)

  return decoded as JwtPayload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

function decodeTokenAsync(token: string, client: jwksClient.JwksClient) {
  return new Promise((resolve, reject) => {
    verify(token, (header, callback) => {
      client.getSigningKey(header.kid, function (err, key) {
        callback(err, key.getPublicKey());
      });
    }, (error: VerifyErrors, decodedJwt: Jwt) => {
      if (error) return reject(error);
      resolve(decodedJwt)
    })
  })
}