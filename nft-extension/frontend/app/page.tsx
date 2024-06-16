import Image from 'next/image'
import rivesLogo from '../public/rives64px.png';


export default function Home() {
  return (
    <main>
      <section id="presentation-section" className="first-section">

        <div className=' max-w-[640px] text-center text-white'>
          <h2 className='mt-6 text-xl'>
            Rives Screenshot NFT App
          </h2>

          <p className="mt-6">
            After sending a tape on rives, come here to check your screenshot nft and mint it!
          </p>
        </div>

        <div className='w-11/12 my-12 h-1 rainbow-background'></div>

        <a className='my-4 btn' href={"/nfts"}>
          NFTs
        </a>

      </section>
      {/* <section id="statistical-section" className="h-svh">
        placeholder for statistical info retrieved from DApp
      </section> */}
    </main>
  )
}
