import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";

const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch("http://localhost:8082/api/v1/dalle", {
          // const response = await fetch('https://dalle-arbb.onrender.com/api/v1/dalle', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: form.prompt,
          }),
        });

        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please provide proper prompt");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8082/api/v1/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert("Success");
        navigate("/");
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please generate an image with proper details");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
      <h1 class="font-extrabold text-[#FFF5EE] font-serif text-[40px] tracking-wider leading-tight">Craft Your Composition</h1>
      <p class="mt-2 text-[#FFF5EE] font-serif text-[18px] max-w-[550px] leading-tight allura-font">
        Create an innovative image using AI technology and share it with the community to inspire others.
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex gap-5  formfieldsmain">
          <div className="formfields">
            <FormField
              labelName="User Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              handleChange={handleChange}
            />

            <FormField
              labelName="Prompt"
              type="text"
              name="prompt"
              placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />
          </div>

          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-3 h-80 flex justify-center items-center">
            {form.photo ? (
            <img src={form.photo} alt={form.prompt} className="w-full h-full object-contain" />
            ) : (
            <img
            src={preview}
            alt="preview"
            className="w-9/12 h-9/12 object-contain opacity-40 border border-gray-200 rounded-md"
            />
            )}
            {generatingImg && (
            <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
              <Loader />
              </div>
              )}
            </div>
          </div>

        {/* This code generates an image on button click and 
        displays the button text based on the status of image 
        generation.*/ }
        <div className="mt-3 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="Generate-btn"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-2">
          {/* <p className="mt-2 text-[#666e75] text-[14px]">
            ** Once you have created the image you want, you can share it with others in the
            community **
          </p> */}
          <button
            type="submit"
            className="share-btn"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
