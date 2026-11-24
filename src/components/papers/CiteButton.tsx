"use client";

import { useCallback, useState } from "react";

import { CiteDialog } from "@/components/library/CiteDialog";
import { Button } from "@/components/ui";
import type { SearchDocument } from "@/lib/content/search-index";

/** Opens the shared citation dialog for one paper. */
export function CiteButton({ doc }: { doc: SearchDocument }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <Button
        variant="secondary"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        Cite
      </Button>
      <CiteDialog doc={doc} open={open} onClose={close} />
    </>
  );
}
