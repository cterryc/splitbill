import { MdSavings } from 'react-icons/md'
import { FaCheckCircle } from 'react-icons/fa'

// components/HeroSection.tsx
export default function HeroSection() {
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
              <button className='flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:translate-y-[-1px] hover:bg-primary-dark'>
                Empezar a calcular
              </button>
              <button className='flex h-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 px-8 text-base font-bold text-text-main dark:text-slate-200 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700'>
                Ver demo
              </button>
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
