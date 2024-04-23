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
}

export default function CodeVerification({ email }: Props) {
  const [verificationCode, setVerificationCode] = useState('')
  const [codeMismatch, setCodeMismatch] = useState(false)
  const { verifyEmail } = useContext(AccountContext)
  const [verified, setVerified] = useState(false)
  const searchParams = useSearchParams()

  const onSubmitVerify = () => {
    verifyEmail(email, verificationCode)
      .then((data) => {
        setVerified(true)
      })
      .catch((err) => {
        console.error('Verification Failed: ', err)
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
          title="Email verification was successful!"
          subtitle={<>You may now proceed to login.</>}
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
