import { useState } from "react";
import {
  Alert,
  Button,
  Label,
  TextInput,
  Spinner,
  Select,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import OAuthenticate from "../Components/OAuthenticate";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.mobile ||
      !formData.adress ||
      !formData.province ||
      !formData.district ||
      !formData.town ||
      !formData.role
    ) {
      return setError("Please Fill all Fields");
    }

    try {
      setLoading(true);
      setError(false);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const provinceDistricts = {
    western: ["Colombo", "Gampaha", "Kalutara"],
    north: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    eastern: ["Batticaloa", "Ampara", "Trincomalee"],
    northwestern: ["Kurunegala", "Puttalam"],
    central: ["Kandy", "Matale", "Nuwara Eliya"],
    southern: ["Galle", "Matara", "Hambantota"],
    uva: ["Badulla", "Monaragala"],
    northcentral: ["Anuradhapura", "Polonnaruwa"],
    sabaragamuwa: ["Ratnapura", "Kegalle"],
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict(""); // Reset district when province changes
  };

  return (
    <div
      className="min-h-screen flex  justify-end"
      style={{
        backgroundImage: `url('https://media.istockphoto.com/id/1330779781/photo/farmer-holding-a-money-bag-on-the-background-of-carrot-plantations-agricultural-startups.jpg?s=612x612&w=0&k=20&c=9gU0pc3BRAbHHLyOxUevK-N1cjVRlpkxltG-wfEl4ec=')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="p-6 max-w-lg w-full bg-white bg-opacity-70 rounded-lg items-center shadow-lg m-16 mr-32 mb-72">
        <p className="text-center text-3xl mb-5 font-Lavish font-semibold">
          Sign Up
        </p>
        <form
          className="grid grid-cols-2 md:grid-cols-2 gap-4  "
          onSubmit={handleSubmit}
        >
          <div>
            <Label value="Your username" />
            <TextInput
              type="text"
              placeholder="Username"
              id="username"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Your email" />
            <TextInput
              type="email"
              placeholder="name@company.com"
              id="email"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Role" />
            <Select
              type="text"
              placeholder="Role"
              id="role"
              onChange={handleChange}
            >
              <option value=""> Select</option>
              <option value="farmer">Farmer</option>
              <option value="wholeseller">Whole Seller </option>
            </Select>
          </div>

          <div>
            <Label value="Your Address" />
            <TextInput
              type="text"
              placeholder="Address"
              id="adress"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label value="Your mobile number" />
            <TextInput
              type="text"
              placeholder="Mobile Number"
              id="mobile"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Province</label>
            <Select
              id="province"
              onChange={handleProvinceChange}
              value={selectedProvince}
            >
              <option value="">Select</option>
              {Object.keys(provinceDistricts).map((province) => (
                <option key={province} value={province}>
                  {province.charAt(0).toUpperCase() + province.slice(1)}{" "}
                  Province
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label>District</label>
            <Select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
            >
              <option value="">Select</option>
              {selectedProvince &&
                provinceDistricts[selectedProvince]?.map((district) => (
                  <option key={district} value={district.toLowerCase()}>
                    {district} District
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <Label value="Town " />
            <TextInput
              type="text"
              placeholder="Town"
              id="town"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label value="Your password" />
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute top-2 right-3 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.5c5.185 0 9.448 4.014 9.95 9.048a.944.944 0 0 1 0 .904C21.448 16.486 17.185 20.5 12 20.5S2.552 16.486 2.05 13.452a.944.944 0 0 1 0-.904C2.552 8.514 6.815 4.5 12 4.5zM12 6a9 9 0 0 0-8.72 6.752.944.944 0 0 1 0 .496A9 9 0 0 0 12 18a9 9 0 0 0 8.72-4.752.944.944 0 0 1 0-.496A9 9 0 0 0 12 6z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 12.75a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 15a7 7 0 01-7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <Button disabled={loading} type="submit" className="bg-slate-500">
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Have an Account?</span>
          <Link to="/sign-in" className="text-blue-500">
            Sign In
          </Link>
        </div>
        <OAuthenticate />

        <div className="text-red-600">
          {error && (
            <Alert className="mt-5" color="failure">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
