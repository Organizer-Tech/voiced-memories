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
                        {!passwordRecoveryRequested &&
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
                            </div>}
                    </div>
                </AuthLayout>}
            {passwordRecoveryRequested && <PasswordRecoveryConfirmation email={email} newPassword={newPassword}></PasswordRecoveryConfirmation>}
        </>
    )
}

export default PasswordRecovery;