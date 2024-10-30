'use client'

import { createContext } from 'react'
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  CognitoUserPool,
} from 'amazon-cognito-identity-js'
import { GetUserPool } from '@/components/utils/UserPool'

// Account countext interface to be used in components that require user to be signed in
interface IAccountContext {
  authenticate: (
    Username: string,
    Password: string,
  ) => Promise<CognitoUserSession>
  getSession: () => Promise<CognitoUserSession>
  logout: () => void
  signUp: (
    Username: string,
    Password: string,
    FirstName: string,
    LastName: string,
    WixOrderId: string | null,
    WixMemberId: string | null,
  ) => Promise<unknown>
  verifyEmail: (Username: string, VerificationCode: string) => Promise<unknown>
  updateUserAttribute: (key: string, value: string) => Promise<unknown>
  verifyAttribute: (code: string, attribute: string) => Promise<unknown>
  requestPasswordReset: (email: string) => void
  confirmPasswordReset: (
    email: string,
    verificationCode: string,
    newPassword: string,
  ) => Promise<unknown>
  getUserAttributes: () => Promise<UserAttributes | null>
  getUserTier: () => Promise<string | null>
  getWixOrderId: () => Promise<string | null>
  getWixMemberId: () => Promise<string | null>
  getEmail: () => Promise<string | null>
  deleteUser: () => void
}

/**
 * Get user pool from Cognito
 */
const Pool = GetUserPool() as CognitoUserPool

/**
 * Sign up user in Cognito
 * @param Username Email user used to sign up
 * @param Password User password
 * @param FirstName First name of user
 * @param LastName Last name of user
 * @param WixOrderId Order ID from Wix (optional)
 * @param WixMemberId Member ID from Wix (optional)
 */
const signUp = (
  Username: string,
  Password: string,
  FirstName: string,
  LastName: string,
  WixOrderId: string | null,
  WixMemberId: string | null,
) => {
  var givenName = new CognitoUserAttribute({
    Name: 'given_name',
    Value: FirstName,
  })

  var familyName = new CognitoUserAttribute({
    Name: 'family_name',
    Value: LastName,
  })

  const names: CognitoUserAttribute[] = []
  names.push(givenName)
  names.push(familyName)

  if (WixOrderId) {
    var wixOrderId = new CognitoUserAttribute({
      Name: 'custom:wixOrderId',
      Value: WixOrderId,
    })
    names.push(wixOrderId)
  }

  if (WixMemberId) {
    var wixMemberId = new CognitoUserAttribute({
      Name: 'custom:wixMemberId',
      Value: WixMemberId,
    })
    names.push(wixMemberId)
  }

  return new Promise((resolve, reject) => {
    Pool.signUp(Username, Password, names, [], (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(data)
        resolve(data)
      }
    })
  })
}

/**
 * Verify user email in Cognito
 * Verification code is sent to user's email on sign up
 * @param Username Email user used to sign up
 * @param VerificationCode Verification code sent to user
 */
const verifyEmail = (Username: string, VerificationCode: string) => {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username, Pool })
    user.confirmRegistration(VerificationCode, true, (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(data)
        resolve(data)
      }
    })
  })
}

/**
 * Logout user and close Cognito session
 */
const logout = () => {
  const user = Pool.getCurrentUser()

  if (user) {
    user.signOut()
  }
}

/**
 * Get current Cognito session for user
 */
const getSession = () => {
  return new Promise<CognitoUserSession>((resolve, reject) => {
    const user = Pool.getCurrentUser()

    if (user) {
      user.getSession((err: Error, session: CognitoUserSession | null) => {
        if (err) {
          reject(err)
        } else {
          resolve(session as CognitoUserSession)
        }
      })
    } else {
      reject()
    }
  })
}

