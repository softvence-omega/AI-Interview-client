import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Swal from "sweetalert2";

const LandingPageManage = () => {
  const [loading, setLoading] = useState(false);
  const [companyLogos, setCompanyLogos] = useState([]);
  const [deletingIndices, setDeletingIndices] = useState(new Set());

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  console.log(errors);

  const {
    fields: featureCards,
    append: appendFeatureCard,
    remove: removeFeatureCard,
  } = useFieldArray({
    control,
    name: "features.cards",
  });

  const {
    fields: guideCards,
    append: appendGuideCard,
    remove: removeGuideCard,
  } = useFieldArray({
    control,
    name: "guide.guideCards",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/v1/landingPage/landingpagedata"
        );

        const pageData = res.data.data[0] || {}; // <-- extract first object from array
        setCompanyLogos(pageData?.banner?.companyList || []);

        // Clean the API response to match form structure
        const cleanedData = {
          banner: {
            title: pageData.banner?.title || "",
            detail: pageData.banner?.detail || "",
          },
          features: {
            title: pageData.features?.title || "",
            detail: pageData.features?.detail || "",
            cards: pageData.features?.cards?.length
              ? pageData.features.cards.map((card) => ({
                  title: card.title || "",
                  detail: card.detail || "",
                }))
              : [{ title: "", detail: "" }],
          },
          guide: {
            title: pageData.guide?.title || "",
            detail: pageData.guide?.detail || "",
            guideCards: pageData.guide?.guideCards?.length
              ? pageData.guide.guideCards.map((card) => ({
                  title: card.title || "",
                  detail: card.detail || "",
                }))
              : [{ title: "", detail: "" }],
          },
          aiCorner: {
            title: pageData.aiCorner?.title || "",
            detail: pageData.aiCorner?.detail || "",
          },
        };

        reset(cleanedData);

        // Reset and append Feature cards (optional - since reset should handle it)
        if (pageData.features?.cards?.length > 0) {
          setValue("features.cards", []);
          pageData.features.cards.forEach((card) => {
            appendFeatureCard({
              title: card.title || "",
              detail: card.detail || "",
            });
          });
        }

        // Reset and append Guide cards (optional)
        if (pageData.guide?.guideCards?.length > 0) {
          setValue("guide.guideCards", []);
          pageData.guide.guideCards.forEach((card) => {
            appendGuideCard({
              title: card.title || "",
              detail: card.detail || "",
            });
          });
        }
      } catch (err) {
        console.error("Failed to fetch landing page data", err);
        toast.error("Failed to fetch landing page data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reset, appendFeatureCard, appendGuideCard, setValue]);


  const handleDeleteLogo = async (index) => {
    const result = await Swal.fire({
      title: `Delete This Logo?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#37B874",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    setDeletingIndices((prev) => new Set([...prev, index]));
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/landingPage/company-logo/${index}`
      );
      setCompanyLogos(response.data.banner.companyList);
      toast.success(`Logo ${index + 1} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete logo", error);
      toast.error("Failed to delete logo");
    } finally {
      setDeletingIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };




  const onSubmit = async (data) => {
    try {
      // Fetch current data to merge with updated fields
      const currentDataRes = await axios.get(
        "http://localhost:5000/api/v1/landingPage/landingpagedata"
      );
      const currentData = currentDataRes.data.data;

      // Merge current data with form data to ensure all fields are included
      const mergedData = {
        banner: { ...currentData.banner, ...data.banner },
        features: {
          ...currentData.features,
          ...data.features,
          cards: data.features.cards,
        },
        guide: {
          ...currentData.guide,
          ...data.guide,
          guideCards: data.guide.guideCards,
        },
        aiCorner: { ...currentData.aiCorner, ...data.aiCorner },
      };

      const form = new FormData();
      form.append("data", JSON.stringify(mergedData));

      const companyFiles = document.querySelector(
        'input[name="companyList"]'
      )?.files;
      if (companyFiles?.length) {
        Array.from(companyFiles).forEach((file) => {
          form.append("companyList", file);
        });
      }

      featureCards.forEach((_, index) => {
        const input = document.querySelector(
          `input[name="featureCardImage-${index}"]`
        );
        if (input?.files[0]) {
          form.append("featureCardImages", input.files[0]);
        }
      });

      await axios.put("http://localhost:5000/api/v1/landingPage/update", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // NEW: Refresh company logos after update
      const updatedData = await axios.get(
        "http://localhost:5000/api/v1/landingPage/landingpagedata"
      );
      setCompanyLogos(updatedData.data.data[0]?.banner?.companyList || []);
      toast.success("Landing page updated successfully!");
      alert("Landing page updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed.");
      toast.error("Update failed.");
    }
  };

  return (
    <div className="max-w-full mx-auto p-2 md:p-6 lg:p-6 rounded-md text-gray-900">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#37B874] border-solid"></div>
        </div>
      )}

      <h1 className="text-[#212121] text-[28px] font-semibold text-center">
        Manage Your Landing Page
      </h1>
      <p className="text-[#3A4C67] text-[12px] mt-4 px-6">
        <span className="text-[#878788]">Settings</span>/ Landing Page
        Management
      </p>
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Banner */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 border-gray-300">
              Banner
            </h3>
            <p className="text-xs text-gray-400 pb-1">Banner Title</p>
            <input
              {...register("banner.title")}
              placeholder="Banner Title"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 pb-1 mt-3">
              Banner Descriptions
            </p>
            <textarea
              {...register("banner.detail")}
              placeholder="Banner Detail"
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </section>

          {/* Company Logos */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 border-gray-300">
              Company Logos
            </h3>

            {/* Show existing logos */}
            {/* <div className="flex flex-wrap gap-4 mt-4">
              {companyLogos.map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt={`Company Logo ${index + 1}`}
                  className="h-16 w-32 md:w-36 lg:w-40 object-contain rounded shadow border"
                />
              ))}
            </div> */}

            {/* NEW: Updated logo display with delete button */}
            <div className="flex flex-wrap gap-4 mt-4">
              {companyLogos.length === 0 ? (
                <p className="text-gray-500 text-sm">No company logos uploaded.</p>
              ) : (
                companyLogos.map((logo, index) => (
                  <div
                    key={index}
                    className="relative h-16 w-32 md:w-36 lg:w-40 rounded shadow border bg-white flex items-center justify-center"
                  >
                    <img
                      src={logo}
                      alt={`Company Logo ${index + 1}`}
                      className="h-full w-full object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteLogo(index)}
                      disabled={deletingIndices.has(index)}
                      className={`absolute top-1 right-1 p-1 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition-colors ${
                        deletingIndices.has(index) ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      title={`Delete Logo ${index + 1}`}
                    >
                      {deletingIndices.has(index) ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      ) : (
                        <span>✕</span>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            <input
              type="file"
              name="companyList"
              multiple
              className="block mt-6 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-green-700 hover:file:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </section>

          {/* Features */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 border-gray-300">
              Features
            </h3>
            <p className="text-xs text-gray-400 pb-1">Feature Title</p>
            <input
              {...register("features.title")}
              placeholder="Features Title"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 pb-1 mt-3">
              Feature Descriptions
            </p>
            <textarea
              {...register("features.detail")}
              placeholder="Features Detail"
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <div className="mt-5 space-y-4">
              {featureCards.map((card, index) => (
                <div key={card.id} className="rounded p-6 bg-gray-50 relative">
                  <p className="text-xs text-gray-400 pb-1">Card Title</p>
                  <input
                    {...register(`features.cards.${index}.title`)}
                    placeholder="Card Title"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-400 pb-1 mt-3">
                    Card Descriptions
                  </p>
                  <textarea
                    {...register(`features.cards.${index}.detail`)}
                    placeholder="Card Detail"
                    rows={3}
                    className="border border-gray-300 rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <input
                    type="file"
                    name={`featureCardImage-${index}`}
                    className="mt-3 block text-gray-600 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-green-700 hover:file:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeatureCard(index)}
                    className="absolute top-0 right-0 px-2 py-1 text-red-600 font-semibold hover:bg-red-600 hover:text-white rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendFeatureCard({ title: "", detail: "" })}
                className="text-green-600 font-semibold hover:underline cursor-pointer"
              >
                + Add Feature Card
              </button>
            </div>
          </section>

          {/* Guide */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 border-gray-300">
              Guide
            </h3>
            <p className="text-xs text-gray-400 pb-1">Guide Title</p>
            <input
              {...register("guide.title")}
              placeholder="Guide Title"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 pb-1 mt-3">
              Guide Descriptions
            </p>
            <textarea
              {...register("guide.detail")}
              placeholder="Guide Detail"
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <div className="mt-5 space-y-4">
              {guideCards.map((card, index) => (
                <div key={card.id} className="rounded p-6 bg-gray-50 relative">
                  <p className="text-xs text-gray-400 pb-1">Guide Step Title</p>
                  <input
                    {...register(`guide.guideCards.${index}.title`)}
                    placeholder="Guide Step Title"
                    className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-400 pb-1 mt-3">
                    Guide Step Descriptions
                  </p>
                  <textarea
                    {...register(`guide.guideCards.${index}.detail`)}
                    placeholder="Guide Step Detail"
                    rows={3}
                    className="border border-gray-300 rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeGuideCard(index)}
                    className="absolute top-0 right-0 px-2 py-1 text-red-600 font-semibold hover:bg-red-600 hover:text-white rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendGuideCard({ title: "", detail: "" })}
                className="text-green-600 font-semibold hover:underline cursor-pointer"
              >
                + Add Guide Step
              </button>
            </div>
          </section>

          {/* AI Corner */}
          <section>
            <h3 className="text-lg font-semibold mb-3 border-b pb-1 border-gray-300">
              AI Corner
            </h3>
            <p className="text-xs text-gray-400 pb-1">AI Corner Title</p>
            <input
              {...register("aiCorner.title")}
              placeholder="AI Corner Title"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 pb-1 mt-3">
              AI Corner Descriptions
            </p>
            <textarea
              {...register("aiCorner.detail")}
              placeholder="AI Corner Detail"
              rows={4}
              className="border border-gray-300 rounded px-3 py-2 w-full resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </section>

          <button
            type="submit"
            className="w-full bg-[#37B874] hover:bg-[#195234] text-white font-semibold py-3 rounded mt-6"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandingPageManage;
