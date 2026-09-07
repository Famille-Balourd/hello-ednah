// Primitive UI minimale. Exemple volontairement simple :
// le design system complet est propre à chaque projet, pas au template.
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@shared/lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, type = 'button', ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium',
                className,
            )}
            {...props}
        />
    )
}
