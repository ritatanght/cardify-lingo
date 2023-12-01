export default function Page({ params }: { params: { slug: string } }) {
  return <main>View Set: {params.slug}</main>;
}
