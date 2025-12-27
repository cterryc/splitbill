// components/CTASection.tsx
export default function CTASection() {
  return (
    <section className='bg-primary py-16 dark:bg-primary/90'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center'>
        <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
          ¿Listo para evitar conflictos vecinales?
        </h2>
        <p className='mx-auto mt-4 max-w-2xl text-lg text-white/90'>
          Empieza a usar SplitBill Casa hoy mismo y mantén las cuentas claras.
        </p>
        <div className='mt-8 flex justify-center'>
          <button className='rounded-lg bg-white px-8 py-3.5 text-base font-bold text-primary shadow-lg hover:bg-slate-50 transition-colors'>
            Crear cuenta gratis
          </button>
        </div>
      </div>
    </section>
  )
}
