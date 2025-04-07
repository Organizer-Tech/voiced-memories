import { Container } from '@/components/pages/Container'
//footer component export
export function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <Container>
        <div className="flex-box items-start justify-between gap-y-12 pb-6 pt-16 lg:flex-row lg:items-center lg:py-16">
         
        <p className="ml-[17%] text-sm text-white ">            
        Voiced Memories™ respectfully acknowledges that we are located within Treaty 6 territory and Métis Nation of Alberta Region 4. We acknowledge this land as the traditional home for many Indigenous peoples including the Cree, Blackfoot, Métis, Nakota Sioux, Dene, Saulteaux, Anishinaabe, Inuit, and many others whose histories, languages, and cultures continue to enrich our vibrant community.
         </p>
          <p className="mt-[2%] ml-[17%] text-sm text-white">            
            &copy; {new Date().getFullYear()} 2572482 Alberta Inc. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
