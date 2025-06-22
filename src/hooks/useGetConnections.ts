import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addConnections } from "../store/connectionsSlice";

const useGetConnections = () => {
    const dispatch = useDispatch();
    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + "/user/connections", {
                withCredentials: true,
            });
            dispatch(addConnections(res.data.data));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchConnections();
    }, []);

}

export default useGetConnections
