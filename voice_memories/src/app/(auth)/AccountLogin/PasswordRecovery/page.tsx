import { Account } from "@/components/utils/Account"
import PasswordRecovery from "@/components/pages/auth/PasswordRecovery"

export default function AccountLogin() {
    return (
        <>
            <Account>
                <PasswordRecovery />
            </Account>
        </>
    )
}