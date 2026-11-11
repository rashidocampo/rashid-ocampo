"use client";

import { useState } from "react";
import { Arrow, Mail } from "./Icons";

export default function Subscribe() {
  const [msg, setMsg] = useState("");
  return (
    <form
      className="w-full lg:w-auto"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: connect to an email service (e.g. Resend) — nothing is stored yet.
        setMsg("The newsletter isn't open yet — please check back soon, in shā’ Allāh.");
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex h-11 shrink-0 items-center sm:flex-1 gap-3 rounded-full bg-white px-5 text-navy-800 lg:w-[300px]">
          <Mail className="h-5 w-5 shrink-0 text-royal" />
          <span className="sr-only">Email address</span>
          <input
            type="email"
            required
            placeholder="Enter your email address"
            className="w-full bg-transparent text-base text-navy-900 placeholder:text-slate-500 focus:outline-none"
          />
        </label>
        <button className="btn-blue flex h-11 items-center justify-center gap-2 rounded-full px-7 text-lg font-semibold transition">
          Subscribe <Arrow />
        </button>
      </div>
      <p role="status" className="mt-2 min-h-5 text-sm text-sky">{msg}</p>
    </form>
  );
}
