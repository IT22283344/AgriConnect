import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [memberIDToDelete, setmemberIdToDelete] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
 

  useEffect(() => {
    const fetchs = async () => {
      try {
        if (currentUser == null) {
          Navigate("/");
        }

        const res = await fetch(`/api/user/getusers?searchTerm=${searchTerm}`);
        const data = await res.json();
        console.log(data)
        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchs();
    }
    
  }
  
  , [currentUser._id,searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteProduct = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/user/delete/${memberIDToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        window.location.href = "/dashboard?tab=users";
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  /*const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value); // Update the selected department
  };*/


  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search members.."
          value={searchTerm}
          onChange={handleSearch}
          className="px-3 py-2 w-1/2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-slate-800 placeholder-gray-500"
        />
      </div>

      {/* Radio Buttons */}
      <div className="flex justify-left items-center gap-4 mb-6 border border-gray-200 rounded-lg">
     

        {/*Department wise filtering
        {departments.map((department) => (
          <label key={department} className="flex items-center">
            <input
              type="radio"
              value={department}
              checked={selectedDepartment === department}
              onChange={handleDepartmentChange}
              className="mr-2"
            />
            {department}
          </label>
        ))}*/}
      </div>

      {/* Staff Table */}
      {(currentUser?.isAdmin) && users.length > 0 ? (
        <Table hoverable className="shadow-sm">
          <Table.Head >
            <Table.HeadCell>ID</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Contact Number</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>User Type</Table.HeadCell>
            <Table.HeadCell>Province</Table.HeadCell>
            <Table.HeadCell>Distrct</Table.HeadCell>
            <Table.HeadCell>Town</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Send mail</Table.HeadCell>
          </Table.Head>
          {users.filter((member) => {
            return (
              (searchTerm === "" ||
                member.username.toLowerCase().includes(
                  searchTerm.toLowerCase()
                ) ||
                member._id)
            );
          }).map((member) => (
            <Table.Body className="divide-y" key={member._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{member.userId}</Table.Cell>
                <Table.Cell>{member.username}</Table.Cell>
                <Table.Cell>{member.email}</Table.Cell>
                <Table.Cell>{member.mobile}</Table.Cell>
                <Table.Cell>{member.adress}</Table.Cell>
                <Table.Cell>{member.role}</Table.Cell>
                <Table.Cell>{member.province}</Table.Cell>
                <Table.Cell>{member.district}</Table.Cell>
                <Table.Cell>{member.town}</Table.Cell>
                <Table.Cell>
                  <span
                    className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={() => {
                      setShowModel(true);
                      setmemberIdToDelete(member._id);
                    }}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    className="text-teal-500 hover:underline"
                    to={`/dashboard?tab=sendemail&email=${member.username}`}
                  >
                    Send Mail
                  </Link>
                </Table.Cell>
                
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p className="text-center text-gray-500">
          You have no staff members to show
        </p>
      )}

      {/* Confirmation Modal */}
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
              Are you sure you want to delete this member?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteProduct}>
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
