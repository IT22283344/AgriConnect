import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Support() {
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchs = async () => {
      try {
        if (currentUser == null) {
          navigate("/");
        }

        const res = await fetch(`/api/user/getuser/${currentUser._id}`);
        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchs();
    console.log(users);
  }, []);

  return (
    <div className="text-xl p-5 font-semibold text-blue-400">
      <div>{users.province}</div>
      <div>{users.district}</div>
      <div>{users.town}</div>
    </div>
  );
}
