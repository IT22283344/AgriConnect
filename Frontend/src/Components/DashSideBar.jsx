import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArchive,
  HiArrowSmRight,
  HiOutlineUserGroup,
  HiUser,
  HiGift,
  HiHome,
  HiOutlineHome,
  HiChartSquareBar,
  HiOutlineBookmarkAlt,
  HiDesktopComputer,
  HiTicket,
  HiSpeakerphone,
  HiSupport,
  HiDocumentAdd,
  HiCurrencyDollar,
  HiLogout,
  HiBookmarkAlt,
  HiOutlineBookmark,
  HiOutlineGift,
} from "react-icons/hi";
import { HiBookmark, HiOutlineArchive } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { HomeRepairServiceSharp } from "@mui/icons-material";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sidebar className=" md:w-56 srstatic top-48 left-0 h-full w-56 shadow-lg bg-white border-r z-50 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile" key="profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={
                currentUser?.isAdmin
                  ? "Admin"
                  : currentUser?.role === "farmer"
                  ? "Farmer"
                  : "WholeAeller"
              }
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser?.isAdmin && (
            <>
              <Link to="/dashboard?tab=users" key="users">
                <Sidebar.Item
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=products" key="products">
                <Sidebar.Item
                  active={tab === "products"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Products
                </Sidebar.Item>
              </Link>
            </>
          )}
          
          {(currentUser?.isAdmin || currentUser?.role === "farmer") && (
            <>
              <Link to="/dashboard?tab=myproducts" key="myproducts">
                <Sidebar.Item
                  active={tab === "myproducts"}
                  icon={HiOutlineGift}
                  as="div"
                >
                  My Products
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=my_orders" key="orders">
                <Sidebar.Item
                  active={tab === "my_orders"}
                  icon={HiOutlineArchive}
                  as="div"
                >
                  My Orders
                </Sidebar.Item>
              </Link>
            </>
          )}

          {currentUser?.role === "wholeseller" && (
            <>
              <Link to="/dashboard?tab=my_s_orders" key="my_s_orders">
                <Sidebar.Item
                  active={tab === "my_s_orders"}
                  icon={HiOutlineArchive}
                  as="div"
                >
                  My Orders
                </Sidebar.Item>
              </Link>
            </>
          )}

         

          <hr />
          <Sidebar.Item
            icon={HiLogout}
            className="cursor-pointer"
            onClick={handleSignOut}
            key="signout"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
