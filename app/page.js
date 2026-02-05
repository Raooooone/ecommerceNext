import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-50 py-24 sm:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
                <span className="text-indigo-600">redéfinie</span>.
              </h1>
              <p className="mt-6 text-xl leading-8 text-zinc-600">
                Découvrez notre nouvelle collection exclusive. Des produits de qualité, 
                sélectionnés avec soin pour votre quotidien.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/products"
                  className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all active:scale-95"
                >
                  Voir le catalogue
                </Link>
                <Link href="/about" className="text-lg font-semibold leading-6 hover:text-indigo-600 transition-colors">
                  Notre histoire <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl bg-zinc-200 shadow-2xl">
                 <Image
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000"
                  alt="Produit vedette"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section (Séance 1: Architecture) */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Pourquoi nous choisir ?</h2>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { title: "Livraison Rapide", desc: "Expédié sous 24h partout en Tunisie." },
              { title: "Paiement Sécurisé", desc: "Transaction 100% sécurisée par carte ou cash." },
              { title: "Garantie Qualité", desc: "Satisfait ou remboursé sous 14 jours." },
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-zinc-100 p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-zinc-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}