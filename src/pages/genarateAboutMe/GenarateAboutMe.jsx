import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import useApi from "../../hook/apiHook";
import { toast } from "sonner";
import Container from "../../container/container";
import Buttons from "../../reuseable/AllButtons";

const GenerateAboutMe = () => {
  const { user } = useAuth(); // Get user with approvalToken
  const { request } = useApi();
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAboutMe = async () => {
      if (!user?.approvalToken) {
        toast.error("You must be logged in to view this page.");
        setTimeout(() => navigate("/login"), 1500);
        return;
      }

      try {
        setLoading(true);

        // Check if user has a resume
        const findAboutMe = await request({
          endpoint: "/users/getProfile",
          method: "GET",
          headers: {
            Authorization: user.approvalToken, // Send approvalToken without "Bearer"
          },
        });

        if (!findAboutMe?.ok) {
          setError(findAboutMe?.message || "Failed to fetch user profile.");
          toast.error(findAboutMe?.message || "❌ Failed to load profile.");
          return;
        }

        const profile = findAboutMe.data?.data;

        if (!profile) {
          setError("Profile data is missing.");
          toast.error("❌ Profile data is missing.");
          return;
        }

        console.log("find about me", profile.isAboutMeGenerated);

        let aboutMeData = "";

        if (profile.isAboutMeGenerated && profile.generatedAboutMe) {
          // Use existing "About Me" from profile if generated
          aboutMeData = profile.generatedAboutMe;
          toast.success("About Me loaded from profile!");
        } else {
          // Generate new "About Me" if not generated
          const res = await request({
            endpoint: "/resume/genarateAboutMe",
            method: "POST",
            headers: {
              Authorization: user.approvalToken,
            },
          });

          if (res?.ok) {
            aboutMeData = res.data; // Expecting string response
            toast.success("About Me generated successfully!");
          } else {
            setError(res?.message || "Failed to generate About Me.");
            toast.error(res?.message || "❌ Failed to generate About Me.");
            return;
          }
        }

        setAboutText(aboutMeData);
      } catch (error) {
        console.error("About Me fetch error:", error);
        setError("Something went wrong while fetching or generating data.");
        toast.error("❌ Error processing About Me data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutMe();
  }, [user, navigate]);

  return (
    <div className="w-full max-w-[1440px] mx-auto my-12">
      <div className="min-h-screen my-10 md:my-0 lg:my-0 flex flex-col items-center justify-center">
        <div className="w-[80%] md:max-w-3xl lg:max-w-3xl mx-auto mb-12 p-6 text-center rounded-lg">
          <h1 className="text-3xl text-white font-semibold mb-4 leading-snug">
            Thank you for uploading your resume!
          </h1>
          <p className="text-lg text-white mb-3">
            The first interview question is often{" "}
            <span className="font-medium text-[#37B874]">
              “Tell me about yourself,”
            </span>{" "}
            and we’re here to help you generate a tailored response directly
            from your resume.
          </p>
          <p className="text-md text-white italic">
            Give it a try yourself and impress your interviewers!
          </p>
        </div>

        <div className="w-[80%] bg-white p-6 rounded-lg shadow-md">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-center text-[#37B874]">
                About Me
              </h1>
              <p className="text-gray-700">{aboutText}</p>
            </div>
          )}
        </div>
        <div className="mt-6 text-center">
          <Buttons.LinkButton
            to={"/takeAboutMeVideoTest"}
            text="Take Video Test"
            height="h-12"
            width="w-64"
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateAboutMe;
