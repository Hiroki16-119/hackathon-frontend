import ProductList from "../components/ProductList";

export default function Home({ products }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">人気の商品</h2>
      <ProductList products={products} />
    </div>
  );
}


