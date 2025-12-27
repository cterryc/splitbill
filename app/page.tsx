// app/page.tsx
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CalculatorDemo from '@/components/CalculatorDemo'
import StepsSection from '@/components/StepsSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [totalBill, setTotalBill] = useState(1250.0)
  const [floors, setFloors] = useState([
    { id: 1, name: 'Piso 1', residents: 3 },
    { id: 2, name: 'Piso 2', residents: 2 },
    { id: 3, name: 'Piso 3', residents: 4 },
    { id: 4, name: 'Piso 4', residents: 1 },
    { id: 5, name: 'Piso 5', residents: 2 }
  ])

  const updateResidents = (id: number, change: number) => {
    setFloors((prev) =>
      prev.map((floor) =>
        floor.id === id
          ? { ...floor, residents: Math.max(1, floor.residents + change) }
          : floor
      )
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1'>
        <HeroSection />
        <CalculatorDemo
          totalBill={totalBill}
          setTotalBill={setTotalBill}
          floors={floors}
          updateResidents={updateResidents}
        />
        <StepsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
