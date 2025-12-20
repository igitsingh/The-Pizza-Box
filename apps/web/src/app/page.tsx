'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, ChevronDown, Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import CategorySlider from '@/components/CategorySlider';
import PromoBanner from '@/components/PromoBanner';
import LocationModal from '@/components/LocationModal';
import AddressModal from '@/components/AddressModal';
import { useStore } from '@/store/useStore';
import FAQ from '@/components/FAQ';
import JsonLd from '@/components/JsonLd';
import HeroTextSlider from '@/components/HeroTextSlider';
import ReviewsSection from '@/components/ReviewsSection';
import HiddenSEOContent from '@/components/HiddenSEOContent';
import ItemTags from '@/components/ItemTags';
import api from '@/lib/api';

export default function Home() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [loveCarouselSlide, setLoveCarouselSlide] = useState(0);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [loadingBestsellers, setLoadingBestsellers] = useState(true);
  const { location: selectedLocation, setLocation: setSelectedLocation, user, cart, addToCart, removeFromCart } = useStore();

  // Fetch bestsellers
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        const res = await api.get('/menu/bestsellers');
        setBestsellers(res.data.slice(0, 3)); // Show top 3
      } catch (error) {
        console.error('Failed to fetch bestsellers', error);
      } finally {
        setLoadingBestsellers(false);
      }
    };
    fetchBestsellers();
  }, []);

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
  };

  const handleSaveAddress = (address: any) => {
    console.log('Address saved:', address);
    // In a real app, we would save this to the user's profile or order context
    alert(`Address Saved: ${address.houseNo}, ${address.buildingName}, ${address.location}`);
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "The Pizza Box",
    "url": "https://thepizzabox.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thepizzabox.in/menu?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="flex flex-col pb-20 festive-gradient-bg min-h-screen">
      <JsonLd data={websiteSchema} />

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        currentLocation={selectedLocation}
      />

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSaveAddress={handleSaveAddress}
        currentLocation={selectedLocation}
      />

      {/* Location & Delivery Bar - FESTIVE THEME */}
      <div className="festive-red-gradient text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-bold text-xs md:text-sm">
                {selectedLocation || 'No Location'}
              </span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

          </div>
        </div>

        {/* Location Prompt - FESTIVE GREEN */}
        <div className="festive-green-gradient py-2">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
            <div className="flex items-center gap-2 text-center md:text-left">
              <MapPin className="h-4 w-4 shrink-0 text-white" />
              <span className="text-[10px] md:text-xs text-white">🎄 Holiday Special: Give us your exact location for seamless delivery!</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-white text-green-700 hover:bg-yellow-100 hover:text-green-800 font-bold w-full md:w-auto text-[10px] md:text-xs h-7 md:h-8 min-h-0"
              onClick={() => {
                if (selectedLocation) {
                  if (!user) {
                    toast.error('Please login to add address details');
                    window.location.href = '/login';
                    return;
                  }
                  setIsAddressModalOpen(true);
                } else {
                  setIsLocationModalOpen(true);
                }
              }}
            >
              {selectedLocation ? '🎁 Add address details' : '📍 Detect location'}
            </Button>
          </div>
        </div>
      </div>

      {/* App Download Banner - FESTIVE */}
      <div className="bg-white border-b border-green-200">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="festive-green-gradient p-1.5 rounded">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 leading-tight">🎄 Download app for</p>
              <p className="font-bold text-green-700 text-[10px] md:text-xs leading-tight">Festive Offers & Faster Experience!</p>
            </div>
          </div>
          <Button size="sm" disabled className="bg-red-50 text-red-400 border border-red-200 hover:bg-red-50 h-7 text-[10px] px-3">Coming Soon</Button>
        </div>
      </div>

      <div className="w-full">
        {/* Hero / Promo Section */}
        <PromoBanner />

        <HeroTextSlider />

        {/* Christmas/New Year Festive Section */}
        <section className="relative py-12 md:py-16 px-4 overflow-hidden bg-gradient-to-br from-red-700 via-green-700 to-red-800">
          {/* Festive Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-6xl animate-bounce">🎄</div>
            <div className="absolute top-20 right-20 text-5xl animate-bounce delay-100">🎁</div>
            <div className="absolute bottom-10 left-1/4 text-5xl animate-bounce delay-200">⭐</div>
            <div className="absolute bottom-20 right-1/3 text-6xl animate-bounce delay-300">🎉</div>
          </div>

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="mb-6">
              <span className="inline-block text-5xl md:text-7xl mb-4 animate-bounce">🎅</span>
            </div>
            <h2 className="font-bold text-white mb-4 drop-shadow-lg" style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}>
              🎄 Celebrate the Festive Season! 🎉
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Ring in the New Year with our special holiday pizzas!
              <span className="block mt-2 font-semibold text-yellow-300">
                Get 20% OFF on all orders with code: <span className="bg-white text-red-600 px-3 py-1 rounded-lg inline-block mt-2">NEWYEAR2025</span>
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/menu">
                <Button className="bg-white text-red-600 hover:bg-yellow-300 hover:text-red-700 font-bold text-lg px-8 py-6 rounded-full shadow-2xl holiday-glow transform hover:scale-105 transition-all">
                  🍕 Order Now & Save!
                </Button>
              </Link>
              <span className="text-white/80 text-sm">
                *Valid till Jan 5, 2025
              </span>
            </div>
          </div>
        </section>

        {/* Categories Slider */}
        <CategorySlider />

        {/* Top 10 Bestsellers */}
        <section className="px-4 pt-4 pb-16 md:py-8 relative">
          <div className="text-center mb-6 md:mb-8 relative">
            {/* Vibrant Strip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-12 md:h-16 bg-gradient-to-r from-orange-100/0 via-yellow-300/60 to-orange-100/0 -z-10 blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-8 md:h-10 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent -z-10"></div>

            <div className="inline-block relative z-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-4xl filter drop-shadow-md">👑</span>
              </div>
              <h2 className="font-bold text-gray-800 mb-1" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}>Our Bestsellers</h2>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">In Your Locality</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
            {loadingBestsellers ? (
              <div className="col-span-full flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : bestsellers.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-500 text-lg">No bestsellers yet. Place your first order!</p>
                <Link href="/menu">
                  <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                    Browse Menu
                  </Button>
                </Link>
              </div>
            ) : (
              bestsellers.map((item) => {
                const isInCart = cart.some((cartItem) => cartItem.id === item.id);
                const cartItem = cart.find((c) => c.id === item.id);

                const handleAddToCart = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: 1,
                    options: {},
                    addons: []
                  });
                };

                const handleRemoveFromCart = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromCart(item.id);
                };

                const handleDecrement = (e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cartItem && cartItem.quantity > 1) {
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: -1,
                      options: {},
                      addons: []
                    });
                  } else {
                    removeFromCart(item.id);
                  }
                };

                return (
                  <Link key={item.id} href={`/menu/${item.id}`} className="group">
                    <div className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all relative h-full flex flex-col">
                      <div className="h-24 md:h-64 overflow-hidden relative shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl md:text-6xl bg-gray-100">🍕</div>
                        )}
                        {/* Tags Overlay */}
                        <div className="absolute top-1 left-1 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm p-0.5 md:p-1.5 rounded shadow-sm scale-75 origin-top-left md:scale-100">
                          <ItemTags
                            isVeg={item.isVeg}
                            isSpicy={item.isSpicy}
                            isBestSeller={true}
                            isAvailable={item.isAvailable}
                            size="sm"
                          />
                        </div>
                      </div>
                      <div className="p-2 md:p-4 flex flex-col flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-2 mb-1 md:mb-2">
                          <h3 className="font-bold text-[10px] md:text-lg leading-tight line-clamp-2 md:line-clamp-1">{item.name}</h3>
                          <span className="text-orange-600 font-bold text-[10px] md:text-lg">₹{item.price}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2 hidden md:block">
                          {item.description || 'Delicious and freshly made.'}
                        </p>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-auto gap-1 md:gap-0">
                          <span className="text-gray-500 text-[8px] md:text-xs">{item.soldCount} sold</span>
                          {isInCart ? (
                            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-md" onClick={(e) => e.preventDefault()}>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleDecrement}
                                className="h-5 w-5 md:h-8 md:w-8 p-0 text-green-700 hover:bg-green-100 text-[10px] md:text-base"
                              >
                                -
                              </Button>
                              <span className="text-[10px] md:text-sm font-bold text-green-700 min-w-[15px] md:min-w-[20px] text-center">
                                {cartItem?.quantity || 0}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleAddToCart}
                                className="h-5 w-5 md:h-8 md:w-8 p-0 text-green-700 hover:bg-green-100 text-[10px] md:text-base"
                              >
                                +
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              className="festive-red-gradient hover:opacity-90 text-white rounded-full h-5 text-[8px] px-2 w-full md:w-auto md:h-9 md:text-sm md:px-4 font-bold shadow-md"
                              onClick={handleAddToCart}
                            >
                              Add <span className="hidden md:inline ml-1">🎁</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          <div className="text-center mt-6 md:mt-8">
            <Link href="/menu">
              <Button variant="ghost" size="sm" className="font-bold text-xs md:text-sm hover:bg-green-50 hover:text-green-700 text-red-600">
                🎄 View All Festive Bestsellers →
              </Button>
            </Link>
          </div>
        </section>

        {/* Serving Neighbourhoods */}
        <section
          className="py-12 md:py-16 px-4 relative overflow-hidden bg-[url('/ghantaghar-newyear.png')] bg-no-repeat bg-cover bg-[10%_center] md:bg-[length:100%_auto] md:bg-center"
        >
          {/* Gradient overlay for text readability on right side */}
          <div className="absolute inset-y-0 right-0 w-[55%] md:w-[60%] bg-gradient-to-l from-black/90 via-black/50 to-transparent z-0 pointer-events-none"></div>

          <div className="w-full px-2 md:px-12 relative z-10 flex justify-end h-full items-center">
            <div className="w-[45%] md:w-auto md:max-w-lg text-center ml-auto py-2">
              <h2 className="font-bold mb-2 md:mb-6 text-white drop-shadow-lg leading-tight" style={{ fontSize: 'clamp(0.55rem, 2vw, 1.5rem)' }}>📍 Serving Meerut's Favourite Neighbourhoods</h2>
              <div className="flex flex-wrap justify-center gap-0.5 md:gap-2">
                {[
                  "Prabhat Nagar",
                  "Pandav Nagar",
                  "Pragati Nagar",
                  "Shastri Nagar",
                  "Meerut Cantt",
                  "Madhav Puram",
                  "Nagla Battu Road",
                  "Saket",
                  "Shivaji Nagar",
                  "Ganga Nagar",
                  "Brahmpuri",
                  "Lalkurti",
                  "Pallavpuram",
                  "Suraj Kund Road",
                  "Delhi Road",
                  "Garh Road",
                  "Begum Bridge",
                  "Kanker Khera",
                  "Mawana Road",
                  "Hapur Road",
                  "Roorkee Road",
                  "Partapur",
                  "Kankhal",
                  "Abu Lane"
                ].map((area, i) => (
                  <span key={i} className="bg-white/90 backdrop-blur-sm px-1 py-[1px] md:px-3 md:py-1.5 rounded-full text-gray-800 font-medium shadow-lg hover:bg-white transition-all whitespace-nowrap" style={{ fontSize: 'clamp(0.35rem, 1.5vw, 0.75rem)' }}>
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection />

        {/* FAQ Section */}
        <FAQ />

        {/* Trusted Brand - FESTIVE */}
        <section className="py-12 px-4 bg-white text-center border-t-4 border-red-600">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-bold mb-4 md:mb-6 text-red-700" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>🎄 Celebrate with Meerut's Most Trusted Pizza Brand!</h2>
            <p className="text-gray-700 mb-6">
              The Pizza Box brings you festive joy with delicious veg pizzas, exceptional service, cozy ambience, freshly baked crusts, and special holiday pricing. <span className="font-semibold text-green-700">Make this season extra special!</span>
            </p>
            <Link href="/menu">
              <Button className="festive-red-gradient hover:opacity-90 text-white font-bold px-8 py-6 text-lg shadow-lg">
                🍕 Explore Festive Menu
              </Button>
            </Link>
          </div>
        </section>

        {/* Hidden SEO Content */}
        <HiddenSEOContent />

      </div>
    </div >
  );
}
