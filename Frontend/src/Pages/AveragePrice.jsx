import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Label, Select, Table } from "flowbite-react";

export default function AddProduct() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log(currentUser);
  const [formData, setFormData] = useState({
    productname: "",
    category: "",
    description: "",
    price: "",
    unit: "",
    quantity: "",
    discountedPrice: 0,
    images: [],
    productSlug: "",
  });

  console.log(formData);
  console.log("User ID being sent:", currentUser?.userId);

  
  const [priceData, setPriceData] = useState({
    averagePrices: [],
    districtPrices: [],
  });
  const [activeTab, setActiveTab] = useState("district");
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setPriceLoading(true);
        const res = await fetch(`/api/product/getProductavgprices`);
        const data = await res.json();

        if (res.ok) {
          setPriceData({
            averagePrices: data.averagePrices || [],
            districtPrices: data.districtPrices || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch price data:", error);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  return (
    <main className=" max-w-4xl mx-auto border rounded-lg m-5 p-4 shadow-lg">
      
      <section className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Market Price Reference</h2>

        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "average"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("average")}
          >
            Product Averages
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "district"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("district")}
          >
            District Prices
          </button>
        </div>

        {priceLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === "average" ? (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Product</Table.HeadCell>
                <Table.HeadCell>Avg Price (Rs.)</Table.HeadCell>
                <Table.HeadCell>Unit</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {priceData.averagePrices.length > 0 ? (
                  priceData.averagePrices.map((item, index) => (
                    <Table.Row key={`avg-${index}`}>
                      <Table.Cell className="font-medium">
                        {item.productname}
                      </Table.Cell>
                      <Table.Cell>{item.averagePrice?.toFixed(2)}</Table.Cell>
                      <Table.Cell>{item.unit}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={3} className="text-center py-4">
                      No average price data available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>District</Table.HeadCell>
                <Table.HeadCell>Product</Table.HeadCell>
                <Table.HeadCell>Price (Rs.)</Table.HeadCell>
                <Table.HeadCell>Unit</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {priceData.districtPrices.length > 0 ? (
                  priceData.districtPrices.map((item, index) => (
                    <Table.Row key={`dist-${index}`}>
                      <Table.Cell className="font-medium">
                        {item.district}
                      </Table.Cell>
                      <Table.Cell>{item.productname}</Table.Cell>
                      <Table.Cell>{item.averagePrice?.toFixed(2)}</Table.Cell>
                      <Table.Cell>Per - {item.unit}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan={4} className="text-center py-4">
                      No district price data available
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </div>
        )}
      </section>
    </main>
  );
}

// In your return statement, replace the price section with:
