import { useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ChangePasswordModalProps {
  open: boolean
  onOpenChange: (value: boolean) => void
}

export default function ChangePasswordModal({
  open,
  onOpenChange,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [nextPassword, setNextPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const canSubmit = useMemo(() => {
    return currentPassword.length > 0 && nextPassword.length >= 8 && nextPassword === confirmPassword
  }, [currentPassword, nextPassword, confirmPassword])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and choose a new one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
          <label className="flex flex-col gap-1.5">
            <span>Current password</span>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span>New password</span>
            <Input
              type="password"
              value={nextPassword}
              onChange={(e) => setNextPassword(e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span>Confirm password</span>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!canSubmit} onClick={() => onOpenChange(false)}>
            Update password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
