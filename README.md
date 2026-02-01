# 💧 SplitBill Casa

**Divide tus recibos de agua justamente entre pisos y departamentos**

SplitBill Casa es una aplicación web que calcula automáticamente cómo dividir el recibo de agua de un edificio entre diferentes pisos o grupos, considerando el número de personas en cada uno [0-cite-0](#0-cite-0) .

## ✨ Características

- **Cálculo justo**: Divide el monto por persona o equitativamente entre pisos [0-cite-1](#0-cite-1) 
- **Redondeo automático**: Todos los montos se redondean a múltiplos de 10 céntimos (0.10 S/) [0-cite-2](#0-cite-2) 
- **Interfaz responsive**: Optimizada para móvil y escritorio [0-cite-1](#0-cite-1) 
- **Modo oscuro**: Soporte completo para tema claro y oscuro [0-cite-3](#0-cite-3) 
- **Compartir resultados**: Exporta a WhatsApp o copia al portapapeles [0-cite-1](#0-cite-1) 

## 🚀 Cómo funciona

1. **Ingresa el monto**: Escribe el total de tu recibo de agua [0-cite-4](#0-cite-4) 
2. **Define habitantes**: Indica cuántas personas viven en cada piso [0-cite-5](#0-cite-5) 
3. **Obtén el desglose**: Recibe al instante cuánto debe pagar cada familia [0-cite-6](#0-cite-6) 

## 🛠️ Tecnologías

- **Framework**: Next.js con TypeScript
- **Autenticación**: Clerk (localización en español) [0-cite-7](#0-cite-7) 
- **Estilos**: Tailwind CSS con tema personalizado
- **Iconos**: React Icons (Material Design, Font Awesome) [0-cite-8](#0-cite-8) 

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/cterryc/splitbill.git

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crea un archivo .env.local con tus credenciales de Clerk

# Ejecutar en desarrollo
npm run dev
```

## 💡 Uso

1. Accede a la aplicación en `http://localhost:3000`
2. Inicia sesión o regístrate [0-cite-9](#0-cite-9) 
3. Configura los pisos y habitantes en `/split-form`
4. Calcula la división en `/split`

## 🎨 Características de la interfaz

- **Calculadora interactiva**: Vista previa en tiempo real de los cálculos [0-cite-10](#0-cite-10) 
- **Tarjetas expandibles**: En móvil, toca para ver detalles completos
- **Tabla detallada**: En escritorio, visualiza todos los datos en formato tabla
- **Moneda**: Soles Peruanos (PEN) con formato localizado [0-cite-1](#0-cite-1) 

## 📄 Licencia

© 2024 SplitBill Casa. Cuentas claras, amistades largas [0-cite-11](#0-cite-11) .

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias y mejoras.

---

## Notes

La aplicación utiliza Next.js con autenticación Clerk configurada en español [0-cite-12](#0-cite-12) , y está diseñada específicamente para dividir recibos de agua en edificios peruanos usando soles (PEN) como moneda [0-cite-1](#0-cite-1) . El sistema soporta dos métodos de cálculo: por persona y equitativo entre pisos.

### Citations

**File:** app/layout.tsx (L1-57)
```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/context/ThemeContext'
import { esMX } from '@clerk/localizations'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'SplitBill Casa',
  description: 'Divide tus recibos justamente'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const customEs = {
    ...esMX,
    signIn: {
      ...esMX.signIn,
      start: {
        ...esMX.signIn?.start,
        subtitle: 'para continuar con SplitBill'
      }
    },
    signUp: {
      ...esMX.signUp,
      start: { ...esMX.signUp?.start, subtitle: 'para continuar con SplitBill' }
    },
    formFieldHintText__optional: ''
  }
  return (
    <ClerkProvider localization={customEs}>
      {/* IMPORTANTE: suppressHydrationWarning es necesario */}
      <html lang='es' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-background-light dark:bg-background-dark text-text-main dark:text-white antialiased`}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}


```

**File:** app/split/page.tsx (L636-710)
```typescript
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
```

**File:** app/split/SplitPage.css (L391-450)
```css
}

.info-content strong {
  display: block;
  margin-bottom: 0.375rem;
  color: #92400e;
  font-size: 0.875rem;
}

.dark .info-content strong {
  color: #fbbf24;
}

.info-content p {
  margin: 0.125rem 0;
  color: #92400e;
  font-size: 0.75rem;
  line-height: 1.3;
}

.dark .info-content p {
  color: #fbbf24;
}

.examples {
  font-family: monospace;
  background: white;
  padding: 0.25rem 0.375rem;
  border-radius: 4px;
  margin-top: 0.375rem !important;
  font-size: 0.7rem;
  overflow-wrap: break-word;
  word-break: break-word;
}

.dark .examples {
  background: #1a2730;
  color: #fbbf24;
}

/* RESULTADOS */
.total-amount-display {
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--color-primary);
  background: rgba(43, 173, 238, 0.1);
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  white-space: nowrap;
}

/* Resumen mobile y desktop - SUMMARY ITEM */
.results-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 10px;
```

**File:** components/StepsSection.tsx (L11-16)
```typescript
    {
      icon: <MdReceiptLong className='w-7 h-7' />,
      title: '1. Ingresa el monto',
      description:
        'Simplemente escribe el total que aparece en tu recibo de agua mensual.'
    },
```

**File:** components/StepsSection.tsx (L17-22)
```typescript
    {
      icon: <MdGroup className='w-7 h-7' />,
      title: '2. Define habitantes',
      description:
        'Indica cuántas personas viven actualmente en cada departamento o piso.'
    },
```

**File:** components/StepsSection.tsx (L23-28)
```typescript
    {
      icon: <MdPieChart className='w-7 h-7' />,
      title: '3. Obtén el desglose',
      description:
        'Recibe al instante cuánto debe pagar cada familia con total transparencia.'
    }
```

**File:** components/HeroSection.tsx (L1-81)
```typescript
import { MdSavings } from 'react-icons/md'
import { FaCheckCircle } from 'react-icons/fa'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'

// components/HeroSection.tsx
export default function HeroSection() {
  const { isSignedIn } = useAuth()
  console.log('isSignedIn =>', isSignedIn)

  return (
    <section className='relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-24 lg:pb-32 bg-background-light dark:bg-background-dark'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-16 items-center'>
          {/* Text Content */}
          <div className='lg:col-span-6 text-center lg:text-left flex flex-col gap-6'>
            <h1 className='text-4xl font-black tracking-tight text-text-main dark:text-white sm:text-5xl md:text-6xl lg:leading-tight'>
              Divide tus recibos <br className='hidden lg:block' />
              <span className='text-primary'>sin complicaciones</span>
            </h1>
            <p className='mx-auto lg:mx-0 max-w-2xl text-lg leading-relaxed text-text-muted dark:text-slate-400'>
              La forma justa de compartir los gastos de agua en tu edificio.
              Nuestro algoritmo calcula el consumo por persona y agrupa los
              pagos por piso automáticamente.
            </p>
            <div className='mt-4 flex flex-col sm:flex-row justify-center lg:justify-start gap-4'>
              <Link
                href={isSignedIn ? '/split' : '/sign-in'}
                className='flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:translate-y-[-1px] hover:bg-primary-dark'
              >
                Empezar a calcular
              </Link>
              <Link
                href={isSignedIn ? '/split' : '/sign-in'}
                className='flex h-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 px-8 text-base font-bold text-text-main dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700'
              >
                Ver demo
              </Link>
            </div>
            <div className='mt-4 flex items-center justify-center lg:justify-start gap-2 text-sm text-text-muted dark:text-slate-500'>
              <FaCheckCircle className='h-5 w-5' />
              <span>Gratis para edificios pequeños</span>
            </div>
          </div>

          {/* Image/Visual */}
          <div className='relative mt-12 lg:mt-0 lg:col-span-6'>
            <div className='relative mx-auto w-full max-w-[500px] lg:max-w-none'>
              <div className='aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden'>
                <img
                  alt='Clean blue geometric shapes representing structure and clarity'
                  className='h-full w-full object-cover opacity-90 hover:scale-105 transition-transform duration-700'
                  src='https://lh3.googleusercontent.com/aida-public/AB6AXuCQaRQG5azRO75mBleekUL92BGS_MZ4p9MLrR_QLC7KwZ9jza9E0v621kOSxflAHkYa1-68jvZrob6Fv8tw0eaf9HIIUHJ8TMewd1lJ2y1fFaJlw8aGxnj5TUdVqVrcaTUTdkxUJHWJIu46jrQ1JnhfoPcj0DJw8HqRrxuHkBdvRFLa-grATHvd_AS1FZhPvMInzQCV4V_5OCdOxqBkgJNqR8W4MtNR1Z0u1_a7ckN3CA4rUdzS-H6TEVm7mnWPuj1ie4biInXJ_w'
                />
              </div>

              {/* Floating Badge */}
              <div className='absolute -bottom-6 -left-6 z-10 hidden sm:block'>
                <div className='flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 p-4 shadow-xl border border-slate-100 dark:border-slate-700'>
                  <div className='flex size-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'>
                    <MdSavings className='w-6 h-6' />
                  </div>
                  <div>
                    <p className='text-xs font-medium text-text-muted dark:text-slate-400'>
                      Ahorro promedio
                    </p>
                    <p className='text-lg font-bold text-text-main dark:text-white'>
                      15% mensual
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


```

**File:** components/Footer.tsx (L38-41)
```typescript
        <div className='mt-10 flex flex-col items-center justify-center border-t border-slate-100 dark:border-slate-800 pt-8'>
          <p className='text-center text-sm leading-5 text-text-muted dark:text-slate-500'>
            © 2024 SplitBill Casa. Cuentas claras, amistades largas.
          </p>
```
