import { Button, Modal, Table, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useSelector } from "react-redux";


export default function DashMyOrders() {
  const { currentUser } = useSelector((state) => state.user);
  const [Order, setOrder] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [OrderIdToDelete, setOrderIdToDelete] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedCount, setCompleteStatus] = useState();
  const [searchName, setSearchName] = useState("");

console.log(currentUser.userId)
  //get total sales
    // const calculateTotalOrder = () => {
    //   const total = Order.reduce((accumulator, currentOrder) => {
    //     return accumulator + parseFloat(currentOrder.totalcost);
    //   }, 0);
    //   setTotalOrders(total);
    // };

  //fetch all the Order from database
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/getorders`);
        const data = await res.json();
  console.log(data)
        if (res.ok) {
          // Filter the orders to match the current user's email
          const userOrders = data.filter(order => order.farmerId === currentUser.userId);
  
          const completedCount = userOrders.filter(order => order.status === true).length;
          console.log("Completed Orders:", completedCount);
          setCompleteStatus(completedCount);
  
          setTotalOrders(userOrders.length);
          setOrder(userOrders);
  
          // Disable "Show More" button if fewer than 9 orders
          if (userOrders.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log("error in fetching", error);
      }
    };
  
    // Only fetch orders if there is a valid currentUser
    if (currentUser) {
      fetchOrder();
    }
  }, [currentUser]); // Run effect when currentUser changes
   // Removed Order from dependency array

  //delete Order by id
  const handleDeleteOrder = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/Orders/deleteorder/${OrderIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setOrder((prev) =>
          prev.filter((Orders) => Orders._id !== OrderIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };



  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex flex-wrap gap-5">
        
      </div>
      <h1 className="pt-6 px-4 font-semibold">My Orders</h1>
      {Array.isArray(Order) && Order.length > 0 ? (
        <>
          <div className="flex ">
            {/* <TextInput
              type="text"
              placeholder="Search a Order by (First Name or Email or Room Number)"
              required
              id="title"
              className="flex-1"
              style={{
                width: 700,
                marginTop: 30,
                marginBottom: 30,
                marginLeft: 250,
              }}
              onChange={(e) => setSearchName(e.target.value)}
            /> */}
          </div>

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Order</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Contact Number</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Delivery Fee</Table.HeadCell>
              <Table.HeadCell>Cost for order</Table.HeadCell>
              <Table.HeadCell>Order Status</Table.HeadCell>
            </Table.Head>

            {Order.filter((item) => {
              const searchQuery = searchName.toLowerCase();

              // Safely check if name and email exist before calling toLowerCase()
              const productname = item.productname ? item.productname.toLowerCase().includes(searchQuery) : false;
              const email = item.email ? item.email.toLowerCase().includes(searchQuery) : false;
            
              // Return true if any of the search criteria match
              return productname || email;

            }).map((item) => (
              <Table.Body className="divide-y" key={item._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{item.productsId.map(product => (
                    <p key={product._id} className="font-semibold">{product.productname}</p>
                  ))}</Table.Cell>
                  <Table.Cell>{item.first_name} {item.last_name}</Table.Cell>
                  <Table.Cell>{item.phone}</Table.Cell>
                  <Table.Cell>{item.address} {item.state}</Table.Cell>
                  <Table.Cell>{item.deliveryfee}</Table.Cell>
                  <Table.Cell>{item.totalcost}</Table.Cell>
                  <Table.Cell>
                  {item.status ? (
                      <span className="text-green-500 font-semibold">Completed</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Pending</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>

          {showMore && (
            <button
              onClick=""
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have not any Order yet</p>
      )}

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to Delete this Record
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteOrder}>
              Yes, I am sure
            </Button>
            <Button color="gray" onClick={() => setShowModel(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
