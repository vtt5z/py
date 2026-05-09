"use client";

import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

import { OSCard } from "@/components/os/os-card";

const contacts = [
  { title: "Yemeni Nationality", text: "Elegant identity signal kept outside the hero.", icon: ShieldCheck },
  { title: "Current Location", text: "India", icon: MapPin },
  { title: "Phone", text: "+91 8699164650", icon: Phone },
  { title: "Email", text: "mhamad2129@gmail.com", icon: Mail },
];

export function OSContactSection() {
  return (
    <section id="contact" className="relative z-10 mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-12 max-w-4xl">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.38em] text-cyan-200/70">
          Contact Signal
        </p>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
          Connect with the engineer behind HARON OS.
        </h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {contacts.map((contact) => (
          <OSCard key={contact.title} title={contact.title} text={contact.text} icon={contact.icon} />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href="https://www.instagram.com/vtt5z" target="_blank" className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-bold text-white/70 transition hover:border-cyan-200/50 hover:text-cyan-100">
          Instagram
        </a>
        <a href="https://www.linkedin.com/in/haron-mohammad-39006021a" target="_blank" className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-bold text-white/70 transition hover:border-cyan-200/50 hover:text-cyan-100">
          LinkedIn
        </a>
        <a href="https://github.com/" target="_blank" className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 font-bold text-white/70 transition hover:border-cyan-200/50 hover:text-cyan-100">
          GitHub
        </a>
      </div>
    </section>
  );
}
