import { useState } from 'react'
import { Drawer } from '@/components/ui/drawer'
import { Bell } from 'lucide-react'
import { Button } from '../ui/button'

interface NotificationProps {
    className?: string
}

export const Notification = ({ className = '' }: NotificationProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div>
            <Button
                variant="ghost"
                onClick={() => setIsOpen(true)}
                className={`hover:bg-(--bg-surface) transition-colors cursor-pointer ${className}`}
            >
                <Bell size={20}/>
            </Button>

            <Drawer
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Notifications"
                position="right"
                size="md"
            >
                <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-300">
                        You have no new notifications.
                    </p>
                </div>
            </Drawer>
        </div>
    )
}