import ProductCollections from "./Categories";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <ProductCollections />

      <div className="flex w-full grow">
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
