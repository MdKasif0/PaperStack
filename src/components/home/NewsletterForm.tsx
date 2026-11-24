"use client";

import { useRef, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";

import { Button, Input } from "@/components/ui";

type Status = "idle" | "submitting" | "success" | "unavailable" | "failed";

const MESSAGES: Partial<Record<Status, string>> = {
  submitting: "Submitting…",
  success: "Thank you. You are on the list for the next digest.",
  unavailable:
    "Email sign-up is not open yet, and your address was not saved. The RSS feed is available now.",
  failed: "That did not go through. Please try again.",
};

/** Newsletter sign-up. Success is shown only when the server confirms it. */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const inFlight = useRef(false);

  function reject(message: string) {
    setStatus("idle");
    setError(message);
    inputRef.current?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const input = inputRef.current;
    const email = input?.value.trim() ?? "";
    if (!email) return reject("Enter your email address.");
    if (!input?.validity.valid) {
      return reject("Enter a valid email address, like you@institution.edu.");
    }

    inFlight.current = true;
    setError(undefined);
    setStatus("submitting");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStatus("success");
        if (input) input.value = "";
      } else if (response.status === 400) {
        reject("Enter a valid email address, like you@institution.edu.");
      } else {
        setStatus(response.status === 503 ? "unavailable" : "failed");
      }
    } catch {
      setStatus("failed");
    } finally {
      inFlight.current = false;
    }
  }

  const submitting = status === "submitting";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby="newsletter-note"
      aria-busy={submitting}
    >
      <Input
        ref={inputRef}
        label="Email address"
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder="you@institution.edu"
        hint="One digest per issue. Unsubscribe any time."
        error={error}
        onChange={() => {
          setError(undefined);
          if (!inFlight.current) setStatus("idle");
        }}
      />
      <div className="mt-6">
        <Button
          type="submit"
          aria-disabled={submitting}
          className="min-w-32 aria-disabled:cursor-progress aria-disabled:opacity-75"
        >
          {submitting && (
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          )}
          Subscribe
        </Button>
      </div>
      <p
        role="status"
        className={
          MESSAGES[status]
            ? "mt-5 border-l-2 border-green-700 pl-3 text-small text-ink"
            : "sr-only"
        }
      >
        {MESSAGES[status]}
      </p>
      <p id="newsletter-note" className="mt-5 text-meta text-ink-muted">
        The letterbox opens with the next issue; RSS is live today.
      </p>
    </form>
  );
}
