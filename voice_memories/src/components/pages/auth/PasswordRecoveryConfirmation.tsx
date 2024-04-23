'use client'

import { useState, useContext } from 'react'
import { AuthLayout } from '../AuthLayout'
import { TextField } from '../Fields'
import { Button } from '@/components/pages/Button'
import { AccountContext } from '@/components/utils/Account'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Props {
  email: string
  newPassword: string
}

export default function PasswordRecoveryConfirmation({
  email,
  newPassword,
}: Props) {
  const [verificationCode, setVerificationCode] = useState('')
  const [codeMismatch, setCodeMismatch] = useState(false)
  const { confirmPasswordReset } = useContext(AccountContext)
  const [verified, setVerified] = useState(false)
  const searchParams = useSearchParams()

  const onSubmitVerify = () => {
    confirmPasswordReset(email, verificationCode, newPassword)
      .then((data) => {
        console.log('Password reset successful:', data)
        setVerified(true)
      })
      .catch((err) => {
        console.error('Password reset failed:', err)
        if (err.name === 'CodeMismatchException') {
          setCodeMismatch(true)
        }
      })
  }

  return (
    <>
      {!verified && (
        <AuthLayout
          title="Verify Email"
          subtitle={
            <>
              A verification code has been sent to your email. Please enter the
              code here.
            </>
          }
        >
          <div>
            <div>
              <TextField
                label="Verification Code"
                name="verification_code"
                type="text"
                className="w-full"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                required
              />
            </div>
            {codeMismatch && (
              <label className="col-span-full pt-2 text-red-500">
                The provided code is incorrect. Please try again.
              </label>
            )}
            <Button
              onClick={() => onSubmitVerify()}
              color="cyan"
              className="mt-8 w-full"
            >
              Verify
            </Button>
          </div>
        </AuthLayout>
      )}
      {verified && (
        <AuthLayout
          title="Your password has been reset."
          subtitle={<>You may now log in with your email and new password.</>}
        >
          <Link href={`/AccountLogin?${searchParams.toString()}`}>
            <Button color="cyan" className="mt-8 w-full">
              Login Now
            </Button>
          </Link>
        </AuthLayout>
      )}
    </>
  )
}
