'use client'

import { useEffect, useState, useContext } from 'react'
import { Dialog, Switch } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Button } from '@/components/primitives/Button'
import { FloatingPortal } from '@floating-ui/react'
import { ConfirmationModal } from '@/components/primitives/ConfirmationModal/ConfirmationModal'
import { AccountContext } from '@/components/utils/Account'
import { TileSpinner } from '@/components/primitives/TileSpinner.tsx/TileSpinner'
import { deleteAllPhotos } from '@/components/utils/apiFunctions'
import {
  CreditCardIcon,
  FingerPrintIcon,
  UserCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { TextField } from '@/components/pages/Fields'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import {
  getOrder,
  cancelMembership,
} from '@/components/utils/WixMembers'
import {
  getPlanDetails,
  WixPlanID,
  WixPlanDetails,
} from '@/components/utils/WixPlans'
import Link from 'next/link'
const navigation = [{ name: 'Home', href: '/auth/main' }]
const secondaryNavigation = [
  {
    name: 'General',
    href: '#general',
    icon: UserCircleIcon,
    current: true
  },
  {
    name: 'Security',
    href: '#security',
    icon: FingerPrintIcon,
    current: false,
  },
  {
    name: 'Billing',
    href: '#billing',
    icon: CreditCardIcon,
    current: false
  },
]

/**
 * Function to join class names
 * @param classes List of class names used by the component
 * @returns Space separated string of all classes
 */
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function Settings() {
  // States
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentTab, setCurrentTab] = useState('')
  const [updateName, setUpdateName] = useState(false)
  const [updateEmail, setUpdateEmail] = useState(false)
  const [updateAltEmail, setUpdateAltEmail] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [altEmail, setAltEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newAltEmail, setNewAltEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [verified, setVerified] = useState(true)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidAltEmail, setInvalidAltEmail] = useState(false)
  const [session, setSession] = useState<CognitoUserSession>()
  const [changePassword, setChangePassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false)
  const [passwordChangeFailure, setPasswordChangeFailure] = useState(false)
  const [passwordRecoveryRequested, setPasswordRecoveryRequested] = useState(false)
  const [wixPlan, setWixPlan] = useState<WixPlanDetails>(null)
  const [wixOrderId, setWixOrderId] = useState('')
  const [cancelRequested, setCancelRequested] = useState(false)
  const [membershipCancelled, setMembershipCancelled] = useState(false)
  const [cancellationFailed, setCancellationFailed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const {
    getSession,
    requestPasswordReset,
    confirmPasswordReset,
    updateUserAttribute,
    verifyAttribute,
    deleteUser,
    getWixOrderId,
    getWixMemberId,
  } = useContext(AccountContext)

  // useEffect for authentication check
  useEffect(() => {
    // Get user session
    getSession()
      .then((session) => {
        console.log('Session: ', session)
        setSession(session)

        const payload = session.getIdToken().payload
        const name = payload.given_name + ' ' + payload.family_name

        // Set user details
        setFullName(name)
        setEmail(payload.email)
        setLoggedIn(true)

        // If user has a Wix member ID, get plan details
        getWixOrderId().then((orderId) => {
          if (!orderId) {
            return
          }
          setWixOrderId(orderId)
          getOrder(orderId).then((order) => {
            if (!order) {
              return
            }
            const planDetails = getPlanDetails(order.planId as WixPlanID)
            setWixPlan(planDetails)
          })
        })
      })
      .catch((error) => {
        if (typeof window !== 'undefined') {
          window.location.href = '/' // Redirect if not authenticated
        }
      })
  }, [])

  // useEffect for handling URL hash change
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentTab(window.location.hash)
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)

    // Cleanup function
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  /**
   *  Function to delete all photos and data
   */
  const deleteClicked = async () => {
    const tokens = {
      access: session?.getAccessToken().getJwtToken() as string,
      id: session?.getIdToken().getJwtToken() as string,
    }

    const res = await deleteAllPhotos(email, tokens)

    if (res === 204) {
      setIsConfirmDeleteOpen(false);

      cancelMembership(wixOrderId).then(() => {
        setWixPlan(null)
      }).catch(() => {
        alert("Account deletion failed.")
      })

      deleteUser()

      alert("Account was deleted successfully");
      window.location.href = '/'
    } else {
      //delete unsuccessful
    }
  }

  /**
   * Function to update name user attributes in Cognito
   */
  const updateFullName = () => {
    updateUserAttribute('given_name', firstName)
      .then((data) => {
        console.log('first name updated')
      })
      .catch((err) => {
        console.error(err)
      })

    updateUserAttribute('family_name', lastName)
      .then((data) => {
        console.log('last name updated')
      })
      .catch((err) => {
        console.error(err)
      })

    setFullName(firstName + ' ' + lastName)
    setUpdateName(false)
  }

  /**
   * Function to update email user attribute in Cognito
   */
  const updateEmailAttribute = () => {
    setInvalidEmail(false)
    updateUserAttribute('email', newEmail)
      .then((data) => {
        console.log('email updated', data)
        setVerified(false)
      })
      .catch((err) => {
        console.error(err)
        if (err.name === 'InvalidParameterException') {
          setInvalidEmail(true)
        }
      })
  }

  /**
   * Function to update the alternate email user attribute in Cognito
   * Not fully implemented yet, need to fix permissions first
   */
  const updateAltEmailAttribute = () => {
    setAltEmail(newAltEmail)
    setUpdateAltEmail(false)
  }


  /**
   * Cancels email verification after updating email
   */
  const cancelVerification = () => {
    setUpdateEmail(false)
    setVerified(true)
  }

  const cancelAltVerification = () => {
    setUpdateAltEmail(false)
    setVerified(true)
  }

  /**
   * Function to verify new email address
   */
  const verifyNewEmail = () => {
    verifyAttribute(verificationCode)
      .then((data) => {
        console.log('Verification Successful: ', data)
        setVerified(true)
        setEmail(newEmail)
        setUpdateEmail(false)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  /**
   * Function to verify new alternate email address, not implemented yet
   */
  const verifyNewAltEmail = () => {
  }

  // sets tile spinner while loading
  if (!loggedIn) {
    return <TileSpinner />
  }

  /**
   * Handles button press for changing password
   */
  const changePasswordClicked = () => {
    requestPasswordReset(email)
    setPasswordRecoveryRequested(true)
    setChangePassword(false)
  }

  /**
   * Hnadles button press for confirming password reset
   */
  const confirmPasswordClicked = () => {
    confirmPasswordReset(email, verificationCode, newPassword)
      .then((data) => {
        console.log('Password reset successful:', data)
        setPasswordRecoveryRequested(false)
        setPasswordChangeFailure(false)
        setPasswordChangeSuccess(true)
      })
      .catch((err) => {
        console.error('Password reset failed:', err)
        if (err.name === 'CodeMismatchException') {
          setPasswordChangeSuccess(false)
          setPasswordChangeFailure(true)
        }
      })
  }

  /**
   * Handles button press for confirming cancel membership
   */
  const confirmCancelMembership = () => {
    setCancelRequested(false)
    cancelMembership(wixOrderId).then(() => {
      setWixPlan(null)
      updateUserAttribute('custom:wixMemberId', '')
      updateUserAttribute('custom:wixOrderId', '')
      updateUserAttribute('custom:memberTier', '')
      setMembershipCancelled(true)
    })
      .catch(() => {
        setMembershipCancelled(false)
        setCancellationFailed(true)
      })
  }

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50 flex h-20 border-b border-gray-900/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-x-6">
            <button
              type="button"
              className="-m-3 p-3 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
            </button>
            <img
              className="h-20 w-auto"
              src="/Logo.jpg"
              alt="Voice Memories"
            />
          </div>
          <nav className="hidden md:flex md:gap-x-11 md:text-sm md:font-semibold md:leading-6 md:text-gray-700">
            {navigation.map((item, itemIdx) => (
              <a key={itemIdx} href={item.href}>
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-4 pb-6 sm:max-w-sm sm:px-6 sm:ring-1 sm:ring-gray-900/10">
            <div className="-ml-0.5 flex h-16 items-center gap-x-6">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="-ml-0.5">
                <a href="#" className="-m-1.5 block p-1.5">
                  <span className="sr-only">Your Company</span>
                  <img
                    className="h-8 w-auto"
                    src="/Logo.jpg"
                    alt="Voice Memories"
                  />
                </a>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
        <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav className="flex-none px-4 sm:px-6 lg:px-0">
            <ul
              role="list"
              className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
            >
              {secondaryNavigation.map((item) => {
                const isCurrent = currentTab === item.href
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        isCurrent
                          ? 'bg-gray-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                        'group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6',
                      )}
                    >
                      <item.icon
                        className={classNames(
                          isCurrent
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-indigo-600',
                          'h-6 w-6 shrink-0',
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>
        {currentTab === '#general' && (
          <>
            <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Profile
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                  <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    {!updateName && (
                      <div className="pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                          Full name
                        </dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                          <div className="text-gray-900">{fullName}</div>
                          <button
                            type="button"
                            onClick={() => setUpdateName(true)}
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                          >
                            Update
                          </button>
                        </dd>
                      </div>
                    )}
                    {updateName && (
                      <div className="pt-5">
                        <TextField
                          label="New first name"
                          name="first_name"
                          type="text"
                          autoComplete="given-name"
                          onChange={(event) => setFirstName(event.target.value)}
                          required
                        />
                        <TextField
                          label="New last name"
                          name="last_name"
                          type="text"
                          autoComplete="family-name"
                          onChange={(event) => setLastName(event.target.value)}
                          required
                        />
                        <div className="flex justify-between">
                          <Button
                            onClick={() => updateFullName()}
                            color="cyan"
                            className="mt-8 w-2/5"
                          >
                            Update Name
                          </Button>
                          <Button
                            onClick={() => setUpdateName(false)}
                            color="cyan"
                            className="mt-8 w-2/5"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    {!updateEmail && (

                        <div className="pt-6 sm:flex">
                          <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                            Email address
                          </dt>
                          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div className="text-gray-900">{email}</div>
                            <button
                                type="button"
                            onClick={() => setUpdateEmail(true)}
                            className="font-semibold text-blue-600 hover:text-blue-500"
                            >
                            Update Email
                           </button>
                          </dd>
                        </div>

                    )}
                    {updateEmail && verified && (
                      <div className="pt-5">
                        <TextField
                          label="New Email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          onChange={(event) => setNewEmail(event.target.value)}
                          required
                        />
                        <div className="flex justify-between">
                          <Button
                            onClick={() => updateEmailAttribute()}
                            color="cyan"
                            className="mt-8 w-2/5"
                          >
                            Update Email
                          </Button>
                          <Button
                            onClick={() => setUpdateEmail(false)}
                            color="cyan"
                            className="mt-8 w-2/5"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    {updateEmail && !verified && (
                      <div>
                        <p className="text-red-500">
                          A verification code hase been sent to your new email.
                          Please enter the code below. Your old email will
                          continue to work until the verification code is
                          entered.
                        </p>
                        <div className="pt-5">
                          <TextField
                            label="Verification Code"
                            name="code"
                            type="text"
                            onChange={(event) =>
                              setVerificationCode(event.target.value)
                            }
                            required
                          />
                          <div className="flex justify-between">
                            <Button
                              onClick={() => verifyNewEmail()}
                              color="cyan"
                              className="mt-8 w-2/5"
                            >
                              Update Email
                            </Button>
                            <Button
                              onClick={() => cancelVerification()}
                              color="cyan"
                              className="mt-8 w-2/5"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {!updateAltEmail && (
                      <div className="pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                          Alternate email address
                        </dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                          <div className="text-gray-900">{altEmail}</div>
                          <button
                            type="button"
                            onClick={() => setUpdateAltEmail(true)}
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                          >
                            Update
                          </button>
                        </dd>
                      </div>
                    )}
                    {updateAltEmail && verified && (
                      <div className="pt-5">
                        <TextField
                          label="New Alternate Email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          onChange={(event) => setNewAltEmail(event.target.value)}
                          required
                        />
                        <div className="flex justify-between">
                          <Button
                            onClick={() => updateAltEmailAttribute()}
                            color="cyan"
                            className="mt-8 w-2/5"
                          >
                            Update Alternate Email
                          </Button>
                          <Button
                            onClick={() => setUpdateAltEmail(false)}
                            color="cyan"
                            className="mt-8 w-2/5"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    {updateAltEmail && !verified && (
                      <div>
                        <p className="text-red-500">
                          A verification code hase been sent to your new email.
                          Please enter the code below. Your old email will
                          continue to work until the verification code is
                          entered.
                        </p>
                        <div className="pt-5">
                          <TextField
                            label="Verification Code"
                            name="code"
                            type="text"
                            onChange={(event) =>
                              setVerificationCode(event.target.value)
                            }
                            required
                          />
                          <div className="flex justify-between">
                            <Button
                              onClick={() => verifyNewAltEmail()}
                              color="cyan"
                              className="mt-8 w-2/5"
                            >
                              Update Alternate Email
                            </Button>
                            <Button
                              onClick={() => cancelAltVerification()}
                              color="cyan"
                              className="mt-8 w-2/5"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </main>
          </>
        )}
        {currentTab === '#security' && (
          <>
            <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Security
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Once information is deleted it can not be recovered.
                  </p>

                  <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                    {passwordChangeSuccess && (
                      <div
                        className="flex items-center bg-blue-500 px-4 py-3 text-sm font-bold text-white"
                        role="alert"
                      >
                        <svg
                          className="mr-2 h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                        </svg>
                        <p>Your password has been updated.</p>
                      </div>
                    )}
                    {passwordChangeFailure && (
                      <div
                        className="flex items-center bg-red-500 px-4 py-3 text-sm font-bold text-white"
                        role="alert"
                      >
                        <svg
                          className="mr-2 h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                        </svg>
                        <p>
                          Password failed to update. Please ensure your
                          verification code is correct.
                        </p>
                      </div>
                    )}
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Change Password
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:flex-none sm:pr-6">
                        <Button
                          size="md"
                          color="red"
                          className="text-3xl text-white hover:text-gray-200"
                          onClick={() => setChangePassword(true)}
                        >
                          {' '}
                          Change Password{' '}
                        </Button>
                      </dd>
                    </div>
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                        Delete All My Photos & Data
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <Button
                          size="md"
                          color="red"
                          className="text-3xl text-white hover:text-gray-200"
                          onClick={() => setIsConfirmDeleteOpen(true)}
                        >
                          {' '}
                          Delete{' '}
                        </Button>
                      </dd>
                    </div>
                  </dl>
                </div>
                <FloatingPortal>
                  <ConfirmationModal
                    title="Delete All Photos"
                    body={`Are you sure you want to delete your account? Once your account is deleted it cannot be recovered.`}
                    isOpen={isConfirmDeleteOpen}
                    onClose={() => setIsConfirmDeleteOpen(false)}
                    onConfirm={() => deleteClicked()}
                  />
                </FloatingPortal>
                <FloatingPortal>
                  <ConfirmationModal
                    title="Edit Password"
                    body={
                      <div>
                        <div>
                          <TextField
                            label="Current Password"
                            name="current"
                            type="password"
                            onChange={(event) =>
                              setCurrentPassword(event.target.value)
                            }
                          ></TextField>
                          <TextField
                            className="pt-2"
                            label="New Password"
                            name="current"
                            type="password"
                            onChange={(event) =>
                              setNewPassword(event.target.value)
                            }
                          ></TextField>
                        </div>
                        <div></div>
                      </div>
                    }
                    isOpen={changePassword}
                    onClose={() => setChangePassword(false)}
                    onConfirm={() => changePasswordClicked()}
                  ></ConfirmationModal>
                </FloatingPortal>
                <FloatingPortal>
                  <ConfirmationModal
                    title="Edit Password"
                    body={
                      <TextField
                        label="Verification Code"
                        name="verification_code"
                        type="text"
                        className="w-full"
                        value={verificationCode}
                        onChange={(event) =>
                          setVerificationCode(event.target.value)
                        }
                        required
                      />
                    }
                    isOpen={passwordRecoveryRequested}
                    onClose={() => setPasswordRecoveryRequested(false)}
                    onConfirm={() => confirmPasswordClicked()}
                  ></ConfirmationModal>
                </FloatingPortal>
              </div>
            </main>
          </>
        )}
        {currentTab === '#billing' && (
          <>
            <main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Billing
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    View your membership plan and cancel if you need to stop.
                  </p>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Plan tier
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">
                        {wixPlan?.tier || 'Not Subscribed'}
                      </div>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Billing Frequency
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">
                        {wixPlan?.frequency || 'N/A'}
                      </div>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dd className="mt-1 flex justify-between gap-x-6 sm:flex-none sm:pr-6">
                      {!cancelRequested &&
                        wixPlan &&
                        wixPlan.tier != 'free' && (
                          <>
                            <Button
                              size="md"
                              color="red"
                              className="text-3xl text-white hover:text-gray-200"
                              onClick={() => {
                                setCancelRequested(true)
                                setCancellationFailed(false)
                              }}
                            >
                              Cancel Membership
                            </Button>
                          </>
                        )}
                      {wixPlan && wixPlan.tier == 'free' && (
                        <>
                          <Link href="/PlanSelect">
                            <Button
                              size="md"
                              className="bg-teal text-3xl text-white hover:text-gray-200"
                            >
                              Upgrade Membership
                            </Button>
                          </Link>
                        </>
                      )}
                      {cancelRequested && wixPlan && (
                        <>
                          <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                            <div className="text-gray-900">
                              Confirm Cancellation?
                            </div>
                          </dd>
                          <Button
                            size="md"
                            color="red"
                            className="text-3xl text-white hover:text-gray-200"
                            onClick={() => confirmCancelMembership()}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="md"
                            color="black"
                            className="text-3xl text-white hover:text-gray-200"
                            onClick={() => setCancelRequested(false)}
                          >
                            Go Back
                          </Button>
                        </>
                      )}
                      {membershipCancelled && (
                        <>
                          <div className="text-gray-900">
                            Membership successfully cancelled.
                          </div>
                        </>
                      )}
                      {cancellationFailed && (
                        <>
                          <div className="text-gray-900">
                            Membership could not be cancelled. Please try again.
                          </div>
                        </>
                      )}
                    </dd>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </>
  )
}
