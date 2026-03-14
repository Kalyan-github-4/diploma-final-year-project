// components/ui/drawer.tsx
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DrawerProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    position?: 'left' | 'right' | 'top' | 'bottom'
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    closeOnOutsideClick?: boolean
    showCloseButton?: boolean
    title?: string
    className?: string
}

const sizeClasses = {
    left: {
        sm: 'w-64',
        md: 'w-80',
        lg: 'w-96',
        xl: 'w-[32rem]',
        full: 'w-screen'
    },
    right: {
        sm: 'w-64',
        md: 'w-80',
        lg: 'w-96',
        xl: 'w-[32rem]',
        full: 'w-screen'
    },
    top: {
        sm: 'h-64',
        md: 'h-80',
        lg: 'h-96',
        xl: 'h-[32rem]',
        full: 'h-screen'
    },
    bottom: {
        sm: 'h-64',
        md: 'h-80',
        lg: 'h-96',
        xl: 'h-[32rem]',
        full: 'h-screen'
    }
}

const positionClasses = {
    left: 'left-0 top-0 h-full',
    right: 'right-0 top-0 h-full',
    top: 'top-0 left-0 w-full',
    bottom: 'bottom-0 left-0 w-full'
}

const animationClasses = {
    left: {
        enter: 'transform transition-transform duration-300 ease-in-out',
        enterFrom: '-translate-x-full',
        enterTo: 'translate-x-0',
        exit: 'transform transition-transform duration-300 ease-in-out',
        exitFrom: 'translate-x-0',
        exitTo: '-translate-x-full'
    },
    right: {
        enter: 'transform transition-transform duration-300 ease-in-out',
        enterFrom: 'translate-x-full',
        enterTo: 'translate-x-0',
        exit: 'transform transition-transform duration-300 ease-in-out',
        exitFrom: 'translate-x-0',
        exitTo: 'translate-x-full'
    },
    top: {
        enter: 'transform transition-transform duration-300 ease-in-out',
        enterFrom: '-translate-y-full',
        enterTo: 'translate-y-0',
        exit: 'transform transition-transform duration-300 ease-in-out',
        exitFrom: 'translate-y-0',
        exitTo: '-translate-y-full'
    },
    bottom: {
        enter: 'transform transition-transform duration-300 ease-in-out',
        enterFrom: 'translate-y-full',
        enterTo: 'translate-y-0',
        exit: 'transform transition-transform duration-300 ease-in-out',
        exitFrom: 'translate-y-0',
        exitTo: 'translate-y-full'
    }
}

export const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    children,
    position = 'right',
    size = 'md',
    closeOnOutsideClick = true,
    showCloseButton = true,
    title,
    className = ''
}) => {
    const isBrowser = typeof window !== "undefined"

    // lock body scroll
    useEffect(() => {
        if (!isBrowser) return

        document.body.style.overflow = isOpen ? "hidden" : "unset"

        return () => {
            document.body.style.overflow = "unset"
        }
    }, [isOpen, isBrowser])

    // escape key close
    useEffect(() => {
        if (!isBrowser || !isOpen) return

        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [isOpen, onClose, isBrowser])

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (closeOnOutsideClick && e.target === e.currentTarget) {
            onClose()
        }
    }

    if (!isBrowser) return null

    return createPortal(
        <div
            className={`
        fixed inset-0 z-50 flex
        ${position === 'left' ? 'justify-start' : ''}
        ${position === 'right' ? 'justify-end' : ''}
        ${position === 'top' ? 'items-start' : ''}
        ${position === 'bottom' ? 'items-end' : ''}
        ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
      `}
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div
                onClick={closeOnOutsideClick ? onClose : undefined}
                className={`
          fixed inset-0 bg-black transition-opacity duration-300
          ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}
        `}
                aria-hidden="true"
            />

            {/* Drawer Panel */}
            <div
                className={`
                    fixed bg-white dark:bg-(--bg-primary) shadow-xl
                    ${positionClasses[position]}
                    ${sizeClasses[position][size]}
                    ${isOpen
                    ? animationClasses[position].enterTo
                    : animationClasses[position].exitTo
                    }
          ${animationClasses[position].enter}
          ${className}
        `}
                role="dialog"
                aria-modal="true"
                aria-label={title || 'Drawer'}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        {title && (
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="
                  p-2 rounded-lg
                  text-gray-500 hover:text-gray-700
                  dark:text-gray-400 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-800
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
                                aria-label="Close drawer"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="overflow-y-auto h-[calc(100%-73px)]">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}