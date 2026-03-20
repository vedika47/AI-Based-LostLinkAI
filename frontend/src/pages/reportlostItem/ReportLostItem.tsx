import { useForm } from "react-hook-form";
import { Spinner } from "flowbite-react";
import Modals from "../../components/modal/Modal"; // assuming this is your toast/modal component
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import {
  useCategoryQuery,
  useCreateLostItemMutation,
} from "../../redux/api/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosArrowDown } from "react-icons/io";

// Custom styles for DatePicker
const datePickerStyles = `
  .react-datepicker__input-container input {
    background-color: rgb(55 65 81) !important;
    border: 1px solid rgb(75 85 99) !important;
    color: white !important;
    border-radius: 0.5rem !important;
    padding: 0.625rem !important;
    font-size: 0.875rem !important;
    width: 100% !important;
    outline: none !important;
  }
  .react-datepicker__input-container input:focus {
    border-color: rgb(59 130 246) !important;
    box-shadow: 0 0 0 1px rgb(59 130 246) !important;
  }
  .react-datepicker__input-container input::placeholder {
    color: rgb(156 163 175) !important;
  }
`;

interface LostItemForm {
  lostItemName: string;
  description: string;
  imgUrl: string;
  location: string;
}

const ReportLostItem = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LostItemForm>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());

  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useCategoryQuery("");
  const [createLostItem, { isLoading: submitLoading }] = useCreateLostItemMutation();

  // Debug: see what categories API returns
  console.log("[DEBUG] Categories response:", {
    data: categoriesResponse?.data,
    loading: categoriesLoading,
    error: categoriesError,
  });

  const onSubmit = async (formData: LostItemForm) => {
    if (!selectedCategoryId) {
      toast.error("Please select a category");
      return;
    }

    if (!startDate) {
      toast.error("Please select a date");
      return;
    }

    const payload = {
      lostItemName: formData.lostItemName.trim(),
      description: formData.description.trim(),
      categoryId: selectedCategoryId,
      img: formData.imgUrl.trim(),
      location: formData.location.trim(),
      date: startDate ? startDate.toISOString() : new Date().toISOString(), // "YYYY-MM-DD"
    };

    console.log("[DEBUG] Submitting lost item:", payload);

    try {
      const response = await createLostItem(payload).unwrap();

      if (response?.success === false) {
        toast.error(response?.message || "Failed to report lost item");
      } else {
        toast.success("Lost item reported successfully!");
        reset();
        setSelectedCategoryId("");
        setStartDate(new Date());
      }
    } catch (err: any) {
      console.error("[ERROR] Report failed:", err);
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to report item. Please check your connection or try again.";
      toast.error(errorMessage);
    }
  };

  // Loading / error states for categories
  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <Spinner size="xl" />
        <span className="ml-3">Loading categories...</span>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  return (
    <>
      <style>{datePickerStyles}</style>
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="bg-gradient-to-br from-gray-800/90 via-gray-900/90 to-black/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Report Lost Item
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Lost item name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Lost item name
                  </label>
                  <input
                    {...register("lostItemName", { required: "Required" })}
                    type="text"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Phone / Laptop / Wallet"
                  />
                  {errors.lostItemName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lostItemName.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Description
                  </label>
                  <input
                    {...register("description", { required: "Required" })}
                    type="text"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Pink color, found in park..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Image url (optional)
                  </label>
                  <input
                    {...register("imgUrl")}
                    type="url"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Location
                  </label>
                  <input
                    {...register("location", { required: "Required" })}
                    type="text"
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Jalgaon, Maharashtra"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Date of loss
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-white">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 appearance-none cursor-pointer"
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a category
                      </option>

                      {categoriesResponse?.data?.length > 0 ? (
                        categoriesResponse.data.map((category: any) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No categories available</option>
                      )}
                    </select>
                    <IoIosArrowDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>

                  {!selectedCategoryId && (
                    <p className="text-red-500 text-sm mt-1">Category is required</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300
                  ${submitLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"}`}
              >
                {submitLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Submit Lost Item"
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <ToastContainer position="top-right" autoClose={4000} hideProgressBar theme="dark" />
    </>
  );
};

export default ReportLostItem;