const deleteUser = () => {
  const user = Pool.getCurrentUser();

  if (user) {
    user.getSession((err: Error) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  user.deleteUser((err, result) => {
    if (err) {
      alert("Account deletion failed");
      console.log(err);
      return;
    }

    console.log("Account deletion was successful")
  })
}

/**
 * Update user attribute in Cognito
 * @param key Attribute key
 * @param value Attribute value
 */
const updateUserAttribute = (key: string, value: string) => {
  const user = Pool.getCurrentUser()
  if (user) {
    user.getSession((err: Error) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  const newAttribute = new CognitoUserAttribute({
    Name: key,
    Value: value,
  })

  return new Promise((resolve, reject) => {
    if (user) {
      user.updateAttributes([newAttribute], (err, result) => {
        if (err) {
          console.error(err)
          reject()
        } else {
          console.log(result)
          resolve(result)
        }
      })
    }
  })
}

/**
 * Verify user attribute in Cognito
 * @param code Verification code sent to user
 */
const verifyAttribute = (code: string, attribute: string) => {
  const user = Pool.getCurrentUser()
  if (user) {
    user.getSession((err: Error, session: CognitoUserSession | null) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  return new Promise((resolve, reject) => {
    user?.verifyAttribute(attribute, code, {
      onSuccess: (data) => {
        console.log('success', data)
        resolve(data)
      },
      onFailure: (err) => {
        console.error('failure', err)
        reject(err)
      },
    })
  })
}

/**
 * Request password reset for user in Cognito
 * @param email Email user used to sign up
 */
const requestPasswordReset = (email: string) => {
  const user = new CognitoUser({
    Username: email,
    Pool: Pool,
  })

  user.forgotPassword({
    onSuccess: (data) => {
      console.log('Password reset verification code has been set:', data)
    },
    onFailure: (err) => {
      console.error(err)
    },
  })
}

/**
 * Confirm password reset for user in Cognito
 * @param email Email user used to sign up
 * @param verificationCode Verification code sent to user
 * @param newPassword New password to set
 */
const confirmPasswordReset = (
  email: string,
  verificationCode: string,
  newPassword: string,
) => {
  const user = new CognitoUser({
    Username: email,
    Pool: Pool,
  })

  return new Promise((resolve, reject) => {
    user.confirmPassword(verificationCode, newPassword, {
      onSuccess: (data) => {
        console.log('Password reset successful:', data)
        resolve(data)
      },
      onFailure: (err) => {
        console.error('Password reset failed:', err)
        reject(err)
      },
    })
  })
}

/**
 * Authenticate user in Cognito
 * Sign in user with email and password, creating a new session
 * @param Username Email user used to sign up
 * @param Password User password
 */
const authenticate = (Username: string, Password: string) => {
  const user = new CognitoUser({ Username, Pool })
  const authenticationDetails = new AuthenticationDetails({
    Username,
    Password,
  })

  return new Promise<CognitoUserSession>((resolve, reject) => {
    user.authenticateUser(authenticationDetails, {
      onSuccess: (data) => {
        console.log('onSuccess: ', data)
        resolve(data)
      },
      onFailure: (err) => {
        console.error('onFailure: ', err)
        reject(err)
      },
      newPasswordRequired: (data) => {
        console.log('newPasswordRequired: ', data)
        resolve(data)
      },
    })
  })
}

// Class to represent all user attributes saved in Cognito
export class UserAttributes {
  email: string
  family_name: string
  given_name: string
  memberTier: string | null
  wixMemberId: string | null
  wixOrderId: string | null
  wixEmail: string | null
  altEmail: string | null
}

/**
 * Get all user attributes from Cognito for current user 
 * @returns UserAttributes object with all user attributes
 */
const getUserAttributes = () => {
  const user = Pool.getCurrentUser()
  if (user) {
    user.getSession((err: Error, session: CognitoUserSession | null) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  return new Promise<UserAttributes | null>((resolve, reject) => {
    if (user) {
      // Get all user attributes
      user.getUserAttributes((err, result) => {
        if (err) {
          console.error(err)
          reject(err)
        } else {
          const userAttributes = new UserAttributes()
          // Build UserAttributes object from result
          // User attributes are stored as key-value pairs
          for (const item of result) {
            switch (item.Name) {
              case 'email':
                userAttributes.email = item.Value
                break
              case 'family_name':
                userAttributes.family_name = item.Value
                break
              case 'given_name':
                userAttributes.given_name = item.Value
                break
              case 'custom:memberTier':
                userAttributes.memberTier = item.Value
                break
              case 'custom:wixMemberId':
                userAttributes.wixMemberId = item.Value
                break
              case 'custom:wixOrderId':
                userAttributes.wixOrderId = item.Value
                break
              case 'custom:wixEmail':
                userAttributes.wixEmail = item.Value
                break
              case 'custom:altEmail':
                userAttributes.altEmail = item.Value
                break;
              default:
                break
            }
          }
          resolve(userAttributes)
        }
      })
    }
  })
}

// Get user attribute by name
const getUserAttribute = (attributeName: string) => {
  const user = Pool.getCurrentUser()
  if (user) {
    user.getSession((err: Error, session: CognitoUserSession | null) => {
      if (err) {
        console.error(err)
        return
      }
    })
  }

  return new Promise<string | null>((resolve, reject) => {
    if (user) {
      user.getUserAttributes((err, result) => {
        if (err) {
          console.error(err)
          reject()
        } else {
          for (var attribute of result!) {
            if (attribute.Name == attributeName) resolve(attribute.Value)
          }
          resolve(null)
        }
      })
    }
  })
}

// Get user tier from Cognito
const getUserTier = () => {
  return getUserAttribute('custom:memberTier')
}

// Get Wix order ID from Cognito
const getWixOrderId = () => {
  return getUserAttribute('custom:wixOrderId')
}

// Get Wix member ID from Cognito
const getWixMemberId = () => {
  return getUserAttribute('custom:wixMemberId')
}

// Get user email from Cognito
const getEmail = () => {
  return getUserAttribute('email')
}

const AccountContext = createContext<IAccountContext>({
  authenticate: authenticate,
  getSession: getSession,
  logout: logout,
  signUp: signUp,
  verifyEmail: verifyEmail,
  updateUserAttribute: updateUserAttribute,
  verifyAttribute: verifyAttribute,
  requestPasswordReset: requestPasswordReset,
  confirmPasswordReset: confirmPasswordReset,
  getUserAttributes: getUserAttributes,
  getWixOrderId: getWixOrderId,
  getUserTier: getUserTier,
  getWixMemberId: getWixMemberId,
  getEmail: getEmail,
  deleteUser: deleteUser,
})

const Account: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <AccountContext.Provider
      value={{
        authenticate,
        getSession,
        logout,
        signUp,
        verifyEmail,
        updateUserAttribute,
        verifyAttribute,
        requestPasswordReset,
        confirmPasswordReset,
        getUserAttributes,
        getWixOrderId,
        getUserTier,
        getWixMemberId,
        getEmail,
        deleteUser,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  )
}

export { Account, AccountContext }
