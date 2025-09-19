import routes from "@src/router/index.js"
import { useLocation, useNavigate } from "react-router-dom"
const NotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigateBack = () => {
        if (location.state && location.state.from) {

            navigate(location.state.from);
        } else {
            navigate(routes.home);
        }
    }
    return (
        <div className="w-full h-full my-9 flex flex-col items-center justify-center">
            <img src="https://th.bing.com/th/id/R.367dfb7dfaa484969d113325cf55ae58?rik=L8Ex%2bybcrXp9Yw&pid=ImgRaw&r=0"
                className="w-1/4" alt="404 not found" />
            <div>
                <h2 className="text-2xl font-bold mt-5">Đường dẫn đã hết hạn truy cập hoặc không tồn tại</h2>
                <div className=" flex justify-center mt-6">
                    <div className="" >
                        <button onClick={handleNavigateBack}
                            className="bg-blue-500 hover:bg-blue-700 text-white text-3xl font-bold py-4 px-14 rounded-full">
                            Quay lại
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NotFound
