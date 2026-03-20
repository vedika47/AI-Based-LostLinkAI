import { useParams, Link } from "react-router-dom";
import { useGetSingleClaimQuery } from "../redux/api/api";
import { FaPhoneAlt, FaEnvelope, FaUser, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { Spinner } from "flowbite-react";

const ClaimDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: response, isLoading, error } = useGetSingleClaimQuery(id as string);

  // ✅ IMPORTANT: your API returns { success, data }
  const claim = response?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="text-center py-20 text-red-500 font-medium">
        Claim not found or error loading details
      </div>
    );
  }

  const { foundItem, status } = claim;
  const finder = foundItem?.user;
  const isApproved = status?.toUpperCase() === "APPROVED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboard/myClaimRequest"
          className="text-cyan-400 hover:underline mb-6 inline-block text-lg"
        >
          ← Back to My Claims
        </Link>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Claim Details</h1>

          {/* ✅ ITEM INFO FIXED */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-5">Item Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 text-gray-300">
                <p><strong>Name:</strong> {foundItem?.title || "—"}</p>

                <p><strong>Description:</strong> {foundItem?.description || "Not provided"}</p>

                <p><strong>Location:</strong> {foundItem?.location || "Not specified"}</p>

                <p>
                  <strong>Found on:</strong>{" "}
                  {foundItem?.foundDate
                    ? new Date(foundItem.foundDate).toLocaleDateString("en-IN")
                    : "—"}
                </p>
              </div>

              <div>
                {foundItem?.image ? (
                  <img
                    src={foundItem.image}
                    alt={foundItem.title || "Found item"}
                    className="w-full h-56 object-cover rounded-xl border border-gray-700 shadow-md"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-700 rounded-xl flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ FINDER INFO */}
          {isApproved ? (
            <div className="p-7 bg-green-950/40 border border-green-700/60 rounded-xl">
              <h2 className="text-2xl font-semibold text-green-300 mb-5 flex items-center gap-3">
                <FaCheckCircle className="text-green-400" />
                Claim Approved – Finder Contact
              </h2>

              <div className="space-y-4 text-gray-200 text-base">
                <p className="flex items-center gap-3">
                  <FaUser className="text-green-400" />
                  <strong>Name:</strong> {finder?.username || "—"}
                </p>

                <p className="flex items-center gap-3">
                  <FaEnvelope className="text-green-400" />
                  <strong>Email:</strong>{" "}
                  {finder?.email ? (
                    <a href={`mailto:${finder.email}`} className="text-cyan-300 hover:underline">
                      {finder.email}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                <p className="flex items-center gap-3">
                  <FaPhoneAlt className="text-green-400" />
                  <strong>Phone:</strong>{" "}
                  {finder?.phone ? (
                    <a href={`tel:${finder.phone}`} className="text-cyan-300 hover:underline">
                      {finder.phone}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                <p className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-green-400" />
                  <strong>Location:</strong> {foundItem?.location || "—"}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-7 bg-yellow-950/40 border border-yellow-700/60 rounded-xl text-center">
              <h3 className="text-xl font-semibold text-yellow-300 mb-4">
                Claim Status: {status || "Pending"}
              </h3>

              <p className="text-gray-300">
                Finder contact details will be shown here once the admin approves your claim.
              </p>

              {/* 🔥 OPTIONAL: show finder even before approval */}
              <div className="mt-4 text-sm text-gray-400">
                Posted by: {finder?.username || "Unknown"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetail;