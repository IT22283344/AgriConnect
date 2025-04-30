import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
} from "flowbite-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiShoppingBag, HiUser, HiMenu } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import logo from "../assets/agrilogo.png";
import "./Header.css"; // Import custom CSS for animations

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };
  console.log(currentUser);

  return (
    <Navbar className="sticky top-0 z-50 bg-gradient-to-br from-lime-700 to-green-900 text-white p-4 shadow-lg ">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo & Brand Name */}
        <Link to="/" className="flex items-center gap-2">
          <img
            className="h-12 w-14 rounded-lg shadow-md"
            src={logo}
            alt="Agri Connect Logo"
          />
          <span className="text-2xl font-bold italic text-white drop-shadow-md">
            Agri Connect+
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6 font-medium text-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/productpage"
            className={({ isActive }) =>
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            Category
          </NavLink>
          <NavLink
            to="/aboutus"
            className={({ isActive }) =>
              isActive ? "nav-link-active" : "nav-link"
            }
          >
            About Us
          </NavLink>
          {currentUser?.role === "farmer" ? (
            <NavLink
              to={`/support/${currentUser.slug}`}
              className={({ isActive }) =>
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Weather
            </NavLink>
          ) : (
            <NavLink
              to={`/averageprice`}
              className={({ isActive }) =>
                isActive ? "nav-link-active" : "nav-link"
              }
            >
              Average Prices
            </NavLink>
          )}

        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-4">
        {currentUser?.role==="wholeseller" && (
              <Link to="/cart">
                <div className="flex relative">
                  <HiShoppingBag className="mr-1 text-white" style={{ fontSize: '24px' }} />
                </div>
              </Link>
            )}

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={currentUser.profilePicture}
                  rounded
                  className="h-10 w-10"
                />
              }
            >
              <DropdownHeader>
                <span className="block text-sm font-semibold">
                  {currentUser.username}
                </span>
                <span className="block text-sm text-gray-400">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              <Link to="/dashboard?tab=profile">
                <DropdownItem>Profile</DropdownItem>
              </Link>
              <DropdownDivider />
              <DropdownItem onClick={handleSignOut} className="text-red-500">
                Sign Out
              </DropdownItem>
            </Dropdown>
          ) : (
            <Link
              to="/sign-in"
              className="p-2 bg-yellow-400 text-green-900 rounded-lg shadow-md hover:bg-yellow-300 transition"
            >
              <HiUser className="text-2xl" />
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <Navbar.Toggle>
            <HiMenu className="text-white text-3xl cursor-pointer" />
          </Navbar.Toggle>
        </div>
      </div>

      {/* Mobile Navigation */}
      <Navbar.Collapse>
        <div className="flex flex-col space-y-3 pb-4 text-center text-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-300"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/category"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-300"
            }
          >
            Category
          </NavLink>
          <NavLink
            to="/product-page"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-300"
            }
          >
            Inventory
          </NavLink>
          <NavLink
            to="/posted-announcements"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-300"
            }
          >
            Announcements
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              isActive ? "text-yellow-400" : "hover:text-yellow-300"
            }
          >
            Support
          </NavLink>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
