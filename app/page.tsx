import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { ArrowRight, Bike, Car, ShoppingBag, Star } from 'lucide-react';
import dynamicImport from 'next/dynamic';
import { Footer } from '@/components/footer';

export const dynamic = "force-dynamic";

const CartHeader = dynamicImport(() => import('@/components/cart-header').then(mod => ({ default: mod.CartHeader })), {
  ssr: false,
  loading: () => <div className="h-16 bg-slate-900" />,
});

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
  return products;
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <CartHeader />
      <main className="min-h-screen">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal direction="up">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Experience Premium
                <span className="block text-blue-500 mt-2">Performance</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Discover cutting-edge bikes and luxury car toys designed for those who demand excellence
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                    Browse Collection
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-blue-500 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <h2 className="text-4xl font-bold text-white text-center mb-4">
                Why Choose <span className="text-blue-500">VeloRide</span>
              </h2>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Bringing together innovation, quality, and performance
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal direction="left" delay={0.2}>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Premium Quality</h3>
                  <p className="text-gray-400">
                    Every product is carefully selected to meet the highest standards of quality and craftsmanship
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Seamless Shopping</h3>
                  <p className="text-gray-400">
                    Enjoy a smooth checkout experience with multiple payment options and secure transactions
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.4}>
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 group">
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Bike className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Expert Selection</h3>
                  <p className="text-gray-400">
                    Curated collection featuring the best bikes and car toys from leading manufacturers
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal direction="up">
              <h2 className="text-4xl font-bold text-white text-center mb-4">
                Featured <span className="text-blue-500">Products</span>
              </h2>
              <p className="text-gray-400 text-center mb-16">
                Explore our handpicked selection of premium items
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map?.((product, index) => (
                <ScrollReveal key={product?.id} direction="up" delay={index * 0.1}>
                  <Link href={`/products/${product?.id}`}>
                    <div className="group bg-slate-900/50 backdrop-blur-sm rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105">
                      <div className="relative aspect-square bg-slate-800/50 overflow-hidden">
                        <Image
                          src={product?.imageUrl ?? ''}
                          alt={product?.name ?? 'Product'}
                          fill
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                          Featured
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
                          {product?.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {product?.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue-400">
                            ${product?.price?.toFixed?.(2) ?? '0.00'}
                          </span>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              )) ?? null}
            </div>

            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-blue-900/20 via-slate-900 to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <ScrollReveal direction="left">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Two Passions,
                    <span className="block text-blue-500 mt-2">One Destination</span>
                  </h2>
                  <p className="text-gray-300 text-lg mb-8">
                    Whether you're looking for high-performance bikes or luxury car toys, we've curated the finest collection to fuel your passion.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bike className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Premium Bikes</h4>
                        <p className="text-gray-400 text-sm">From racing to touring, find your perfect ride</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">Luxury Car Toys</h4>
                        <p className="text-gray-400 text-sm">Collectible models for enthusiasts and collectors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-8 text-center hover:bg-slate-800/70 transition-all">
                    <div className="text-4xl font-bold text-blue-500 mb-2">15+</div>
                    <div className="text-gray-400">Premium Bikes</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-8 text-center hover:bg-slate-800/70 transition-all">
                    <div className="text-4xl font-bold text-blue-500 mb-2">20+</div>
                    <div className="text-gray-400">Car Toys</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-8 text-center hover:bg-slate-800/70 transition-all">
                    <div className="text-4xl font-bold text-blue-500 mb-2">100%</div>
                    <div className="text-gray-400">Quality Assured</div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-8 text-center hover:bg-slate-800/70 transition-all">
                    <div className="text-4xl font-bold text-blue-500 mb-2">24/7</div>
                    <div className="text-gray-400">Support</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
