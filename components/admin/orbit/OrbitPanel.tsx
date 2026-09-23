"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface OrbitSettingsView {
  enabled: boolean;
  provider: string;
  model: string;
  autoPublish: boolean;
  authorId: string | null;
  categories: string[];
  defaultImage: string | null;
  wordCount: number;
  tone: string;
  language: string;
  extraInstructions: string | null;
  lastRunAt: string | null;
  lastRunStatus: string | null;
}

export interface OrbitProviderView {
  id: string;
  label: string;
  envKey: string;
  defaultModel: string;
  free: boolean;
  keyUrl: string;
  configured: boolean;
}

export interface OrbitTopicView {
  id: string;
  title: string;
  keywords: string[];
  category: string | null;
  notes: string | null;
  status: string;
  source: string;
  createdAt: string;
}

export interface OrbitRunView {
  id: string;
  status: string;
  trigger: string;
  topic: string | null;
  blogId: string | null;
  blogTitle: string | null;
  blogSlug: string | null;
  blogStatus: string | null;
  message: string | null;
  error: string | null;
  durationMs: number | null;
  createdAt: string;
}

interface OrbitPanelProps {
  settings: OrbitSettingsView;
  providers: OrbitProviderView[];
  topics: OrbitTopicView[];
  runs: OrbitRunView[];
  authors: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  mediaCount: number;
  cronConfigured: boolean;
  cronSchedule: string;
}

type Tab = "overview" | "topics" | "settings";

