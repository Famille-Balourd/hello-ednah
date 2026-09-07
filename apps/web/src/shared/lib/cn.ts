// Helper de composition de classes : classnames + résolution des conflits Tailwind.
import classNames, { type Argument } from 'classnames'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Argument[]): string {
    return twMerge(classNames(inputs))
}
