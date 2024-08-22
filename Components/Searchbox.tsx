import { ChangeEvent } from "react"

type Props = {
    onSearchInput : (e : ChangeEvent<HTMLInputElement>) => void
}

const Searchbox = ({onSearchInput} : Props) => {
    return(
        <div className="search">
            <input type="text" placeholder="Search name and email here...." className="border-2 rounded-sm w-[350px] p-3" onChange={e => onSearchInput(e)}/>
        </div>
    )
}
export default Searchbox