'use client'

import Link from 'next/link'
import { useState, useContext } from 'react'
import { AuthLayout } from '@/components/pages/AuthLayout'
import { Button } from '@/components/pages/Button'
import { TextField } from '@/components/pages/Fields'
import { type Metadata } from 'next'
import { AccountContext } from '@/components/utils/Account'
import { useRouter, useSearchParams } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function Login() {
  // Get planOrderId and planId from URL query params if they exist
  const searchParams = useSearchParams()
  const planOrderId = searchParams.get('planOrderId') || ''
  const planId = searchParams.get('planId') || ''

  // Set up states and context
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginFailed, setLoginFailed] = useState(false)
  const { authenticate, updateUserAttribute, getWixOrderId } =
    useContext(AccountContext)
  const router = useRouter()

  const onSubmit = () => {
    authenticate(email, password)
      .then((data) => {
        const payload = data.getIdToken().payload
        sessionStorage.setItem(
          'FullName',
          payload.given_name + ' ' + payload.family_name,
        )
        sessionStorage.setItem('Email', payload.email)
        // Update user attributes with planOrderId
        if (planOrderId) {
          updateUserAttribute('wixOrderId', planOrderId)
        }
        // Redirect to checkout if query contains a plan ID
        if (planId) {
          router.push(`/Checkout?${searchParams.toString()}`)
          return
        } else {
          // Redirect to plan select if user does not have a membership plan
          getWixOrderId().then((orderId) => {
            if (!orderId) {
              router.push('/PlanSelect')
              return
            }
          })
        }

        router.push('/auth/main')
      })
      .catch((err) => {
        console.error('Failed to login: ', err)
        setLoginFailed(true)
      })
  }

  return (
    <AuthLayout
      title="Sign in to account"
      subtitle={
        <>
          Don’t have an account?{' '}
          <Link
            href={`/AccountRegister?${searchParams.toString()}`}
            className="text-cyan-600"
          >
            Sign up
          </Link>{' '}
          for a free trial.
        </>
      }
    >
      <div>
        <div className="space-y-6">
          <TextField
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {loginFailed && (
            <p className="text-red-500">
              The provided email or password is incorrect.
            </p>
          )}
        </div>
        <Button onClick={() => onSubmit()} color="cyan" className="mt-8 w-full">
          Sign in to account
        </Button>
        <Link
          className="mt-8 flex justify-center text-cyan-600"
          href="/AccountLogin/PasswordRecovery"
        >
          Forgot your password?
        </Link>
      </div>
    </AuthLayout>
  )
}
