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
    <div className="profile-danger-zone">
      <h3 className="profile-subheading">Danger Zone</h3>

      <div className="profile-danger-zone__actions">
        <button className="profile-btn profile-btn--danger" onClick={() => setResetOpen(true)}>
          Reset Progress
        </button>
        <button className="profile-btn profile-btn--danger" onClick={() => setDeleteOpen(true)}>
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

          <label className="profile-modal-fields">
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

          <label className="profile-modal-fields">
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
