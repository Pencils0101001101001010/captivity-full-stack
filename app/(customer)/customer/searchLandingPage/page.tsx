import Link from "next/link";
import Image from "next/image";
import { searchProducts } from "../navSearchActions/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackToCustomerPage from "./../_components/BackToCustomerButton";

export default async function SearchResults({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const query = searchParams.q;
  const results = await searchProducts(query);

  return (
    <ScrollArea className="h-full w-full px-4 py-6 mb-20">
      <div className="container mx-auto max-w-7xl">
        <Card className="h-auto overflow-hidden shadow-2xl shadow-black mb-6">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Search Results for &quot;{query}&quot;
            </CardTitle>
            <CardTitle>
              <BackToCustomerPage />
            </CardTitle>
          </CardHeader>
        </Card>

        {results.length === 0 ? (
          <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95">
            <p className="text-muted-foreground text-center">
              No products found matching your search.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(product => (
              <Link
                href={`/customer/shopping/${product.id}`}
                key={product.id}
                className="block"
              >
                <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95">
                  {product.featuredImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={product.featuredImage.medium}
                        alt={product.productName}
                        fill
                        className="object-cover mb-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className=" text-gray-800 font-semibold mb-2 line-clamp-1 hover:line-clamp-none">
                    <h1 className="font-semibold text-lg line-clamp-2 mb-2 mt-2">
                      {product.productName}
                    </h1>
                    <p className="text-muted-foreground font-medium">
                      R{product.sellingPrice.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
