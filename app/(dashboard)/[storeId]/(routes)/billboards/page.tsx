import { BillBoardClient } from "./components/client";



const BillboardPage = () => {
    return (
        <div className="flex-col">
            <div className="flex-1 space-x-4 p-8 pt-6">
               <BillBoardClient/>  
            </div>
        </div>
    )
}

export default BillboardPage;