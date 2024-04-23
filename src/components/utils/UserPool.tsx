import { CognitoUserPool } from 'amazon-cognito-identity-js'

function getUserPool() {
  const Pool = new CognitoUserPool({
    UserPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID as string,
    ClientId: process.env.NEXT_PUBLIC_AWS_CLIENT_ID as string,
  })
  return Pool
}

export const GetUserPool = getUserPool
