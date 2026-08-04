"use client";

import { useState } from "react";
export default function Home() {
  const [search, setSearch] = useState("");

const marathons = [
  {
    name: "Delhi Marathon",
    date: "12 October 2026",
    city: "New Delhi",
  },
  {
    name: "Mumbai Marathon",
    date: "20 November 2026",
    city: "Mumbai",
  },
  {
    name: "Kolkata Marathon",
    date: "15 December 2026",
    city: "Kolkata",
  },
];

const filtered = marathons.filter(
  (m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.city.toLowerCase().includes(search.toLowerCase())
);
  return (
  <main>

    <nav>
      ...
    </nav>

    <section>
      Hero Section...
    </section>
      {/* NAVBAR */}
      <nav className="w-full border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Marathon Saathi"
              className="w-14 h-14"
            />

            <div>
              <h1 className="text-2xl font-bold text-orange-600">
                Marathon Saathi
              </h1>

              <p className="text-sm text-gray-500">
                Har Race Ka Saathi
              </p>
            </div>
          </div>

          <div className="hidden md:flex gap-8 font-medium">
            <a href="#">Home</a>
            <a href="#">Marathons</a>
            <a href="#">Calendar</a>
            <a href="#">Gallery</a>
            <a href="#">Contact</a>
          </div>

        </div>
      </nav>

      {/* HERO */}

      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">

        <div className="flex-1">

          <h2 className="text-6xl font-bold text-orange-600 mb-4">
            Marathon Saathi
          </h2>

          <h3 className="text-3xl font-semibold text-blue-800 mb-6">
            Har Race Ka Saathi
          </h3>

          <p className="text-lg text-gray-700 leading-8">
            India's Running Event Update Hub.
            <br />
            Find upcoming marathons across India.
            <br />
            Registration Links.
            <br />
            City Wise Running Events.
            <br />
            One Community for Every Indian Runner.
          </p>

          <div className="mt-10 flex gap-5">

            <button className="bg-orange-500 text-white px-8 py-4 rounded-xl hover:bg-orange-600">
              Explore Marathons
            </button>

            <button className="bg-blue-700 text-white px-8 py-4 rounded-xl hover:bg-blue-800">
              Join Community
            </button>

          </div>

        </div>

        <div className="flex-1 flex justify-center">

          <img
            src="/logo.png"
            alt="Logo"
            className="w-[450px] max-w-full"
          />

        </div>

      </section>
      <section>
  {/* Hero Section */}
</section>

<div className="max-w-7xl mx-auto px-6 py-8">
  <input
    type="text"
    placeholder="🔍 Search marathon by city..."
    className="w-full border rounded-lg p-3 shadow-md"
  />
</div>

<section>
  {/* Featured Marathons */}
</section>
{/* FEATURED MARATHONS */}

<section className="bg-gray-100 py-16">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center text-orange-600 mb-12">
      Featured Marathons
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold">Delhi Marathon</h3>
        <p className="mt-3 text-gray-600">
          📅 12 October 2026
        </p>
        <p className="text-gray-600">
          📍 New Delhi
        </p>
        <button className="mt-5 bg-orange-500 text-white px-5 py-2 rounded-lg">
          Register
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold">Mumbai Marathon</h3>
        <p className="mt-3 text-gray-600">
          📅 20 November 2026
        </p>
        <p className="text-gray-600">
          📍 Mumbai
        </p>
        <button className="mt-5 bg-orange-500 text-white px-5 py-2 rounded-lg">
          Register
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold">Kolkata Marathon</h3>
        <p className="mt-3 text-gray-600">
          📅 15 December 2026
        </p>
        <p className="text-gray-600">
          📍 Kolkata
        </p>
        <button className="mt-5 bg-orange-500 text-white px-5 py-2 rounded-lg">
          Register
        </button>
      </div>

    </div>

  </div>
</section>
<footer className="bg-gray-900 text-white mt-16 py-8">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-2xl font-bold text-orange-400">
      Marathon Saathi
    </h2>

    <p className="mt-3">
      Har Race Ka Saathi
    </p>

    <p className="mt-2 text-gray-400">
      © 2026 Marathon Saathi. All Rights Reserved.
    </p>
  </div>
</footer>
    </main>
  );
}