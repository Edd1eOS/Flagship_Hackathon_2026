const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Cloudstep Runner Sneakers",
  image: "/demo/cloudstep-runner.png",
  category: "footwear",
  description: "Everyday sneakers for daily walking and light travel.",
  additionalProperty: {
    "@type": "PropertyValue",
    name: "job",
    value: "daily walking",
  },
  offers: {
    "@type": "Offer",
    price: "149.95",
    priceCurrency: "AUD",
    availability: "https://schema.org/InStock",
  },
};

export default function DemoStorePage() {
  return (
    <main className="min-h-screen bg-[#fffdf7] px-6 py-10 text-[#2f291f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div
          aria-label="Cloudstep Runner Sneakers product image"
          className="flex min-h-[420px] items-center justify-center rounded-lg border-2 border-[#2f291f] bg-[#f6efdd] text-center"
        >
          <span className="font-[family-name:var(--font-display)] text-3xl">
            Cloudstep Runner
            <br />
            Sneakers
          </span>
        </div>
        <section data-product-root className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#4f8a50]">
            Controlled Demo Store
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl">
            Cloudstep Runner Sneakers
          </h1>
          <p className="mt-4 text-lg">
            Everyday sneakers for daily walking and light travel.
          </p>
          <p data-product-category className="mt-3 text-sm">
            Category: footwear
          </p>
          <p
            data-product-price="149.95"
            data-product-currency="AUD"
            className="mt-6 text-3xl font-bold"
          >
            $149.95 AUD
          </p>
          <button
            type="button"
            aria-label="Add Cloudstep Runner Sneakers to cart"
            data-purchase-action
            className="mt-8 min-h-12 rounded-lg bg-[#2f291f] px-6 py-3 text-lg font-bold text-white"
          >
            Add to cart
          </button>
          <p className="mt-4 text-xs text-[#2f291f]/60">
            Demo only. No checkout, payment, account, or delivery form exists.
          </p>
        </section>
      </div>
    </main>
  );
}
