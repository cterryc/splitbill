'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import './SplitPage.css'
import Link from 'next/link'

// Tipos TypeScript
interface FloorPeople {
  [key: string]: number
}

interface SplitBillData {
  floors: number
  totalPeople: number
  floorPeople: FloorPeople
  totalAmount: number
  createdAt: string
}

interface SplitResult {
  floorName: string
  peopleCount: number
  amount: number
  roundedAmount: number
  percentage: number
  amountPerPerson: number
}

type CalculationMethod = 'perPerson' | 'equal'

export default function SplitPage() {
  const router = useRouter()
  const [splitData, setSplitData] = useState<SplitBillData | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalAmount, setTotalAmount] = useState<string>('')
  const [splitResults, setSplitResults] = useState<SplitResult[]>([])
  const [calculationMethod, setCalculationMethod] =
    useState<CalculationMethod>('perPerson')
  const [isMobile, setIsMobile] = useState(false)
  const [showDetails, setShowDetails] = useState<number | null>(null)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cargar datos del localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('splitBillData')
    if (savedData) {
      try {
        const parsedData: SplitBillData = JSON.parse(savedData)
        setSplitData(parsedData)
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    } else {
      // Redirigir al formulario si no hay datos
      router.push('/split-form')
    }
    setLoading(false)
  }, [router])

  // Función para redondear a múltiplos de 10 céntimos (0.10)
  const roundToNearestTenCents = (amount: number): number => {
    return Math.ceil(amount * 10) / 10
  }

  // Calcular distribución cuando cambia el monto o el método
  useEffect(() => {
    if (splitData && totalAmount && !isNaN(parseFloat(totalAmount))) {
      calculateSplit()
    } else {
      setSplitResults([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount, calculationMethod, splitData])

  const calculateSplit = () => {
    const amount = parseFloat(totalAmount)
    if (!amount || amount <= 0) {
      setSplitResults([])
      return
    }

    const results: SplitResult[] = []
    let totalPeople = 0

    // Calcular total de personas
    Object.values(splitData!.floorPeople || {}).forEach((value) => {
      totalPeople += parseInt(value.toString()) || 0
    })

    if (totalPeople === 0) {
      setSplitResults([])
      return
    }

    if (calculationMethod === 'perPerson') {
      // Método por persona: divide el monto entre todas las personas
      const amountPerPerson = amount / totalPeople

      Object.entries(splitData!.floorPeople || {}).forEach(
        ([floorName, peopleCount]) => {
          const people = parseInt(peopleCount.toString()) || 0
          const rawAmount = amountPerPerson * people
          const roundedAmount = roundToNearestTenCents(rawAmount)

          results.push({
            floorName,
            peopleCount: people,
            amount: rawAmount,
            roundedAmount,
            percentage: (people / totalPeople) * 100,
            amountPerPerson: people > 0 ? rawAmount / people : 0
          })
        }
      )
    } else {
      // Método igualitario: divide el monto igual entre los pisos
      const floorsCount = Object.keys(splitData!.floorPeople || {}).length
      const rawAmountPerFloor = amount / floorsCount
      const roundedAmountPerFloor = roundToNearestTenCents(rawAmountPerFloor)

      Object.entries(splitData!.floorPeople || {}).forEach(
        ([floorName, peopleCount]) => {
          const people = parseInt(peopleCount.toString()) || 0

          results.push({
            floorName,
            peopleCount: people,
            amount: rawAmountPerFloor,
            roundedAmount: roundedAmountPerFloor,
            percentage: 100 / floorsCount,
            amountPerPerson: people > 0 ? rawAmountPerFloor / people : 0
          })
        }
      )
    }

    setSplitResults(results)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Permitir números decimales con máximo 2 decimales
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setTotalAmount(value)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatCurrencyCompact = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const calculateSummary = () => {
    if (splitResults.length === 0) return null

    const totalCalculated = splitResults.reduce(
      (sum, item) => sum + item.roundedAmount,
      0
    )
    const totalPeople = splitResults.reduce(
      (sum, item) => sum + item.peopleCount,
      0
    )
    const averagePerPerson =
      totalPeople > 0 ? parseFloat(totalAmount) / totalPeople : 0

    return {
      totalCalculated,
      totalPeople,
      averagePerPerson
    }
  }

  const summary = calculateSummary()

  if (loading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  if (!splitData) {
    return (
      <div className='no-data-container'>
        <h2>No hay datos disponibles</h2>
        <p>Por favor, completa el formulario primero</p>
        <button onClick={() => router.push('/split-form')} className='btn-back'>
          Ir al Formulario
        </button>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className='split-page-container'>
        <div className='page-header'>
          <h1 className='page-title'>Calculadora de División</h1>
          <p className='page-subtitle'>
            Divide un monto entre los pisos/grupos según la distribución
            configurada
          </p>
          <div className='currency-info'>
            💰 Soles Peruanos - Redondeo a 10 céntimos
          </div>
        </div>

        <div className='calculator-grid'>
          {/* Panel de Cálculo */}
          <div className='calculation-panel'>
            <div className='panel-header'>
              <h2 className='panel-title'>Monto a Dividir</h2>
            </div>

            <div className='amount-input-container mobil'>
              <div className='amount-input-wrapper'>
                <span className='currency-symbol'>S/</span>
                <input
                  id='totalAmount'
                  type='text'
                  value={totalAmount}
                  onChange={handleAmountChange}
                  placeholder='0.00'
                  className='amount-input'
                  inputMode='decimal'
                  aria-label='Monto total en soles peruanos'
                />
              </div>
              <div className='input-hint'>
                Introduce el monto en Soles Peruanos
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {splitResults.length > 0 && (
          <div className='results-panel'>
            <div className='panel-header'>
              <h2 className='panel-title'>Resultados</h2>
              <div className='total-amount-display'>
                {isMobile
                  ? formatCurrencyCompact(parseFloat(totalAmount))
                  : `Total: ${formatCurrency(parseFloat(totalAmount))}`}
              </div>
            </div>

            {/* Tabla de resultados - Versión móvil */}
            <div className='mobile-results'>
              {[...splitResults].reverse().map((result, index) => {
                const difference = result.roundedAmount - result.amount
                return (
                  <div
                    key={index}
                    className='mobile-result-card'
                    onClick={() =>
                      setShowDetails((state) =>
                        index === state ? null : index
                      )
                    }
                  >
                    <div
                      className={`mobile-result-header ${
                        showDetails === index ? 'details' : ''
                      }`}
                    >
                      <h3>{result.floorName.replace('floor', 'Piso ')}</h3>
                      <div className='mobile-amount'>
                        <strong>
                          {formatCurrencyCompact(result.roundedAmount)}
                        </strong>
                      </div>
                    </div>

                    {showDetails === index && (
                      <>
                        <div className='mobile-result-details'>
                          <div className='detail-row'>
                            <span>Personas:</span>
                            <span>{result.peopleCount}</span>
                          </div>
                          <div className='detail-row'>
                            <span>Porcentaje:</span>
                            <span>{result.percentage.toFixed(1)}%</span>
                          </div>
                          <div className='detail-row'>
                            <span>Original:</span>
                            <span className='original-amount'>
                              {formatCurrencyCompact(result.amount)}
                            </span>
                          </div>
                          <div className='detail-row'>
                            <span>Diferencia:</span>
                            <span
                              className={`difference ${
                                difference === 0
                                  ? 'neutral'
                                  : difference > 0
                                  ? 'positive'
                                  : 'negative'
                              }`}
                            >
                              {difference === 0
                                ? '✓'
                                : difference > 0
                                ? `+${formatCurrencyCompact(difference)}`
                                : formatCurrencyCompact(difference)}
                            </span>
                          </div>
                        </div>

                        <div className='percentage-bar-mobile'>
                          <div
                            className='percentage-fill-mobile'
                            style={{
                              width: `${Math.min(result.percentage, 100)}%`
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )
              })}

              {/* Total móvil */}
              {/* <div className='mobile-total-card'>
                <div className='mobile-total-header'>
                  <h3>TOTAL</h3>
                  <div className='mobile-total-amount'>
                    {formatCurrencyCompact(summary?.totalCalculated || 0)}
                  </div>
                </div>
                <div className='mobile-total-details'>
                  <div className='detail-row'>
                    <span>Personas totales:</span>
                    <span>{summary?.totalPeople || 0}</span>
                  </div>
                  <div className='detail-row'>
                    <span>Diferencia total:</span>
                    <span
                      className={
                        summary &&
                        summary.totalCalculated - parseFloat(totalAmount) === 0
                          ? 'neutral'
                          : summary &&
                            summary.totalCalculated - parseFloat(totalAmount) >
                              0
                          ? 'positive'
                          : 'negative'
                      }
                    >
                      {summary &&
                        formatCurrencyCompact(
                          summary.totalCalculated - parseFloat(totalAmount)
                        )}
                    </span>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Resumen compacto para móvil */}
            {/* <div className='mobile-summary'>
              <div className='mobile-summary-item'>
                <span>Método:</span>
                <span>
                  {calculationMethod === 'perPerson' ? 'Por Persona' : 'Igual'}
                </span>
              </div>
              {calculationMethod === 'perPerson' && summary && (
                <div className='mobile-summary-item'>
                  <span>Por persona:</span>
                  <span>{formatCurrencyCompact(summary.averagePerPerson)}</span>
                </div>
              )}
            </div> */}

            {/* Acciones - Versión móvil compacta */}
            <div className='mobile-actions'>
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  ((): string => {
                    const resultsText = [...splitResults]
                      .reverse()
                      .map(
                        (result) =>
                          `${result.floorName.replace(
                            'floor',
                            'Piso '
                          )}: ${formatCurrency(result.roundedAmount)} (${
                            result.peopleCount
                          } personas)`
                      )
                      .join('\n')

                    const summaryText =
                      `Total: ${formatCurrency(parseFloat(totalAmount))}\n\n` +
                      `DETALLE:\n${resultsText}`

                    return summaryText
                  })()
                )}`}
                target='_blank'
                className='btn-copy-mobile'
              >
                <FaWhatsapp className='h-5 w-5' /> WhatsApp
              </Link>

              <button
                onClick={() => {
                  setTotalAmount('')
                  setSplitResults([])
                }}
                className='btn-reset-mobile'
              >
                🔄 Nuevo
              </button>
            </div>
          </div>
        )}

        <div className='calculator-grid'>
          {/* Panel de Cálculo */}
          <div className='calculation-panel'>
            {/* Método de cálculo */}
            <div className='method-selection'>
              <h3 className='method-title'>Método de División</h3>
              <div className='method-options'>
                <label className='method-option'>
                  <input
                    type='radio'
                    name='calculationMethod'
                    value='perPerson'
                    checked={calculationMethod === 'perPerson'}
                    onChange={(e) =>
                      setCalculationMethod(e.target.value as CalculationMethod)
                    }
                    aria-label='Método por persona'
                  />
                  <div className='method-content'>
                    <span className='method-title'>Por Persona</span>
                    <span className='method-description'>
                      Divide entre personas y asigna por piso
                    </span>
                  </div>
                </label>

                <label className='method-option'>
                  <input
                    type='radio'
                    name='calculationMethod'
                    value='equal'
                    checked={calculationMethod === 'equal'}
                    onChange={(e) =>
                      setCalculationMethod(e.target.value as CalculationMethod)
                    }
                    aria-label='Método igual entre pisos'
                  />
                  <div className='method-content'>
                    <span className='method-title'>Igual entre Pisos</span>
                    <span className='method-description'>
                      Divide igualmente entre los pisos
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Información de redondeo */}
            <div className='rounding-info'>
              <div className='info-icon'>ℹ️</div>
              <div className='info-content'>
                <strong>Nota de redondeo:</strong>
                <p>Redondeo a múltiplos de 0.10 S/</p>
              </div>
            </div>
          </div>

          {/* Panel de Configuración */}
          <div className='config-panel'>
            <div className='panel-header'>
              <h2 className='panel-title'>Configuración Actual</h2>
              <button
                onClick={() => router.push('/split-form')}
                className='btn-edit-config'
                aria-label='Editar configuración'
              >
                {isMobile ? '✏️' : '✏️ Editar'}
              </button>
            </div>

            <div className='config-summary'>
              <div className='config-item'>
                <span className='config-label'>Pisos/Grupos:</span>
                <span className='config-value'>{splitData.floors}</span>
              </div>

              <div className='config-item'>
                <span className='config-label'>Total Personas:</span>
                <span className='config-value'>{splitData.totalPeople}</span>
              </div>

              <div className='config-item'>
                <span className='config-label'>Distribución:</span>
                <div className='people-distribution'>
                  {Object.entries(splitData.floorPeople || {}).map(
                    ([key, value]) => (
                      <div key={key} className='people-item'>
                        <span>
                          {key.replace('floor', isMobile ? 'P' : 'Piso ')}:
                        </span>
                        <strong>
                          {value} {isMobile ? 'p' : 'personas'}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        {splitResults.length > 0 && (
          <div className='results-panel'>
            {/* Tabla de resultados - Versión móvil */}
            <div className='mobile-results'>
              {/* Total móvil */}
              <div className='mobile-total-card'>
                <div className='mobile-total-header'>
                  <h3>TOTAL</h3>
                  <div className='mobile-total-amount'>
                    {formatCurrencyCompact(summary?.totalCalculated || 0)}
                  </div>
                </div>
                <div className='mobile-total-details'>
                  <div className='detail-row'>
                    <span>Personas totales:</span>
                    <span>{summary?.totalPeople || 0}</span>
                  </div>
                  <div className='detail-row'>
                    <span>Diferencia total:</span>
                    <span
                      className={
                        summary &&
                        summary.totalCalculated - parseFloat(totalAmount) === 0
                          ? 'neutral'
                          : summary &&
                            summary.totalCalculated - parseFloat(totalAmount) >
                              0
                          ? 'positive'
                          : 'negative'
                      }
                    >
                      {summary &&
                        formatCurrencyCompact(
                          summary.totalCalculated - parseFloat(totalAmount)
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen compacto para móvil */}
            <div className='mobile-summary'>
              <div className='mobile-summary-item'>
                <span>Método:</span>
                <span>
                  {calculationMethod === 'perPerson' ? 'Por Persona' : 'Igual'}
                </span>
              </div>
              {calculationMethod === 'perPerson' && summary && (
                <div className='mobile-summary-item'>
                  <span>Por persona:</span>
                  <span>{formatCurrencyCompact(summary.averagePerPerson)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Acciones globales - Versión móvil */}
        <div className='mobile-global-actions'>
          <button
            onClick={() => router.push('/split-form')}
            className='btn-mobile-edit'
          >
            ✏️ Modificar
          </button>
          <button
            onClick={() => {
              if (confirm('¿Limpiar todos los datos?')) {
                localStorage.removeItem('splitBillData')
                router.push('/split-form')
              }
            }}
            className='btn-mobile-clear'
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='split-page-container'>
      <div className='page-header'>
        <h1 className='page-title'>Calculadora de División</h1>
        <p className='page-subtitle'>
          Divide un monto entre los pisos/grupos según la distribución
          configurada
        </p>
        <div className='currency-info'>
          💰 Soles Peruanos - Redondeo a 10 céntimos
        </div>
      </div>

      <div className='calculator-grid'>
        {/* Panel de Configuración */}
        <div className='config-panel'>
          <div className='panel-header'>
            <h2 className='panel-title'>Configuración Actual</h2>
            <button
              onClick={() => router.push('/split-form')}
              className='btn-edit-config'
              aria-label='Editar configuración'
            >
              {isMobile ? '✏️' : '✏️ Editar'}
            </button>
          </div>

          <div className='config-summary'>
            <div className='config-item'>
              <span className='config-label'>Pisos/Grupos:</span>
              <span className='config-value'>{splitData.floors}</span>
            </div>

            <div className='config-item'>
              <span className='config-label'>Total Personas:</span>
              <span className='config-value'>{splitData.totalPeople}</span>
            </div>

            <div className='config-item'>
              <span className='config-label'>Distribución:</span>
              <div className='people-distribution'>
                {Object.entries(splitData.floorPeople || {}).map(
                  ([key, value]) => (
                    <div key={key} className='people-item'>
                      <span>
                        {key.replace('floor', isMobile ? 'P' : 'Piso ')}:
                      </span>
                      <strong>
                        {value} {isMobile ? 'p' : 'personas'}
                      </strong>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Cálculo */}
        <div className='calculation-panel'>
          <div className='panel-header'>
            <h2 className='panel-title'>Monto a Dividir</h2>
          </div>

          <div className='amount-input-container'>
            <label htmlFor='totalAmount' className='amount-label'>
              Monto Total *
            </label>
            <div className='amount-input-wrapper'>
              <span className='currency-symbol'>S/</span>
              <input
                id='totalAmount'
                type='text'
                value={totalAmount}
                onChange={handleAmountChange}
                placeholder='0.00'
                className='amount-input'
                inputMode='decimal'
                aria-label='Monto total en soles peruanos'
              />
            </div>
            <div className='input-hint'>
              Introduce el monto en Soles Peruanos
            </div>
          </div>

          {/* Método de cálculo */}
          <div className='method-selection'>
            <h3 className='method-title'>Método de División</h3>
            <div className='method-options'>
              <label className='method-option'>
                <input
                  type='radio'
                  name='calculationMethod'
                  value='perPerson'
                  checked={calculationMethod === 'perPerson'}
                  onChange={(e) =>
                    setCalculationMethod(e.target.value as CalculationMethod)
                  }
                  aria-label='Método por persona'
                />
                <div className='method-content'>
                  <span className='method-title'>Por Persona</span>
                  <span className='method-description'>
                    {isMobile
                      ? 'Divide entre personas y asigna por piso'
                      : 'Divide el monto entre todas las personas y asigna según la cantidad por piso'}
                  </span>
                </div>
              </label>

              <label className='method-option'>
                <input
                  type='radio'
                  name='calculationMethod'
                  value='equal'
                  checked={calculationMethod === 'equal'}
                  onChange={(e) =>
                    setCalculationMethod(e.target.value as CalculationMethod)
                  }
                  aria-label='Método igual entre pisos'
                />
                <div className='method-content'>
                  <span className='method-title'>Igual entre Pisos</span>
                  <span className='method-description'>
                    {isMobile
                      ? 'Divide igualmente entre los pisos'
                      : 'Divide el monto igualmente entre todos los pisos/grupos'}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Información de redondeo */}
          <div className='rounding-info'>
            <div className='info-icon'>ℹ️</div>
            <div className='info-content'>
              <strong>Nota de redondeo:</strong>
              <p>
                {isMobile
                  ? 'Redondeo a múltiplos de 0.10 S/'
                  : 'Los montos se redondean a múltiplos de 10 céntimos (0.10 S/)'}
              </p>
              {!isMobile && (
                <p className='examples'>
                  Ejemplos: 15.21 → 15.30 | 14.34 → 14.30 | 25.67 → 25.70
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {splitResults.length > 0 && (
        <div className='results-panel'>
          <div className='panel-header'>
            <h2 className='panel-title'>Resultados</h2>
            <div className='total-amount-display'>
              {isMobile
                ? formatCurrencyCompact(parseFloat(totalAmount))
                : `Total: ${formatCurrency(parseFloat(totalAmount))}`}
            </div>
          </div>

          {/* Resumen para desktop */}
          {!isMobile && (
            <div className='results-summary'>
              <div className='summary-item'>
                <span>Método:</span>
                <strong>
                  {calculationMethod === 'perPerson'
                    ? 'Por Persona'
                    : 'Igual entre Pisos'}
                </strong>
              </div>
              {calculationMethod === 'perPerson' && summary && (
                <>
                  <div className='summary-item'>
                    <span>Por persona:</span>
                    <strong>{formatCurrency(summary.averagePerPerson)}</strong>
                  </div>
                  <div className='summary-item'>
                    <span>Total personas:</span>
                    <strong>{summary.totalPeople}</strong>
                  </div>
                </>
              )}
              <div className='summary-item'>
                <span>Moneda:</span>
                <strong>PEN</strong>
              </div>
            </div>
          )}

          {/* Tabla de resultados - Versión móvil */}
          {isMobile ? (
            <div className='mobile-results'>
              {[...splitResults].reverse().map((result, index) => {
                const difference = result.roundedAmount - result.amount
                return (
                  <div
                    key={index}
                    className='mobile-result-card'
                    onClick={() =>
                      setShowDetails((state) =>
                        index === state ? null : index
                      )
                    }
                  >
                    <div
                      className={`mobile-result-header ${
                        showDetails === index ? 'details' : ''
                      }`}
                    >
                      <h3>{result.floorName.replace('floor', 'Piso ')}</h3>
                      <div className='mobile-amount'>
                        <strong>
                          {formatCurrencyCompact(result.roundedAmount)}
                        </strong>
                      </div>
                    </div>

                    {showDetails === index && (
                      <>
                        <div className='mobile-result-details'>
                          <div className='detail-row'>
                            <span>Personas:</span>
                            <span>{result.peopleCount}</span>
                          </div>
                          <div className='detail-row'>
                            <span>Porcentaje:</span>
                            <span>{result.percentage.toFixed(1)}%</span>
                          </div>
                          <div className='detail-row'>
                            <span>Original:</span>
                            <span className='original-amount'>
                              {formatCurrencyCompact(result.amount)}
                            </span>
                          </div>
                          <div className='detail-row'>
                            <span>Diferencia:</span>
                            <span
                              className={`difference ${
                                difference === 0
                                  ? 'neutral'
                                  : difference > 0
                                  ? 'positive'
                                  : 'negative'
                              }`}
                            >
                              {difference === 0
                                ? '✓'
                                : difference > 0
                                ? `+${formatCurrencyCompact(difference)}`
                                : formatCurrencyCompact(difference)}
                            </span>
                          </div>
                        </div>

                        <div className='percentage-bar-mobile'>
                          <div
                            className='percentage-fill-mobile'
                            style={{
                              width: `${Math.min(result.percentage, 100)}%`
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                )
              })}

              {/* Total móvil */}
              <div className='mobile-total-card'>
                <div className='mobile-total-header'>
                  <h3>TOTAL</h3>
                  <div className='mobile-total-amount'>
                    {formatCurrencyCompact(summary?.totalCalculated || 0)}
                  </div>
                </div>
                <div className='mobile-total-details'>
                  <div className='detail-row'>
                    <span>Personas totales:</span>
                    <span>{summary?.totalPeople || 0}</span>
                  </div>
                  <div className='detail-row'>
                    <span>Diferencia total:</span>
                    <span
                      className={
                        summary &&
                        summary.totalCalculated - parseFloat(totalAmount) === 0
                          ? 'neutral'
                          : summary &&
                            summary.totalCalculated - parseFloat(totalAmount) >
                              0
                          ? 'positive'
                          : 'negative'
                      }
                    >
                      {summary &&
                        formatCurrencyCompact(
                          summary.totalCalculated - parseFloat(totalAmount)
                        )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tabla de resultados - Versión desktop */
            <div className='results-table'>
              <div className='table-header'>
                <div className='table-cell'>Piso/Grupo</div>
                <div className='table-cell'>Personas</div>
                <div className='table-cell'>Porcentaje</div>
                <div className='table-cell'>Original</div>
                <div className='table-cell'>Redondeado</div>
                <div className='table-cell'>Diferencia</div>
              </div>

              {splitResults.map((result, index) => {
                const difference = result.roundedAmount - result.amount
                return (
                  <div key={index} className='table-row'>
                    <div className='table-cell floor-name'>
                      {result.floorName.replace('floor', 'Piso ')}
                    </div>
                    <div className='table-cell'>
                      <span className='people-count'>{result.peopleCount}</span>
                    </div>
                    <div className='table-cell'>
                      <div className='percentage-display'>
                        <div className='percentage-bar'>
                          <div
                            className='percentage-fill'
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                        <span className='percentage-value'>
                          {result.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className='table-cell'>
                      <div className='original-amount'>
                        {formatCurrency(result.amount)}
                      </div>
                    </div>
                    <div className='table-cell amount-cell'>
                      <strong>{formatCurrency(result.roundedAmount)}</strong>
                    </div>
                    <div className='table-cell'>
                      <div
                        className={`difference-badge ${
                          difference === 0
                            ? 'neutral'
                            : difference > 0
                            ? 'positive'
                            : 'negative'
                        }`}
                      >
                        {difference === 0
                          ? '✓'
                          : difference > 0
                          ? `+${formatCurrency(difference)}`
                          : formatCurrency(difference)}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Total desktop */}
              <div className='table-row total-row'>
                <div className='table-cell'>
                  <strong>TOTAL</strong>
                </div>
                <div className='table-cell'>
                  <strong>{summary?.totalPeople || 0}</strong>
                </div>
                <div className='table-cell'>
                  <strong>100%</strong>
                </div>
                <div className='table-cell'>
                  <strong>{formatCurrency(parseFloat(totalAmount))}</strong>
                </div>
                <div className='table-cell amount-cell'>
                  <strong className='total-amount'>
                    {formatCurrency(summary?.totalCalculated || 0)}
                  </strong>
                </div>
                <div className='table-cell'>
                  <div className='total-difference'>
                    {summary &&
                      formatCurrency(
                        summary.totalCalculated - parseFloat(totalAmount)
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumen compacto para móvil */}
          {isMobile && (
            <div className='mobile-summary'>
              <div className='mobile-summary-item'>
                <span>Método:</span>
                <span>
                  {calculationMethod === 'perPerson' ? 'Por Persona' : 'Igual'}
                </span>
              </div>
              {calculationMethod === 'perPerson' && summary && (
                <div className='mobile-summary-item'>
                  <span>Por persona:</span>
                  <span>{formatCurrencyCompact(summary.averagePerPerson)}</span>
                </div>
              )}
            </div>
          )}

          {/* Acciones - Versión móvil compacta */}
          {isMobile ? (
            <div className='mobile-actions'>
              <button
                onClick={() => {
                  const resultsText = splitResults
                    .map(
                      (result) =>
                        `${result.floorName.replace(
                          'floor',
                          'Piso '
                        )}: ${formatCurrency(result.roundedAmount)} (${
                          result.peopleCount
                        } personas)`
                    )
                    .join('\n')

                  const summaryText =
                    `RESULTADOS\n` +
                    `Total: ${formatCurrency(parseFloat(totalAmount))}\n` +
                    `Método: ${
                      calculationMethod === 'perPerson'
                        ? 'Por Persona'
                        : 'Igual'
                    }\n\n` +
                    `DETALLE:\n${resultsText}`

                  navigator.clipboard.writeText(summaryText)
                  alert('Resultados copiados!')
                }}
                className='btn-copy-mobile'
              >
                📋 Copiar
              </button>

              <button
                onClick={() => {
                  setTotalAmount('')
                  setSplitResults([])
                }}
                className='btn-reset-mobile'
              >
                🔄 Nuevo
              </button>
            </div>
          ) : (
            /* Acciones - Versión desktop */
            <div className='results-actions'>
              <button
                onClick={() => {
                  const resultsText = splitResults
                    .map(
                      (result) =>
                        `${result.floorName.replace(
                          'floor',
                          'Piso '
                        )}: ${formatCurrency(result.roundedAmount)} (${
                          result.peopleCount
                        } personas) - Original: ${formatCurrency(
                          result.amount
                        )}`
                    )
                    .join('\n')

                  const summaryText =
                    `RESULTADOS DE DIVISIÓN\n\n` +
                    `Total: ${formatCurrency(parseFloat(totalAmount))}\n` +
                    `Método: ${
                      calculationMethod === 'perPerson'
                        ? 'Por Persona'
                        : 'Igual entre Pisos'
                    }\n` +
                    `Moneda: Soles Peruanos (PEN)\n` +
                    `Redondeo: A 10 céntimos\n\n` +
                    `DETALLE POR PISO:\n${resultsText}\n\n` +
                    `Total Redondeado: ${formatCurrency(
                      summary?.totalCalculated || 0
                    )}`

                  navigator.clipboard.writeText(summaryText)
                  alert('Resultados copiados al portapapeles!')
                }}
                className='btn-copy'
              >
                📋 Copiar Resultados
              </button>

              <button
                onClick={() => {
                  setTotalAmount('')
                  setSplitResults([])
                }}
                className='btn-reset'
              >
                🔄 Nuevo Cálculo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Acciones globales - Versión móvil */}
      {isMobile ? (
        <div className='mobile-global-actions'>
          <button
            onClick={() => router.push('/split-form')}
            className='btn-mobile-edit'
          >
            ✏️ Modificar
          </button>
          <button
            onClick={() => {
              if (confirm('¿Limpiar todos los datos?')) {
                localStorage.removeItem('splitBillData')
                router.push('/split-form')
              }
            }}
            className='btn-mobile-clear'
          >
            🗑️ Limpiar
          </button>
        </div>
      ) : (
        /* Acciones globales - Versión desktop */
        <div className='global-actions'>
          <button
            onClick={() => router.push('/split-form')}
            className='btn-edit-config'
          >
            ✏️ Modificar Configuración
          </button>
          <button
            onClick={() => {
              if (
                confirm('¿Estás seguro de que quieres limpiar todos los datos?')
              ) {
                localStorage.removeItem('splitBillData')
                router.push('/split-form')
              }
            }}
            className='btn-clear-data'
          >
            🗑️ Limpiar Todos los Datos
          </button>
        </div>
      )}
    </div>
  )
}
