import * as React from "react"
import LoginModal from "@/components/modals/login.modal"

interface Props {
    children?: React.ReactNode
}

const Template: React.FC<Props> = ({ children }) => {
    
    return <div>
        <div>
            Header stuff
            <LoginModal/>
        </div>

        {children}

        <div>Footer stuff</div>
    </div>

}

export default Template