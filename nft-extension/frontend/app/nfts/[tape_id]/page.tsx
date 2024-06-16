import Nft from '@/app/components/Nft';

export default async function Tape({ params }: { params: { tape_id: string } }) {
    return (
        <main className="flex items-center justify-center my-20">
            <Nft tape_id={params.tape_id}/>
        </main>
    )
}
