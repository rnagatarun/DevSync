import axios from "axios";
import { useEffect } from "react";
import { addRequests } from "../store/requestSlice";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";

const useRequest = () => {
    const dispatch = useDispatch();

    const fetchRequests = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/requests/received", {
                withCredentials: true,
            });

            dispatch(addRequests(res.data.data));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

}

export default useRequest
