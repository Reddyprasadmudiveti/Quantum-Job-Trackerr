import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProgressIndicator from '../ProgressIndicator'
import LoadingAnimation from '../LoadingAnimation'
import useResumeProgress from '../../../hooks/useResumeProgress'

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>
    },
    AnimatePresence: ({ children }) => <div>{children}</div>
}))

// Test component that uses the progress tracking system
const TestProgressComponent = () => {
    const {
        isProcessing,
        currentStep,
        progress,
        error,
        success,
        processingMessage,
        startProgress,
        updateProgress,
        setProgressError,
        resetProgress,
        PROGRESS_STEPS
    } = useResumeProgress()

    const steps = [
        { id: 'step1', title: 'Step 1', icon: '1️⃣' },
        { id: 'step2', title: 'Step 2', icon: '2️⃣' },
        { id: 'step3', title: 'Step 3', icon: '3️⃣' }
    ]

    const handleStart = async () => {
        startProgress()

        // Simulate progress through steps
        setTimeout(() => updateProgress(PROGRESS_STEPS.AI_ENHANCEMENT), 500)
        setTimeout(() => updateProgress(PROGRESS_STEPS.PDF_GENERATION), 1000)
        setTimeout(() => updateProgress(PROGRESS_STEPS.COMPLETE), 1500)
    }

    const handleError = () => {
        startProgress()
        setTimeout(() => setProgressError('Test error occurred'), 500)
    }

    return (
        <div>
            <div>
                <button onClick={handleStart}>Start Progress</button>
                <button onClick={handleError}>Trigger Error</button>
                <button onClick={resetProgress}>Reset</button>
            </div>

            <ProgressIndicator
                steps={steps}
                currentStep={0}
                isProcessing={isProcessing}
                processingStep={currentStep}
                processingMessage={processingMessage}
                error={error}
                success={success}
            />

            {isProcessing && (
                <LoadingAnimation
                    type="spinner"
                    message={processingMessage}
                    progress={progress}
                />
            )}

            <div data-testid="status">
                {isProcessing && <span>Processing</span>}
                {error && <span>Error: {error}</span>}
                {success && <span>Success</span>}
            </div>
        </div>
    )
}

describe('Progress Tracking Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('handles complete progress flow correctly', async () => {
        render(<TestProgressComponent />)

        // Start progress
        const startButton = screen.getByText('Start Progress')
        fireEvent.click(startButton)

        // Should show processing state
        expect(screen.getByText('Processing')).toBeInTheDocument()
        expect(screen.getAllByText('Validating your information...')).toHaveLength(2)

        // Wait for completion
        await waitFor(() => {
            expect(screen.getByText('Success')).toBeInTheDocument()
        }, { timeout: 2000 })

        // Should show success message
        expect(screen.getByText('Resume generated successfully!')).toBeInTheDocument()
    })

    it('handles error state correctly', async () => {
        render(<TestProgressComponent />)

        // Trigger error
        const errorButton = screen.getByText('Trigger Error')
        fireEvent.click(errorButton)

        // Should show processing initially
        expect(screen.getByText('Processing')).toBeInTheDocument()

        // Wait for error
        await waitFor(() => {
            expect(screen.getByText('Error: Test error occurred')).toBeInTheDocument()
        }, { timeout: 1000 })

        // Should show error in progress indicator
        expect(screen.getByText('Error Occurred')).toBeInTheDocument()
    })

    it('allows resetting progress', async () => {
        render(<TestProgressComponent />)

        // Start progress
        const startButton = screen.getByText('Start Progress')
        fireEvent.click(startButton)

        expect(screen.getByText('Processing')).toBeInTheDocument()

        // Reset progress
        const resetButton = screen.getByText('Reset')
        fireEvent.click(resetButton)

        // Should not show processing anymore
        expect(screen.queryByText('Processing')).not.toBeInTheDocument()
    })

    it('shows loading animation during processing', async () => {
        render(<TestProgressComponent />)

        // Start progress
        const startButton = screen.getByText('Start Progress')
        fireEvent.click(startButton)

        // Should show loading animation
        expect(document.querySelector('.animate-spin')).toBeInTheDocument()

        // Should show progress message (appears in both components)
        expect(screen.getAllByText('Validating your information...')).toHaveLength(2)
    })

    it('updates progress percentage correctly', async () => {
        render(<TestProgressComponent />)

        // Start progress
        const startButton = screen.getByText('Start Progress')
        fireEvent.click(startButton)

        // Should start at 0%
        expect(screen.getByText('0%')).toBeInTheDocument()

        // Wait for progress updates
        await waitFor(() => {
            const progressText = screen.queryByText(/\d+%/)
            expect(progressText).toBeInTheDocument()
        }, { timeout: 2000 })
    })

    it('shows appropriate error actions', async () => {
        render(<TestProgressComponent />)

        // Trigger error
        const errorButton = screen.getByText('Trigger Error')
        fireEvent.click(errorButton)

        // Wait for error
        await waitFor(() => {
            expect(screen.getByText('Try Again')).toBeInTheDocument()
            expect(screen.getByText('Contact Support')).toBeInTheDocument()
        }, { timeout: 1000 })
    })

    it('handles multiple progress updates', async () => {
        render(<TestProgressComponent />)

        // Start progress
        const startButton = screen.getByText('Start Progress')
        fireEvent.click(startButton)

        // Should start with validation
        expect(screen.getAllByText('Validating your information...')).toHaveLength(2)

        // Wait for AI enhancement step
        await waitFor(() => {
            expect(screen.getAllByText('Enhancing your content with AI...')).toHaveLength(2)
        }, { timeout: 800 })

        // Wait for PDF generation step
        await waitFor(() => {
            expect(screen.getAllByText('Generating your PDF resume...')).toHaveLength(2)
        }, { timeout: 1200 })

        // Wait for completion
        await waitFor(() => {
            expect(screen.getByText('Success')).toBeInTheDocument()
        }, { timeout: 2000 })
    })
})