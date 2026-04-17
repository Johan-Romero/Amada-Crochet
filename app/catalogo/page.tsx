import CatalogClient from "@/components/CatalogClient";
import TopNav from "@/components/TopNav";
import { products } from "@/lib/products";

type CatalogPageProps = {
  searchParams?: Promise<{ cat?: string | string[]; favoritos?: string | string[] }>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = (await searchParams) ?? {};
  const cat = Array.isArray(params.cat) ? params.cat[0] : params.cat;
  const favoritos = Array.isArray(params.favoritos) ? params.favoritos[0] : params.favoritos;
  return (
    <>
      <TopNav solid showCart />
      <CatalogClient products={products} initialFilter={cat} initialFavoritesOnly={favoritos === "1"} />
    </>
  );
}
