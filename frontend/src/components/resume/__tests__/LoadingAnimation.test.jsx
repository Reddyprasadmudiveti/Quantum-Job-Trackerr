import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoadingAnimation from '../LoadingAnimation'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}))

describe('LoadingAnimation', () => {
  it('renders spinner animation by default', () => {
    render(<LoadingAnimation />)
    
    const spinner = document.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('renders dots animation when type is dots', () => {
    render(<LoadingAnimation type="dots" />)
    
    const dots = document.querySelectorAll('.rounded-full')
    expect(dots).toHaveLength(3)
  })

  it('renders bars animation when type is bars', () => {
    render(<LoadingAnimation type="bars" />)
    
    const bars = document.querySelectorAll('.bg-current')
    expect(bars).toHaveLength(4)
  })

  it('renders wave animation when type is wave', () => {
    render(<LoadingAnimation type="wave" />)
    
    const waveElements = document.querySelectorAll('.rounded-full')
    expect(waveElements).toHaveLength(5)
  })

  it('renders pulse animation when type is pulse', () => {
    render(<LoadingAnimation type="pulse" />)
    
    const pulseElement = document.querySelector('.rounded-full')
    expect(pulseElement).toBeInTheDocument()
  })

  it('displays message when provided', () => {
    const message = 'Loading your resume...'
    render(<LoadingAnimation message={message} />)
    
    expect(screen.getByText(message)).toBeInTheDocument()
  })

  it('shows progress bar when progress is provided', () => {
    render(<LoadingAnimation progress={75} />)
    
    expect(screen.getByText('75%')).toBeInTheDocument()
  })

  it('applies small size classes correctly', () => {
    render(<LoadingAnimation size="small" />)
    
    const spinner = document.querySelector('.h-4')
    expect(spinner).toBeInTheDocument()
  })

  it('applies large size classes correctly', () => {
    render(<LoadingAnimation size="large" />)
    
    const spinner = document.querySelector('.h-12')
    expect(spinner).toBeInTheDocument()
  })

  it('applies xlarge size classes correctly', () => {
    render(<LoadingAnimation size="xlarge" />)
    
    const spinner = document.querySelector('.h-16')
    expect(spinner).toBeInTheDocument()
  })

  it('applies blue color classes correctly', () => {
    render(<LoadingAnimation color="blue" />)
    
    const spinner = document.querySelector('.border-blue-500')
    expect(spinner).toBeInTheDocument()
  })

  it('applies purple color classes correctly', () => {
    render(<LoadingAnimation color="purple" />)
    
    const spinner = document.querySelector('.border-purple-500')
    expect(spinner).toBeInTheDocument()
  })

  it('applies green color classes correctly', () => {
    render(<LoadingAnimation color="green" />)
    
    const spinner = document.querySelector('.border-green-500')
    expect(spinner).toBeInTheDocument()
  })

  it('uses white color by default', () => {
    render(<LoadingAnimation />)
    
    const spinner = document.querySelector('.border-white')
    expect(spinner).toBeInTheDocument()
  })

  it('renders both message and progress when both are provided', () => {
    const message = 'Processing...'
    render(<LoadingAnimation message={message} progress={50} />)
    
    expect(screen.getByText(message)).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('handles zero progress correctly', () => {
    render(<LoadingAnimation progress={0} />)
    
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('handles 100% progress correctly', () => {
    render(<LoadingAnimation progress={100} />)
    
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('does not render progress bar when progress is null', () => {
    render(<LoadingAnimation progress={null} />)
    
    const progressText = screen.queryByText(/%/)
    expect(progressText).not.toBeInTheDocument()
  })

  it('does not render message when not provided', () => {
    render(<LoadingAnimation />)
    
    const messageContainer = document.querySelector('.text-sm')
    expect(messageContainer).not.toBeInTheDocument()
  })
})