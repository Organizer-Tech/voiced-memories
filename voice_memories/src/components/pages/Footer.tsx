import { Container } from '@/components/pages/Container'
//footer component export
export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex flex-col items-start justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-16">
          <p className="mt-6 text-sm text-gray-500 md:mt-0">
            &copy; Copyright Voiced Memories {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
