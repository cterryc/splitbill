import {
  MdReceiptLong,
  MdGroup,
  MdPieChart,
  MdKeyboardArrowRight
} from 'react-icons/md'

// components/StepsSection.tsx
export default function StepsSection() {
  const steps = [
    {
      icon: <MdReceiptLong className='w-7 h-7' />,
      title: '1. Ingresa el monto',
      description:
        'Simplemente escribe el total que aparece en tu recibo de agua mensual.'
    },
    {
      icon: <MdGroup className='w-7 h-7' />,
      title: '2. Define habitantes',
      description:
        'Indica cuántas personas viven actualmente en cada departamento o piso.'
    },
    {
      icon: <MdPieChart className='w-7 h-7' />,
      title: '3. Obtén el desglose',
      description:
        'Recibe al instante cuánto debe pagar cada familia con total transparencia.'
    }
  ]

  return (
    <section className='py-24 bg-white dark:bg-background-dark'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-text-main dark:text-white'>
            ¿Cómo funciona?
          </h2>
          <p className='mt-4 text-lg text-text-muted dark:text-slate-400'>
            Solo necesitas 3 pasos para obtener cuentas claras.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {steps.map((step, index) => (
            <div
              key={index}
              className='group relative flex flex-col items-center rounded-2xl bg-white dark:bg-background-dark-alt p-8 text-center ring-1 ring-slate-200 dark:ring-slate-800 transition-all hover:shadow-xl dark:hover:shadow-slate-900/50 hover:-translate-y-1'
            >
              <div className='mb-6 flex size-16 items-center justify-center rounded-full bg-blue-50 dark:bg-primary/20 text-primary group-hover:scale-110 transition-transform duration-300'>
                <span className='material-symbols-outlined text-3xl'>
                  {step.icon}
                </span>
              </div>
              <h3 className='mb-3 text-xl font-bold text-text-main dark:text-white'>
                {step.title}
              </h3>
              <p className='text-text-muted dark:text-slate-400 leading-relaxed'>
                {step.description}
              </p>

              {/* Arrow for desktop (except last item) */}
              {index < steps.length - 1 && (
                <div className='hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 text-slate-300 dark:text-slate-700 z-10'>
                  <MdKeyboardArrowRight className='w-8 h-8' />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
