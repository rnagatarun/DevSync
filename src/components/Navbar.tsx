import { useSelector } from "react-redux";
import type { RootState } from "../store/store.js";

const Navbar = () => {
  const user = useSelector((store: RootState) => store.user);
  return (
    <div className="navbar bg-base-300 shadow-sm">
      {/* Left section - Logo */}
      <div className="flex-none">
        <a className="btn btn-ghost">
          <img
            src="../../DevSync_White.png"
            alt="DevSync"
            className="h-32 w-auto"
          />
        </a>
      </div>

      {/* Right section - User info and avatar */}
      <div className="flex-1 flex justify-end">
        {user._id && (
          <div className="flex items-center gap-4">
            <div className="py-4 text-center">Welcome {user.firstName}</div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="User Image"
                    src= {user.photoUrl}
                    // "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
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
