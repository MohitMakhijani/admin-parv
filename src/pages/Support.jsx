import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Support() {
  const [queries, setQueries] = useState([]);
  const [userType, setUserType] = useState("Customer");

  useEffect(() => {
    fetchQueries();
  }, [userType]);

  const fetchQueries = async () => {
    try {
      const response = await axios.get(
        `/admin/nastrigo/SupportQuery?userType=${userType}`
      );
      console.log(response.data.data);
      setQueries(response.data.data);
    } catch (error) {
      console.error("Error fetching support queries:", error);
    }
  };

  const sendNotification = async (type) => {
    const title = prompt("Enter notification title:");
    const body = prompt("Enter notification body:");

    if (!title || !body) return;

    try {
      const endpoint =
        type === "Customer"
          ? "/admin/nastrigo/notify-all-customers"
          : "/admin/nastrigo/notify-all-sellers";

      await axios.post(endpoint, { title, body });
      alert("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const deletequery = async ({ id }) => {
    try {
      await axios.delete(`admin/nastrigo/delete-supportQuery/${id}`);
      toast.success("Deleted successfully!");
      fetchQueries(); // Refresh list after delete
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Support Queries</h1>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Customer">Customer Queries</option>
            <option value="Seller">Seller Queries</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => sendNotification(userType)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Send Notification to All {userType}s
          </button>
          <button
            onClick={() =>
              window.open(
                "https://docs.google.com/spreadsheets/d/1gT2WxidNB3tDrQbg3kADJ5ilDxDBy1PlYOFVO2ElF1o/edit?gid=0",
                "_blank"
              )
            }
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            See Google Sheet
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {queries.map((query) => (
            <div key={query._id} className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">
                    From: {query.senderId.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email-ID: {query.senderId.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {query.senderId.phoneNo}
                  </p>
                  <p className="mt-2">{query.message}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(query.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => deletequery({ id: query._id })}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {queries.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No queries found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Support;
