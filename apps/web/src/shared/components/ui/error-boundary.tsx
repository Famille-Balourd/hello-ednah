// ErrorBoundary : composant classe (seul moyen d'attraper un crash de rendu).
// Rend ErrorFallback au lieu de démonter l'arbre ; se réinitialise quand sa `key` change.
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from './error-fallback'

type ErrorBoundaryProps = {
    children: ReactNode
    compact?: boolean
}

type ErrorBoundaryState = {
    hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Log central ; brancher ici le monitoring.
        console.error('[ErrorBoundary]', error, info.componentStack)
    }

    handleReset = () => {
        this.setState({ hasError: false })
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorFallback onReset={this.handleReset} compact={this.props.compact} />
            )
        }
        return this.props.children
    }
}
