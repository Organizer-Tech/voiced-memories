'use client'

import Link from 'next/link'
import { AuthLayout } from '@/components/pages/AuthLayout'
import { Button } from '@/components/pages/Button'
import { SelectField, TextField } from '@/components/pages/Fields'
import { type Metadata } from 'next'
import { useState, useContext, FormEventHandler } from 'react'
import { AccountContext } from '@/components/utils/Account'
import CodeVerification from './CodeVerification'
import { useSearchParams } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function Register() {
  // Set up states and context
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLengthValid, setIsLengthValid] = useState(true)
  const [containsUpper, setContainsUpper] = useState(true)
  const [containsLower, setContainsLower] = useState(true)
  const [containsNumber, setContainsNumber] = useState(true)
  const [containsSpecial, setContainsSpecial] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const { signUp } = useContext(AccountContext)

  // Get planOrderId from URL query params
  const searchParams = useSearchParams()
  const planOrderId = searchParams.get('planOrderId') || null

  /**
   * Check if password meets requirements and update password state
   * @param newPassword Password from the input field
   */
  const handlePasswordChange = (newPassword: string) => {
    setIsLengthValid(newPassword.length >= 8)
    setContainsUpper(new RegExp('^(?=.*[A-Z])').test(newPassword))
    setContainsLower(new RegExp('^(?=.*[a-z])').test(newPassword))
    setContainsNumber(new RegExp('^(?=.*\\d)').test(newPassword))
    setContainsSpecial(
      new RegExp('^(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\\\/-])').test(
        newPassword,
      ),
    )
    setPassword(newPassword)
  }

  /**
   * Submit registration form and sign up user in Cognito
   */
  const onSubmitRegister = () => {
    signUp(email, password, firstName, lastName, planOrderId, null)
      .then((data) => {
        setRegistered(true)
      })
      .catch((err) => {
        console.error('Registration Failed: ', err)
        if (err.name === 'UsernameExistsException') {
          setEmailExists(true)
        }
      })
  }

  return (
    <>
      {!registered && (
        <>
          <AuthLayout
            title="Sign up for an account"
            subtitle={
              <>
                Already registered?{' '}
                <Link
                  href={`/AccountLogin?${searchParams.toString()}`}
                  className="text-cyan-600"
                >
                  Sign in
                </Link>{' '}
                to your account.
              </>
            }
          >
            <div>
              <div className="grid grid-cols-2 gap-6">
                <TextField
                  label="First name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
                <TextField
                  label="Last name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
                <TextField
                  className="col-span-full"
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                {emailExists && (
                  <label className="col-span-full text-red-500">
                    The provieded Email has already been used to create an
                    account. Please choose a different email.
                  </label>
                )}
                <TextField
                  className="col-span-full"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => handlePasswordChange(event.target.value)}
                  required
                />
                {!isLengthValid && (
                  <label className="col-span-full text-red-500">
                    The password must be at least 8 characters long.
                  </label>
                )}
                {!containsUpper && (
                  <label className="col-span-full text-red-500">
                    The password must contain at least 1 upper case letter.
                  </label>
                )}
                {!containsLower && (
                  <label className="col-span-full text-red-500">
                    The password must contain at least 1 lower case letter.
                  </label>
                )}
                {!containsNumber && (
                  <label className="col-span-full text-red-500">
                    The password must contain at least 1 number
                  </label>
                )}
                {!containsSpecial && (
                  <label className="col-span-full text-red-500">
                    The password must contain at least 1 special character from
                    the following group:
                    !@#$%^&*()_+&#123;&#125;&#91;&#93;:;&#60;&#62;?~\/-
                  </label>
                )}
              </div>
              <Button
                onClick={() => onSubmitRegister()}
                color="cyan"
                className="mt-8 w-full"
              >
                Create Account
              </Button>
            </div>
            <div className="mt-8 text-center">
            <a
              href="https://docs.google.com/document/d/18FTbBfp5_TlHCm0dmKVLTJ6Xe1XJk3fW2sfAsZfnM0E/edit"
              className="text-gray-900 underline"
            >
              
              Privacy Policy
            </a>
            </div>
          </AuthLayout>
        </>
      )}
      {registered && <CodeVerification email={email}></CodeVerification>}
    </>
  )
}
