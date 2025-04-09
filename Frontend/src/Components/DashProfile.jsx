import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import {
  HiOutlineExclamationCircle,
  HiPencil,
  HiEye,
  HiEyeOff,
  HiQuestionMarkCircle,
  HiOutlineLogout,
  HiOutlineTrash,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import logo from "../assets/agrilogo.png";

export default function DashProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const filePickerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size should be less than 5MB");
        return;
      }
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageError(null);
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Image upload failed. Please try again.");
        console.error("Upload error:", error);
        setImagePercent(null);
        setImage(null);
        setImageFileUrl(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        } catch (error) {
          console.error("Error getting download URL:", error);
          setImageError("Error uploading image");
          setImagePercent(null);
          setImage(null);
          setImageFileUrl(null);
        }
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes detected");
      return;
    }

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        setUpdateSuccess(null);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess("Profile updated successfully!");
      setUpdateUserError(null);
      // Clear form data after successful update
      setFormData({});
    } catch (error) {
      dispatch(updateUserFailure(error));
      setUpdateUserError(error.message);
      setUpdateSuccess(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-lime-500 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex flex-row gap-2">
              <img
                className="h-18 w-16 rounded-lg shadow-md"
                src={logo}
                alt="Agri Connect Logo"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  My Profile{" "}
                  <span className="text-yellow-200">
                    ({currentUser.role.toUpperCase()})
                  </span>
                </h1>
                <p className="mt-1 text-green-100">
                  Manage your account settings
                </p>
              </div>
            </div>
            <Button
              gradientDuoTone="cyanToBlue"
              pill
              className="mt-4 md:mt-0 flex items-center"
            >
              <HiQuestionMarkCircle className="mr-2" />
              Help Center
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Profile Picture */}
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={filePickerRef}
                      hidden
                    />
                    <div
                      className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer group"
                      onClick={() => filePickerRef.current.click()}
                    >
                      {imagePercent > 0 && imagePercent < 100 && (
                        <CircularProgressbar
                          value={imagePercent}
                          text={`${imagePercent}%`}
                          strokeWidth={5}
                          styles={{
                            root: {
                              width: "100%",
                              height: "100%",
                              position: "absolute",
                              zIndex: 10,
                            },
                            path: {
                              stroke: `rgba(72, 187, 120, ${
                                imagePercent / 100
                              })`,
                            },
                          }}
                        />
                      )}
                      <div className="absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-md group-hover:border-green-300 transition-all duration-200">
                        <img
                          src={imageFileUrl || currentUser.profilePicture}
                          alt="Profile"
                          className={`w-full h-full object-cover ${
                            imagePercent && imagePercent < 100
                              ? "opacity-60"
                              : ""
                          }`}
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full shadow-lg transform translate-x-1 translate-y-1 group-hover:scale-110 transition-all">
                        <HiPencil className="text-lg" />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-4 text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
                      onClick={() => filePickerRef.current.click()}
                    >
                      <HiPencil className="mr-1" />
                      Change profile photo
                    </button>

                    {imageError && (
                      <p className="mt-2 text-sm text-red-500">{imageError}</p>
                    )}

                    <div className="mt-6 w-full space-y-3">
                      <Button
                        onClick={handleSignOut}
                        color="light"
                        className="w-full flex items-center justify-center text-red-500 hover:bg-red-50"
                      >
                        <HiOutlineLogout className="mr-2" />
                        Sign Out
                      </Button>
                      <Button
                        onClick={() => setShowModel(true)}
                        color="light"
                        className="w-full flex items-center justify-center text-red-500 hover:bg-red-50"
                      >
                        <HiOutlineTrash className="mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="w-full lg:w-2/3">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label
                        htmlFor="userId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        User ID
                      </Label>
                      <TextInput
                        id="userId"
                        type="text"
                        defaultValue={currentUser.userId}
                        disabled
                        className="w-full bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Username
                      </Label>
                      <TextInput
                        id="username"
                        type="text"
                        placeholder="Username"
                        defaultValue={currentUser.username}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </Label>
                      <TextInput
                        id="email"
                        type="email"
                        defaultValue={currentUser.email}
                        disabled
                        className="w-full bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="mobile"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Contact Number
                      </Label>
                      <TextInput
                        id="mobile"
                        type="tel"
                        placeholder="Phone number"
                        defaultValue={currentUser.mobile}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label
                      htmlFor="adress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </Label>
                    <TextInput
                      id="adress"
                      type="text"
                      placeholder="Full address"
                      defaultValue={currentUser.adress}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label
                        htmlFor="province"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Province
                      </Label>
                      <TextInput
                        id="province"
                        type="text"
                        placeholder="Province"
                        defaultValue={currentUser.province}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="district"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        District
                      </Label>
                      <TextInput
                        id="district"
                        type="text"
                        placeholder="District"
                        defaultValue={currentUser.district}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="town"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Town
                      </Label>
                      <TextInput
                        id="town"
                        type="text"
                        placeholder="Town"
                        defaultValue={currentUser.town}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        onChange={handleChange}
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <HiEyeOff className="h-5 w-5" />
                        ) : (
                          <HiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Leave blank to keep current password
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      gradientDuoTone="greenToBlue"
                      disabled={loading}
                      className="px-5 py-1.5 hover:animate-pulse border border-lime-700 font-bold"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          {/* Success and Error Messages */}
          {updateSuccess && (
            <div className="mt-6">
              <Alert color="success" className="rounded-lg">
                <span className="font-medium">{updateSuccess}</span>
              </Alert>
            </div>
          )}

          {updateUserError && (
            <div className="mt-6">
              <Alert color="failure" className="rounded-lg">
                <span className="font-medium">{updateUserError}</span>
              </Alert>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header className="border-b-0" />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Your Account
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 px-6 py-2.5"
              >
                Yes, delete it
              </Button>
              <Button
                color="light"
                onClick={() => setShowModel(false)}
                className="border border-gray-300 hover:bg-gray-50 px-6 py-2.5"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
