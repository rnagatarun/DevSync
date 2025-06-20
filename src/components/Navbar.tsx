import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store.js";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";
import axios from "axios";
import { removeUser } from "../store/userSlice.js";

const Navbar = () => {
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser())
      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      {/* Left section - Logo */}
      <div className="flex-none">
        <Link to="/" className="btn btn-ghost">
          <img
            src="../../DevSync_White.png"
            alt="DevSync"
            className="h-32 w-auto"
          />
        </Link>
      </div>

      {/* Right section - User info and avatar */}
      <div className="flex-1 flex justify-end">
        {user._id && (
          <div className="flex items-center gap-4">
            <div className="py-4 text-center">{user.firstName}</div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Image"
                    src={user.photoUrl}
                    // "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
