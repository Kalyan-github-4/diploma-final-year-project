// pages/example.tsx
import { useState } from 'react'
import { Drawer } from '@/components/ui/drawer'
import { Bell } from 'lucide-react'
import { Button } from '../ui/button'

export const Notification = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="p-4">
            <Button
                variant="ghost"
                onClick={() => setIsOpen(true)}
            >
                <Bell />
            </Button>

            <Drawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Example Drawer"
                position="right"
                size="md"
            >
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        This is the drawer content. You can put anything here!
                    </p>
                </div>
            </Drawer>
        </div>
    )
}