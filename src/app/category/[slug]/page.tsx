export default function Page({ params }: { params: { slug: string } }) {
  return <div>Category: {params.slug}</div>;
}