export default function OrbitPanel(props: OrbitPanelProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [form, setForm] = useState<OrbitSettingsView>(props.settings);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const provider =
    props.providers.find((p) => p.id === form.provider) ?? props.providers[0];
  const pendingTopics = props.topics.filter((t) => t.status === "pending");

  const checklist = [
    {
      ok: provider?.configured ?? false,
      label: `${provider?.envKey} is set on the server`,
      hint: provider
        ? `Get a key at ${provider.keyUrl}, then add ${provider.envKey} to your environment variables.`
        : "",
    },
    {
      ok: props.authors.length > 0,
      label: "At least one author exists",
      hint: "Orbit needs an author to attribute posts to. Create one under Authors.",
    },
    {
      ok: props.categories.length > 0,
      label: "At least one category exists",
      hint: "Every post needs a category. Create one under Categories.",
    },
    {
      ok: props.mediaCount > 0 || Boolean(form.defaultImage),
      label: "A featured image is available",
      hint: "Upload images to the Media Library, or set a default image URL in Settings.",
    },
    {
      ok: props.cronConfigured,
      label: "CRON_SECRET is set on the server",
      hint: "Without it the daily cron endpoint stays closed. Run Now still works.",
    },
    {
      ok: form.enabled,
      label: "Orbit is turned on",
      hint: "Turn it on in Settings once the rest of the checklist is green.",
    },
  ];
  const ready = checklist.every((item) => item.ok);

  async function saveSettings(patch?: Partial<OrbitSettingsView>) {
    setSaving(true);
    setNotice(null);
    const payload = { ...form, ...patch };

    try {
      const res = await fetch("/api/admin/orbit/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save settings");

      setForm({ ...payload });
      setNotice({ type: "success", text: "Settings saved." });
      router.refresh();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function runNow() {
    setRunning(true);
    setNotice({
      type: "info",
      text: "Writing the post. This usually takes 20-60 seconds.",
    });

    try {
      const res = await fetch("/api/admin/orbit/run", { method: "POST" });
      const data = await res.json();

      if (!res.ok && !data.status) {
        throw new Error(data.error || "Run failed");
      }

      const savedAsDraft =
        data.status === "success" && data.blog?.status === "draft";

      setNotice({
        type: data.status === "success" ? "success" : "error",
        text: savedAsDraft
          ? `${data.message} Read it below, then press Publish to take it live.`
          : data.message || data.error || "Run finished.",
      });
      router.refresh();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setRunning(false);
    }
  }

  /** Take one draft Orbit wrote live, without opening the editor. */
  async function publishDraft(blogId: string) {
    setPublishingId(blogId);
    setNotice(null);

    try {
      const res = await fetch("/api/admin/orbit/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not publish the post");

      setNotice({ type: "success", text: data.message || "Post published." });
      router.refresh();
    } catch (err: any) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#111827]">Orbit</h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                form.enabled
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {form.enabled ? "Automation on" : "Automation off"}
            </span>
          </div>
          <p className="mt-2 text-gray-600">
            Writes a blog post twice a day, on its own.
          </p>
        </div>

        <button
          onClick={runNow}
          disabled={running}
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {running ? "Writing..." : "Run Now"}
        </button>
      </div>

      {notice && (
        <div
          className={`mb-6 rounded-lg border p-4 text-sm ${
            notice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : notice.type === "error"
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-blue-200 bg-blue-50 text-blue-800"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="mb-6 flex gap-1 border-b border-[#E5E7EB]">
        {(
          [
            ["overview", "Overview"],
            ["topics", `Topics (${pendingTopics.length})`],
            ["settings", "Settings"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === id
                ? "border-[#2563EB] text-[#2563EB]"
                : "border-transparent text-gray-600 hover:text-[#111827]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <Overview
          {...props}
          form={form}
          provider={provider}
          checklist={checklist}
          ready={ready}
          pendingCount={pendingTopics.length}
          publishingId={publishingId}
          onPublish={publishDraft}
          saving={saving}
          onUseDrafts={() => saveSettings({ autoPublish: false })}
        />
      )}

      {tab === "topics" && <Topics topics={props.topics} categories={props.categories} />}

      {tab === "settings" && (
        <Settings
          form={form}
          setForm={setForm}
          providers={props.providers}
          authors={props.authors}
          categories={props.categories}
          saving={saving}
          onSave={() => saveSettings()}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

function Overview({
  form,
  provider,
  checklist,
  ready,
  runs,
  pendingCount,
  cronSchedule,
  cronConfigured,
  publishingId,
  onPublish,
  saving,
  onUseDrafts,
}: OrbitPanelProps & {
  form: OrbitSettingsView;
  provider: OrbitProviderView | undefined;
  checklist: { ok: boolean; label: string; hint: string }[];
  ready: boolean;
  pendingCount: number;
  publishingId: string | null;
  onPublish: (blogId: string) => void;
  saving: boolean;
  onUseDrafts: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Status"
          value={ready ? "Ready" : "Setup needed"}
          tone={ready ? "good" : "warn"}
        />
        <Stat label="Writer" value={provider?.label ?? form.provider} />
        <Stat
          label="Mode"
          value={form.autoPublish ? "Publish live" : "Save as draft"}
        />
        <Stat label="Topics queued" value={String(pendingCount)} />
      </div>

      {form.autoPublish && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            Orbit is putting every post straight on the site. Switch to drafts
            and each one waits here until you press Publish.
          </p>
          <button
            onClick={onUseDrafts}
            disabled={saving}
            className="flex-none rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:opacity-60"
          >
            {saving ? "Switching..." : "Save as draft instead"}
          </button>
        </div>
      )}

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Setup checklist</h2>
        <ul className="mt-4 space-y-3">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-bold text-white ${
                  item.ok ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                {item.ok ? "✓" : "!"}
              </span>
              <div>
                <p
                  className={`text-sm font-medium ${
                    item.ok ? "text-[#111827]" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </p>
                {!item.ok && (
                  <p className="mt-0.5 text-sm text-gray-500">{item.hint}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Schedule</h2>
        <p className="mt-2 text-sm text-gray-600">
          Two crons hit{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
            /api/cron/orbit
          </code>{" "}
          every day, at <strong>{cronSchedule}</strong> - two posts a day. The
          endpoint skips a run if a post already came out in the last 6 hours, so
          a repeated trigger cannot produce a duplicate.
        </p>
        {!cronConfigured && (
          <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            CRON_SECRET is not set, so the cron endpoint returns 503. Add it to
            your environment variables to let the schedule run.
          </p>
        )}
        <p className="mt-3 text-sm text-gray-600">
          Last run:{" "}
          {form.lastRunAt
            ? `${new Date(form.lastRunAt).toLocaleString()} (${form.lastRunStatus})`
            : "never"}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#111827]">Recent runs</h2>
        </div>
        {runs.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            No runs yet. Press Run Now to try it once.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB] text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">When</th>
                  <th className="px-6 py-3 font-medium">Result</th>
                  <th className="px-6 py-3 font-medium">Post</th>
                  <th className="px-6 py-3 font-medium">Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {runs.map((run) => (
                  <tr key={run.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={run.status} />
                      <p className="mt-1 max-w-md text-xs text-gray-500">
                        {run.error || run.message}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {run.blogTitle ? (
                        <PostCell
                          run={run}
                          publishing={
                            publishingId !== null &&
                            publishingId === run.blogId
                          }
                          busy={publishingId !== null}
                          onPublish={onPublish}
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-gray-600">
                      {run.trigger}
                      {run.durationMs ? (
                        <span className="text-gray-400">
                          {" "}
                          · {Math.round(run.durationMs / 1000)}s
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The post a run produced. A draft is not on the public site yet, so its title
 * opens the editor and the Publish button next to it takes it live in one click.
 */
function PostCell({
  run,
  publishing,
  busy,
  onPublish,
}: {
  run: OrbitRunView;
  publishing: boolean;
  busy: boolean;
  onPublish: (blogId: string) => void;
}) {
  const isDraft = run.blogStatus === "draft";
  const href = isDraft
    ? run.blogId
      ? `/admin/blogs/${run.blogId}/edit`
      : null
    : run.blogSlug
      ? `/blogs/${run.blogSlug}`
      : null;

  return (
    <div>
      <div className="flex items-start gap-2">
        {href ? (
          <Link
            href={href}
            target={isDraft ? undefined : "_blank"}
            className="font-medium text-[#2563EB] hover:underline"
          >
            {run.blogTitle}
          </Link>
        ) : (
          <span className="font-medium text-[#111827]">{run.blogTitle}</span>
        )}
        {isDraft && (
          <span className="mt-0.5 flex-none rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
            draft
          </span>
        )}
      </div>

      {isDraft && run.blogId && (
        <button
          onClick={() => onPublish(run.blogId as string)}
          disabled={busy}
          className="mt-2 rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
}) {
  return (
    <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          tone === "good"
            ? "text-green-600"
            : tone === "warn"
              ? "text-amber-600"
              : "text-[#111827]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    skipped: "bg-gray-100 text-gray-600",
    pending: "bg-blue-100 text-blue-700",
    used: "bg-green-100 text-green-700",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        styles[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------

function Topics({
  topics,
  categories,
}: {
  topics: OrbitTopicView[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [titles, setTitles] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function addTopics(e: React.FormEvent) {
    e.preventDefault();
    if (!titles.trim()) return;

    setBusy(true);
    setError("");
    const lines = titles.split("\n").filter((l) => l.trim());

    try {
      const res = await fetch("/api/admin/orbit/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          lines.length === 1
            ? { title: lines[0], category, keywords }
            : { titles }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add topics");

      setTitles("");
      setKeywords("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function removeTopic(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/admin/orbit/topics/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={addTopics}
        className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-[#111827]">Add topics</h2>
        <p className="mt-1 text-sm text-gray-600">
          One topic per line. Orbit takes the oldest pending topic each day; when
          the queue is empty it picks a fresh topic itself.
        </p>

        {error && (
          <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <textarea
          value={titles}
          onChange={(e) => setTitles(e.target.value)}
          rows={5}
          placeholder={"How to start a vegetable garden in small spaces\n10 budget travel tips for first-time flyers"}
          className="mt-4 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] focus:border-[#2563EB] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
        />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Category <span className="text-gray-400">(single topic only)</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            >
              <option value="">Let Orbit choose</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Keywords <span className="text-gray-400">(comma separated)</span>
            </label>
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="small garden, urban gardening"
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={busy || !titles.trim()}
          className="mt-4 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          Add to queue
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#111827]">Queue</h2>
        </div>
        {topics.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            No topics yet. Orbit will invent its own until you add some.
          </p>
        ) : (
          <ul className="divide-y divide-[#E5E7EB]">
            {topics.map((topic) => (
              <li
                key={topic.id}
                className="flex items-start justify-between gap-4 px-6 py-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-[#111827]">{topic.title}</p>
                    <StatusBadge status={topic.status} />
                    {topic.source === "ai" && (
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-700">
                        auto
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {[
                      topic.category,
                      topic.keywords.join(", "),
                      new Date(topic.createdAt).toLocaleDateString(),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <button
                  onClick={() => removeTopic(topic.id)}
                  disabled={busy}
                  className="flex-none text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

function Settings({
  form,
  setForm,
  providers,
  authors,
  categories,
  saving,
  onSave,
}: {
  form: OrbitSettingsView;
  setForm: (next: OrbitSettingsView) => void;
  providers: OrbitProviderView[];
  authors: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  saving: boolean;
  onSave: () => void;
}) {
  const provider = providers.find((p) => p.id === form.provider);

  function update<K extends keyof OrbitSettingsView>(
    key: K,
    value: OrbitSettingsView[K]
  ) {
    setForm({ ...form, [key]: value });
  }

  function toggleCategory(name: string) {
    const next = form.categories.includes(name)
      ? form.categories.filter((c) => c !== name)
      : [...form.categories, name];
    update("categories", next);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Automation</h2>

        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => update("enabled", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2563EB]"
          />
          <span>
            <span className="block text-sm font-medium text-[#111827]">
              Run automatically, twice a day
            </span>
            <span className="block text-sm text-gray-500">
              When off, the daily cron skips and only Run Now works.
            </span>
          </span>
        </label>

        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={form.autoPublish}
            onChange={(e) => update("autoPublish", e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2563EB]"
          />
          <span>
            <span className="block text-sm font-medium text-[#111827]">
              Publish straight away
            </span>
            <span className="block text-sm text-gray-500">
              Off by default: each post is saved as a draft for you to review.
              Tick this only once you trust the output.
            </span>
          </span>
        </label>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Writer</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Provider
            </label>
            <select
              value={form.provider}
              onChange={(e) => {
                const next = providers.find((p) => p.id === e.target.value);
                setForm({
                  ...form,
                  provider: e.target.value,
                  model: next?.defaultModel ?? form.model,
                });
              }}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                  {p.configured ? "" : " - key missing"}
                </option>
              ))}
            </select>
            {provider && !provider.configured && (
              <p className="mt-1 text-xs text-amber-700">
                Set {provider.envKey} in your environment. Key:{" "}
                <a
                  href={provider.keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2563EB] hover:underline"
                >
                  {provider.keyUrl}
                </a>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Model
            </label>
            <input
              value={form.model}
              onChange={(e) => update("model", e.target.value)}
              placeholder={provider?.defaultModel}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Author
            </label>
            <select
              value={form.authorId ?? ""}
              onChange={(e) => update("authorId", e.target.value || null)}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            >
              <option value="">First author in the list</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Target length (words)
            </label>
            <input
              type="number"
              min={300}
              max={4000}
              value={form.wordCount}
              onChange={(e) => update("wordCount", Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Language
            </label>
            <input
              value={form.language}
              onChange={(e) => update("language", e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827]">
              Tone
            </label>
            <input
              value={form.tone}
              onChange={(e) => update("tone", e.target.value)}
              className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-[#111827]">
            House rules <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={form.extraInstructions ?? ""}
            onChange={(e) => update("extraInstructions", e.target.value)}
            rows={4}
            placeholder="Always mention our free trial in the conclusion. Never compare us to named competitors."
            className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#111827]">Content</h2>

        <p className="mt-4 text-sm font-medium text-[#111827]">
          Categories Orbit may write for
        </p>
        <p className="text-sm text-gray-500">
          Leave all unchecked to allow every category.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = form.categories.includes(c.name);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.name)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-[#2563EB] bg-[#2563EB] text-white"
                    : "border-[#E5E7EB] text-gray-700 hover:border-[#2563EB]"
                }`}
              >
                {c.name}
              </button>
            );
          })}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories yet.</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-[#111827]">
            Fallback featured image URL
          </label>
          <p className="text-sm text-gray-500">
            Used only when the Media Library has nothing to pick from. Must be
            on a host allowed in next.config.ts - Firebase Storage or Unsplash.
          </p>
          <input
            value={form.defaultImage ?? ""}
            onChange={(e) => update("defaultImage", e.target.value)}
            placeholder="https://firebasestorage.googleapis.com/..."
            className="mt-1 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm focus:border-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1D4ED8] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save settings"}
      </button>
    </div>
  );
}
