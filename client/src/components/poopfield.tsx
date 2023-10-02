import * as React from "react"

const Poopfield: React.FC = () => {
    const [value, setValue] = React.useState('');
    return <React.Fragment>
        <input onChange={(e) => {setValue(e.target.value)}}/>
        <p>{value}</p>
    </React.Fragment>
}

export default Poopfield;