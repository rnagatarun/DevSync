import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../store/userSlice";
import { useEffect } from "react";
import type { RootState } from "../store/store";

export const useProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector((store: RootState) => store.user)

    const fetchData = async () => {
        if (userData._id) {
            return;
        }
        try {
            const response = await axios.get(BASE_URL + "/profile/view", {
                withCredentials: true
            });
            dispatch(addUser(response.data.data))
        }
        catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                navigate("/login")
            }
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (!userData._id) {
            navigate("/login");
        }
    }, [userData._id, navigate])

}
