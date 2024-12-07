'use client'

import { useState, useContext } from "react";
import { AuthLayout } from "../AuthLayout";
import { TextField } from "../Fields";
import { Button } from "@/components/pages/Button"
import CodeVerification from "./CodeVerification";
import { AccountContext } from "@/components/utils/Account";
import PasswordRecoveryConfirmation from "./PasswordRecoveryConfirmation";

function PasswordRecovery() {
    const [email, setEmail] = useState("");
    const [altEmail, setAltEmail] = useState("");
    const [useAltEmail, setUseAltEmail] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [passwordRecoveryRequested, setPasswordRecoveryRequested] = useState(false);
    const { requestPasswordReset } = useContext(AccountContext);

    const resetPassword = () => {
        requestPasswordReset(email);
        setPasswordRecoveryRequested(true);
    }

    return (
        <>
            {!passwordRecoveryRequested &&
                <AuthLayout
                    title="Recover Your Password"
                    subtitle={
                        <>
                            Please enter your email and new password to begin the password recovery process.
                        </>
                    }>
                    <div>
                        {!passwordRecoveryRequested && !useAltEmail &&
                            <div className="space-y-6">
                                <TextField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                ></TextField>
                                <TextField
                                    label="New Password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    required
                                >
                                </TextField>
                                <Button color="cyan" className="mt-8 w-full" onClick={() => resetPassword()}>Submit</Button>
                                <Button
                                    color="gray"
                                    className="mt-8 w-full"
                                    onClick={() => (setUseAltEmail(true))}
                                > Use alternate email address
                                </Button>
                            </div>}
                        {!passwordRecoveryRequested && useAltEmail &&
                            <div className="space-y-6">
                                <TextField
                                    label="Alternate Email Address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={altEmail}
                                    onChange={(event) => setAltEmail(event.target.value)}
                                    required
                                ></TextField>
                                <TextField
                                    label="New Password"
                                    name="password"
                                    type="password"
                                    autoComplete="password"
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    required
                                ></TextField>
                                <Button color="cyan" className="mt-8 w-full">Submit</Button>
                                <Button
                                    color="gray"
                                    className="mt-8 w-full"
                                    onClick={() => setUseAltEmail(false)}
                                > Use primary email address
                                </Button>
                            </div>}
                    </div>
                </AuthLayout>}
            {passwordRecoveryRequested && <PasswordRecoveryConfirmation email={email} newPassword={newPassword}></PasswordRecoveryConfirmation>}
        </>
    )
}

export default PasswordRecovery;
