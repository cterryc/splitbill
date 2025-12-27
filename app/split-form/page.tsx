'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import './SplitForm.css'

// 1. Definimos la interfaz para los datos que se guardan en LocalStorage
interface SplitBillData {
  floors: number
  totalPeople: number
  floorPeople: Record<string, number>
  totalAmount: number
  createdAt: string
}

// 2. Definimos la interfaz del formulario
// Incluimos una firma de índice para permitir campos dinámicos como 'floor1', 'floor2', etc.
interface FormInputs {
  floors: number
  totalPeople: number
  [key: string]: number // Permite los campos dinámicos de los pisos
}

export default function SplitForm() {
  const router = useRouter()
  const [step, setStep] = useState<number>(0)
  const [floors, setFloors] = useState<number>(1)
  const [totalPeople, setTotalPeople] = useState<number>(1)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({
    defaultValues: {
      floors: 1,
      totalPeople: 1
    }
  })

  // Observar cambios específicos
  const watchedFloors = watch('floors')
  const watchedTotalPeople = watch('totalPeople')

  useEffect(() => {
    if (watchedFloors) {
      const numFloors = Number(watchedFloors)
      setFloors(numFloors > 0 ? numFloors : 1)
    }
  }, [watchedFloors])

  useEffect(() => {
    if (watchedTotalPeople) {
      const numPeople = Number(watchedTotalPeople)
      setTotalPeople(numPeople > 0 ? numPeople : 1)
    }
  }, [watchedTotalPeople])

  const floorArray = Array.from({ length: floors }, (_, i) => i + 1)

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const splitBillData: SplitBillData = {
      floors: Number(data.floors),
      totalPeople: Number(data.totalPeople),
      floorPeople: {},
      totalAmount: 0,
      createdAt: new Date().toISOString()
    }

    floorArray.forEach((floor) => {
      const floorKey = `floor${floor}`
      const value = Number(data[floorKey]) || 0
      splitBillData.floorPeople[floorKey] = value
      splitBillData.totalAmount += value
    })

    localStorage.setItem('splitBillData', JSON.stringify(splitBillData))
    console.log('Datos guardados:', splitBillData)
  }

  const nextStep = async () => {
    if (step === 0) {
      // Validamos campos específicos del paso 1
      const isValid = await trigger(['floors', 'totalPeople'])
      if (isValid) setStep(1)
    } else {
      const isValid = await trigger()
      if (isValid) {
        // Ejecutamos el submit manualmente antes de navegar
        await handleSubmit(onSubmit)()
        router.push('/split')
      }
    }
  }

  const prevStep = () => setStep(0)

  // Cargar datos al montar el componente
  useEffect(() => {
    const savedData = localStorage.getItem('splitBillData')
    if (savedData) {
      try {
        const parsedData: SplitBillData = JSON.parse(savedData)
        setValue('floors', parsedData.floors)
        setValue('totalPeople', parsedData.totalPeople)
        setFloors(parsedData.floors)
        setTotalPeople(parsedData.totalPeople)

        Object.entries(parsedData.floorPeople).forEach(([key, value]) => {
          setValue(key, value)
        })
      } catch (error) {
        console.error('Error al cargar datos guardados:', error)
      }
    }
  }, [setValue])

  const autoDistribute = () => {
    if (totalPeople <= 0 || floors <= 0) return

    const baseAmount = Math.floor(totalPeople / floors)
    const remainder = totalPeople % floors

    floorArray.forEach((floor, index) => {
      let peopleForFloor = baseAmount
      if (index < remainder) peopleForFloor += 1
      setValue(`floor${floor}`, peopleForFloor)
    })
  }

  const calculateCurrentTotal = (): number => {
    let total = 0
    floorArray.forEach((floor) => {
      const value = Number(watch(`floor${floor}`)) || 0
      total += value
    })
    return total
  }

  const currentTotal = calculateCurrentTotal()
  const difference = totalPeople - currentTotal

  return (
    <div className='split-form-container'>
      <div className='form-header'>
        <h1>Calculadora de Distribución</h1>
        <p>Paso {step + 1} de 2</p>

        <div className='progress-bar'>
          <div
            className='progress-fill'
            style={{ width: `${step === 0 ? 50 : 100}%` }}
          />
        </div>
      </div>

      <div className='step-indicators'>
        <div
          className={`step-indicator ${step >= 0 ? 'active' : ''} ${
            step > 0 ? 'completed' : ''
          }`}
        >
          <div className='step-icon'>{step > 0 ? '✅' : '1️⃣'}</div>
          <div className='step-text'>
            <span className='step-number'>Paso 1</span>
            <span className='step-title'>Configuración</span>
          </div>
          <div className='step-connector' />
        </div>

        <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
          <div className='step-icon'>{step === 1 ? '2️⃣' : '✅'}</div>
          <div className='step-text'>
            <span className='step-number'>Paso 2</span>
            <span className='step-title'>Distribución</span>
          </div>
        </div>
      </div>

      <div className='form-wrapper'>
        <form onSubmit={handleSubmit(onSubmit)}>
          {step === 0 && (
            <div className='form-step active'>
              <h2>Configuración Inicial</h2>
              <div className='form-grid'>
                <div className='form-group'>
                  <label htmlFor='floors'>Cantidad de Pisos (1-10)</label>
                  <input
                    id='floors'
                    type='number'
                    {...register('floors', {
                      required: 'Requerido',
                      min: 1,
                      max: 10,
                      valueAsNumber: true
                    })}
                    className={errors.floors ? 'error' : ''}
                  />
                  {errors.floors && (
                    <span className='error-message'>
                      {errors.floors.message}
                    </span>
                  )}
                </div>

                <div className='form-group'>
                  <label htmlFor='totalPeople'>Total de Personas</label>
                  <input
                    id='totalPeople'
                    type='number'
                    {...register('totalPeople', {
                      required: 'Requerido',
                      min: 1,
                      valueAsNumber: true
                    })}
                    className={errors.totalPeople ? 'error' : ''}
                  />
                  {errors.totalPeople && (
                    <span className='error-message'>
                      {errors.totalPeople.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className='form-step active'>
              <h2>Distribución</h2>
              <div className='distribution-controls'>
                <button
                  type='button'
                  onClick={autoDistribute}
                  className='btn-distribute'
                >
                  ⚡ Autodistribuir
                </button>
                <div className='distribution-info'>
                  <span
                    className={`difference ${
                      difference === 0 ? 'balanced' : 'unbalanced'
                    }`}
                  >
                    {difference === 0
                      ? '✅ Todo asignado'
                      : `Restan: ${difference}`}
                  </span>
                </div>
              </div>

              <div className='floors-grid'>
                {floorArray.map((floor) => (
                  <div key={floor} className='floor-input-group'>
                    <label>Piso {floor}</label>
                    <input
                      type='number'
                      {...register(`floor${floor}`, {
                        required: true,
                        min: 0,
                        valueAsNumber: true
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='form-navigation'>
            {step > 0 && (
              <button
                type='button'
                onClick={prevStep}
                className='btn btn-secondary'
              >
                ← Volver
              </button>
            )}
            <div className='step-counter'>Paso {step + 1} de 2</div>
            <button
              type='button'
              onClick={nextStep}
              className={step === 1 ? 'btn btn-submit' : 'btn btn-primary'}
              disabled={step === 1 && difference !== 0}
            >
              {step === 0 ? 'Siguiente →' : 'Finalizar y Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
