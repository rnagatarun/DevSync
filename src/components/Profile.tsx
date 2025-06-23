import type { RootState } from "../store/store";
import type { UserProps } from "../types/userprops";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state: RootState) => state.user) as UserProps;
  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};

export default Profile;
