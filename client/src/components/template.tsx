import * as React from "react"

interface Props {
    children?: React.ReactNode
}

const Template: React.FC<Props> = ({ children }) => {
    
    return <div>
        <div>
            Header stuff
        </div>

        {children}

        <div>Footer stuff</div>
    </div>

}

export default Template