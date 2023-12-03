const Page = ({ params }: { params: { slug: string } }) => {
  return <div>Edit Page: {params.slug}</div>;
};

export default Page;
