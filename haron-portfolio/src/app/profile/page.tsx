"use client";

import { Camera, CheckCircle2, Loader2, Save, UserRound } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SettingsTabs } from "@/components/auth/settings-tabs";
import { useAuth } from "@/components/providers/auth-provider";
import { useLanguage } from "@/components/providers/language-provider";
import { PageFrame } from "@/components/os/page-frame";
import { authCopy } from "@/lib/auth-copy";

export default function ProfilePage() {
  return (
    <PageFrame>
      <ProtectedRoute>
        <ProfileEditor />
      </ProtectedRoute>
    </PageFrame>
  );
}

function ProfileEditor() {
  const { profile, user, updateProfile, uploadAvatar } = useAuth();
  const { lang } = useLanguage();
  const copy = authCopy[lang];
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setName(profile?.name || user?.displayName || "");
    setUsername(profile?.username || "");
    setBio(profile?.bio || "");
    setAvatar(profile?.avatar || user?.photoURL || null);
  }, [profile, user]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateProfile({ name, displayName: name, username, bio, avatar });
      setMessage(copy.saved);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.completeFields);
    } finally {
      setSaving(false);
    }
  }

  async function changeAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file));
    setSaving(true);
    setMessage("");
    try {
      const url = await uploadAvatar(file);
      setAvatar(url);
      setMessage(copy.saved);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : copy.completeFields);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-28 sm:px-8 lg:px-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.34em] text-cyan-100/65">User Profile</p>
        <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">{copy.profileTitle}</h1>
      </div>
      <SettingsTabs />

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
          <div className="mx-auto grid size-28 overflow-hidden rounded-[2rem] border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              <UserRound className="m-auto size-10" />
            )}
          </div>
          <label className="mt-5 flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-bold text-white/68 transition hover:border-cyan-200/40 hover:text-cyan-100">
            <Camera className="size-4" />
            {copy.upload}
            <input type="file" accept="image/*" className="hidden" onChange={changeAvatar} />
          </label>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/58">
            <p className="font-bold text-white">{profile?.email || user?.email}</p>
            <p className="mt-2 flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-200" />
              {profile?.verified || user?.emailVerified ? "Verified" : "Email pending verification"}
            </p>
          </div>
        </div>

        <form onSubmit={save} className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.name} value={name} onChange={setName} />
            <Field label={copy.username} value={username} onChange={setUsername} />
          </div>
          <label className="mt-4 block">
            <span className="text-sm font-bold text-white/60">{copy.bio}</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-200/45"
              placeholder={lang === "ar" ? "اكتب نبذة قصيرة عنك..." : "Write a short bio..."}
            />
          </label>
          {message && <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/70">{message}</p>}
          <button
            type="submit"
            disabled={saving}
            className="mt-5 inline-flex h-12 items-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-black text-slate-950 transition hover:bg-white disabled:opacity-55"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {copy.save}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-white/60">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-200/45"
      />
    </label>
  );
}
