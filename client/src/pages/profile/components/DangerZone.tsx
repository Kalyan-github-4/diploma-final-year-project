import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function DangerZone() {
  const [resetOpen, setResetOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetConfirm, setResetConfirm] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState("")

  const canReset = useMemo(() => resetConfirm === "RESET", [resetConfirm])
  const canDelete = useMemo(() => deleteConfirm === "DELETE", [deleteConfirm])

  return (
    <div className="mt-3.5 rounded-[10px] border border-dashed border-[rgba(239,68,68,0.45)] p-3">
      <h3 className="mb-2.5 font-grotesk text-[14px] font-semibold text-foreground">
        Danger Zone
      </h3>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-[13px] font-semibold text-[#ef4444]"
          onClick={() => setResetOpen(true)}
        >
          Reset Progress
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.1)] px-3 py-2 text-[13px] font-semibold text-[#ef4444]"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Account
        </button>
      </div>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Progress</DialogTitle>
            <DialogDescription>
              This will delete all your XP, progress and badges. This cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Type RESET to confirm</span>
            <Input value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} />
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={!canReset} onClick={() => setResetOpen(false)}>
              Confirm reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all data.
            </DialogDescription>
          </DialogHeader>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Type DELETE to confirm</span>
            <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} />
          </label>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={!canDelete} onClick={() => setDeleteOpen(false)}>
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
