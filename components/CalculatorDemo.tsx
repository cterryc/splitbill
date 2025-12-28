import {
  MdApartment,
  MdOutlineRemoveCircleOutline,
  MdAddCircleOutline
} from 'react-icons/md'

// components/CalculatorDemo.tsx
interface Floor {
  id: number
  name: string
  residents: number
}

interface CalculatorDemoProps {
  totalBill: number
  setTotalBill: (value: number) => void
  floors: Floor[]
  updateResidents: (id: number, change: number) => void
}

export default function CalculatorDemo({
  totalBill,
  setTotalBill,
  floors,
  updateResidents
}: CalculatorDemoProps) {
  return (
    <section className='bg-background-alt dark:bg-background-dark-alt py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <span className='mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary'>
            Demo Interactiva
          </span>
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Calculadora Transparente
          </h2>
          <p className='mt-4 text-lg text-text-muted dark:text-slate-400'>
            Simula cómo se vería el desglose de tu edificio en segundos.
          </p>
        </div>

        <div className='mx-auto max-w-2xl rounded-2xl bg-white dark:bg-background-dark p-6 sm:p-8 shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10'>
          {/* Total Bill Input */}
          <div className='mb-8'>
            <label className='mb-2 block text-sm font-semibold text-zinc-800'>
              Monto Total del Recibo de Agua
            </label>
            <div className='relative rounded-lg shadow-sm'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                <span className='text-white sm:text-lg'>$</span>
              </div>
              <input
                className='block w-full rounded-lg border-0 py-4 pl-10 pr-12 text-text-main ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-slate-800 dark:ring-slate-700 dark:text-white sm:text-lg sm:leading-6'
                type='number'
                value={totalBill}
                onChange={(e) => setTotalBill(parseFloat(e.target.value))}
                placeholder='0.00'
              />
              <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4'>
                <span className='text-white sm:text-sm'>MXN</span>
              </div>
            </div>
          </div>

          {/* Floors List */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800'>
              <span className='text-xs font-semibold uppercase text-zinc-900'>
                Departamento
              </span>
              <span className='text-xs font-semibold uppercase text-zinc-900'>
                Habitantes
              </span>
            </div>

            {floors.map((floor) => (
              <div
                key={floor.id}
                className='flex items-center justify-between gap-4 py-1'
              >
                <div className='flex items-center gap-3'>
                  <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-slate-800 text-primary'>
                    <MdApartment className='w-6 h-6' />
                  </div>
                  <p className='font-medium text-text-main dark:text-white'>
                    {floor.name}
                  </p>
                </div>
                <div className='flex items-center gap-3 rounded-full bg-slate-50 dark:bg-slate-800 p-1 ring-1 ring-slate-200 dark:ring-slate-700'>
                  <button
                    onClick={() => updateResidents(floor.id, -1)}
                    className='flex size-8 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-700 text-text-muted shadow-sm hover:text-primary transition-colors'
                  >
                    <MdOutlineRemoveCircleOutline className='w-5 h-5 text-white' />
                  </button>
                  <span className='w-4 text-center text-sm font-semibold text-text-main dark:text-white'>
                    {floor.residents}
                  </span>
                  <button
                    onClick={() => updateResidents(floor.id, 1)}
                    className='flex size-8 cursor-pointer items-center justify-center rounded-full bg-white dark:bg-slate-700 text-text-muted shadow-sm hover:text-primary transition-colors'
                  >
                    <MdAddCircleOutline className='w-5 h-5 text-white' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Calculate Button */}
          <div className='mt-8 border-t border-slate-100 dark:border-slate-800 pt-6'>
            <button className='w-full rounded-lg bg-slate-800 py-3 text-center text-sm font-bold text-white transition-all hover:bg-black/80 dark:hover:bg-slate-400 hover:text-zinc-600'>
              Ver Desglose Completo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
