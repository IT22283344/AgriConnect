import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProducts, setUserProducts] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts`);
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setUserProducts(data.products);
        } else {
          console.error("Error fetching products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

        fetchMyProducts();
    
  }, [currentUser]);

  const handleDeleteMyProduct = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/product/deleteproduct/${productIdToDelete}/${currentUser.userId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProducts((prev) =>
          prev.filter((product) => product._id !== productIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-green-700 pb-4">Products</h1>
      {Array.isArray(userProducts) && userProducts.length  > 0 ? (
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white p-4">
          <Table hoverable>
            <Table.Head className="bg-black text-black">
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Product Name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Price (Rs.)</Table.HeadCell>
              <Table.HeadCell>Quantity</Table.HeadCell>
              <Table.HeadCell>Availability</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userProducts.map((product) => (
                <Table.Row
                  key={product._id}
                  className="bg-gray-50 hover:bg-gray-100 transition-all"
                >
                  <Table.Cell>{new Date(product.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className="font-medium text-gray-900">
                    {product.productname}
                  </Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell className="text-green-700 font-semibold">
                    Rs. {product.price}
                  </Table.Cell>
                  <Table.Cell>
                    {product.quantity} {product.unit.toUpperCase()}
                  </Table.Cell>
                  <Table.Cell>
                    {product.isAvailable ? (
                      <span className="text-green-600 font-medium">Available</span>
                    ) : (
                      <span className="text-red-600 font-medium">Not Available</span>
                    )}
                  </Table.Cell>
                  
                  <Table.Cell className="flex gap-3">
                  
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => {
                        setShowModel(true);
                        setProductIdToDelete(product._id);
                      }}
                    >
                      Delete
                    </button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">No products available.</p>
      )}

      <Modal show={showModel} onClose={() => setShowModel(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mx-auto mb-4" />
            <h3 className="mb-5 text-lg text-gray-700">
              Are you sure you want to delete this product?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={() => {
              handleDeleteMyProduct(productIdToDelete);
              setShowModel(false);
            }}>
              Yes, delete
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
