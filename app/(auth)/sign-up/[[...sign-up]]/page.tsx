import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <section className='min-w-dvw min-h-dvh flex justify-center items-center'>
      <SignUp />
    </section>
  )
}
