"use client";

import React, { useState, useEffect, use, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingBag,
  ShoppingCart,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  MessageSquare,
  Share2,
  AlertCircle,
  X,
  User,
  HelpCircle,
  ThumbsUp,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { productsDatabase } from "@/data/products";
import { getProductDetails, getCustomerProductDetails } from "@/lib/api/products";

// Static mock reviews database corresponding to products
interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  helpfulCount: number;
  tags?: string[];
  reply?: {
    author: string;
    content: string;
    date: string;
  };
}

const initialReviews: Record<string, Review[]> = {
  "1": [
    {
      id: "r1",
      name: "Tasmiah Rahman",
      rating: 5,
      date: "June 20, 2026",
      title: "Absolute Holy Grail!",
      content:
        "This snail mucin essence has changed my skincare game! My skin barrier feels so strong, and it gives the most beautiful glass skin glow. Highly recommend!",
      verified: true,
      helpfulCount: 14,
      tags: ["Glass Skin", "Barrier Repair", "Highly Hydrating"],
      reply: {
        author: "Mohima Expert",
        content:
          "Thank you so much Tasmiah! Snail mucin indeed is excellent for the skin barrier. We recommend layering it with a light moisturizer to lock in that beautiful glass skin glow!",
        date: "June 21, 2026",
      },
    },
    {
      id: "r2",
      name: "Nafis Imtiaz",
      rating: 4,
      date: "May 15, 2026",
      title: "Incredibly Hydrating",
      content:
        "A little goes a long way. It has a slightly slimy texture at first, but absorbs instantly without leaving any sticky residue. Very hydrating.",
      verified: true,
      helpfulCount: 5,
      tags: ["Fast Absorbing", "Non-Sticky"],
    },
  ],
  "2": [
    {
      id: "r3",
      name: "Fariha Chowdhury",
      rating: 5,
      date: "April 28, 2026",
      title: "Great for Acne Prone Skin!",
      content:
        "I was scared to use a facial oil, but this green tea oil is so lightweight. It has calmed my redness and acne breakouts. Will purchase again.",
      verified: true,
      helpfulCount: 8,
      tags: ["Acne Safe", "Redness Relief"],
      reply: {
        author: "Mohima Expert",
        content:
          "We're thrilled to hear that, Fariha! Green tea is a fantastic anti-inflammatory. Try using it in your evening routine as the final step.",
        date: "April 30, 2026",
      },
    },
  ],
};

const defaultReviews: Review[] = [
  {
    id: "rd1",
    name: "Mohima Kabir",
    rating: 5,
    date: "June 25, 2026",
    title: "Beautiful Formulation",
    content:
      "Absolutely love the texture and premium feel. It matches my dry skin perfectly and keeps me glowing all day.",
    verified: true,
    helpfulCount: 12,
    tags: ["Premium Quality", "Dry Skin Pick"],
  },
  {
    id: "rd2",
    name: "S. Rahman",
    rating: 4,
    date: "June 10, 2026",
    title: "Worth the Hype",
    content:
      "Highly authentic and direct from Seoul. Very soft on sensitive skin and results are visible in a week.",
    verified: true,
    helpfulCount: 3,
    tags: ["Authentic", "Sensitive Skin Approved"],
  },
];

interface QnA {
  id: string;
  question: string;
  answer?: string;
  askedBy: string;
  date: string;
  likes: number;
}

const initialQnAs: Record<string, QnA[]> = {
  "1": [
    {
      id: "q1",
      question: "Is this product suitable for oily, acne-prone skin?",
      answer:
        "Yes, absolutely! Snail mucin is lightweight and non-comedogenic, making it great for oily skin. It also helps soothe acne redness and repairs the skin barrier.",
      askedBy: "Anika J.",
      date: "June 12, 2026",
      likes: 8,
    },
    {
      id: "q2",
      question: "Can I use this product with Vitamin C or Niacinamide?",
      answer:
        "Yes, snail mucin plays very well with other active ingredients. You can apply Vitamin C first, let it absorb, and then layer this essence for maximum hydration.",
      askedBy: "Farhan T.",
      date: "May 29, 2026",
      likes: 12,
    },
  ],
  "2": [
    {
      id: "q3",
      question: "Will this green tea oil cause purging?",
      answer:
        "No, green tea oil is rich in antioxidants and is non-comedogenic. It is designed to soothe active acne and reduce inflammation rather than speed up cell turnover like retinoids.",
      askedBy: "Sajid A.",
      date: "June 05, 2026",
      likes: 5,
    },
  ],
};

const defaultQnAs: QnA[] = [
  {
    id: "qd1",
    question: "Is this product 100% authentic?",
    answer:
      "Yes, all products on Mohima are sourced directly from authorized brands and laboratories in South Korea and Japan. We guarantee 100% authenticity.",
    askedBy: "Nusrat S.",
    date: "June 24, 2026",
    likes: 15,
  },
  {
    id: "qd2",
    question: "When should I use this in my routine?",
    answer:
      "Generally, apply after cleansing and toning, and before heavier creams/moisturizers. For oils, use them as the final step or mix a drop into your moisturizer.",
    askedBy: "Rashed K.",
    date: "June 18, 2026",
    likes: 9,
  },
];

const productMetadataMap: Record<
  string,
  {
    brand: string;
    madeIn: string;
    skinType: string;
    shade?: string;
    size: string;
    description: string;
    benefits: string[];
    howToUse: string;
    ingredients: string;
  }
> = {
  "1": {
    brand: "MUZE",
    madeIn: "South Korea",
    skinType: "Dry, Sensitive, Dehydrated",
    size: "100ml",
    description:
      "The MUZE Snail Mucin 96 Power Essence is a lightweight essence that absorbs into the skin fast, giving you a natural glow from within. Formulated with 96.3% Snail Secretion Filtrate, this essence protects the skin from moisture loss while improving skin elasticity. Snail mucin helps repair and soothes red, sensitive skin after breakouts by replenishing moisture.",
    benefits: [
      "Provides intense hydration and protects against moisture loss.",
      "Soothes skin redness and helps fade acne scars.",
      "Improves overall skin texture and elasticity for a youthful glow.",
    ],
    howToUse:
      "Apply a thin layer to face in small, circular motions, starting in center and working out. Gently pat using fingertips to promote absorption. Follow with your favorite moisturizer or sunscreen.",
    ingredients:
      "Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Polyacrylate, Sodium Hyaluronate, Panthenol, Allantoin, Adenosine, Ethyl Hexanediol.",
  },
  "2": {
    brand: "Botanical",
    madeIn: "South Korea",
    skinType: "Acne Prone, Combination",
    size: "50ml",
    description:
      "Botanical Green Tea Calming Facial Oil is a lightweight calming oil formulated with 100% natural cold-pressed green tea seed oil and calming botanicals. It regulates excess sebum production while keeping the skin barrier hydrated and calm. Perfect for reducing redness and acne-prone skin irritation.",
    benefits: [
      "Regulates sebum production and soothes red patches.",
      "Paraben free and non-comedogenic.",
      "Dermatologically tested for active skin breakout cycles.",
    ],
    howToUse:
      "Apply 2-3 drops gently to face in small, circular motions, starting in center and working out. Gently press to promote absorption. Follow with your routine.",
    ingredients:
      "Green Tea Seed Oil, Caprylic/Capric Triglyceride, Squalane, Centella Asiatica Extract, Tea Tree Leaf Oil, Tocopherol, Bisabolol.",
  },
  "3": {
    brand: "AURA",
    madeIn: "South Korea",
    skinType: "Dry, Dehydrated",
    size: "80ml",
    description:
      "AURA Hydro-Boost Ultra Moisturizing Creme delivers deep, long-lasting hydration for dry skin. Infused with concentrated hyaluronic acid, it replenishes moisture instantly and keeps the skin hydrated for up to 48 hours. The gel-cream formula absorbs smoothly without feeling greasy.",
    benefits: [
      "Provides long-lasting 48-hour moisture barrier.",
      "Non-greasy, fast-absorbing gel cream texture.",
      "Clinically proven hydration boosting.",
    ],
    howToUse:
      "Apply evenly to face and neck in circular motions, starting from center. Gently pat to promote complete absorption.",
    ingredients:
      "Aqua, Glycerin, Dimethicone, Sodium Hyaluronate, Butylene Glycol, Trehalose, Urea, Pentylene Glycol, Carbomer, Phenoxyethanol.",
  },
  "4": {
    brand: "AETERNA",
    madeIn: "Japan",
    skinType: "Aging, Mature Skin",
    size: "30ml",
    description:
      "AETERNA Aurum Vitality Anti-Aging Ampoule is an ultra-concentrated corrective serum designed to target wrinkles, fine lines, and loss of skin elasticity. Infused with pure 24K gold flakes and high-potency peptides, it stimulates collagen production and leaves skin firm, radiant, and rejuvenated.",
    benefits: [
      "Targets fine lines, deep wrinkles, and loss of firmness.",
      "Enriched with premium 24K Gold particles.",
      "Dermatologically tested for safety and efficacy.",
    ],
    howToUse:
      "Apply 3-4 drops to cleansed face before moisturizer. Massage in circular motions until gold particles are fully absorbed.",
    ingredients:
      "Aqua, Butylene Glycol, Glycerin, Gold (24K), Palmitoyl Tripeptide-5, Collagen, Niacinamide, Adenosine, Phenoxyethanol.",
  },
  "5": {
    brand: "Lumina",
    madeIn: "South Korea",
    skinType: "Dull, Hyperpigmented",
    size: "50ml",
    description:
      "Lumina Skin Radiant C Hyaluronic Serum is a bright, stabilizing serum containing pure Vitamin C and multi-depth hyaluronic acids. It target dull skin, brown spots, and uneven texture while providing deep hydration for a visibly radiant, plump skin tone.",
    benefits: [
      "Brightens skin tone and fades hyperpigmentation.",
      "Provides multi-depth hydration.",
      "Stabilized Vitamin C formula that is gentle on sensitive skin.",
    ],
    howToUse:
      "Apply a few drops after cleansing. Gently pat and let it absorb for 1 minute before layering moisturizers. Use sunscreen during the day.",
    ingredients:
      "Aqua, Ascorbic Acid, Glycerin, Sodium Hyaluronate, Ferulic Acid, Tocopherol, Panthenol, Centella Asiatica Extract.",
  },
  "6": {
    brand: "Pure Aura",
    madeIn: "South Korea",
    skinType: "Acne Prone, Sensitive",
    size: "150ml",
    description:
      "Pure Aura Gentle Hydrating Cleansing Wash is a low-pH, foaming gel cleanser that removes impurities, sunscreen, and makeup residues without stripping the skin's moisture. Packed with tea tree extracts and salicylic acid, it prevents future breakouts while keeping skin smooth and calm.",
    benefits: [
      "Removes impurities and sunscreen without dry stiffness.",
      "Low pH formula matching natural skin acidity.",
      "Dermatologically tested for daily morning and night cleaning.",
    ],
    howToUse:
      "Lather a small amount between wet hands. Massage gently onto damp skin, then rinse thoroughly with lukewarm water.",
    ingredients:
      "Water, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Tea Tree Leaf Extract, Salicylic Acid, Citric Acid, Allantoin.",
  },
  "7": {
    brand: "Sun Screen",
    madeIn: "Japan",
    skinType: "All skin types",
    size: "50g",
    description:
      "Sun Screen Lotion SPF 50+ Sun Fluid offers broad-spectrum UVA/UVB protection in a lightweight, watery fluid that leaves a completely invisible finish. Free of white cast and greasy residues, it wears perfectly under makeup and is enriched with hydrating hyaluronic acid.",
    benefits: [
      "Broad-spectrum SPF 50+ PA++++ chemical UV filters.",
      "Invisible, watery texture with zero white cast.",
      "Contains hyaluronic acid to keep skin hydrated in heat.",
    ],
    howToUse:
      "Apply generously as the final step of your morning skincare routine, at least 15 minutes before sun exposure.",
    ingredients:
      "Water, Ethylhexyl Methoxycinnamate, Butylene Glycol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Sodium Hyaluronate, Silica.",
  },
  "8": {
    brand: "LUNA",
    madeIn: "Japan",
    skinType: "Dry, Extremely Dry",
    size: "60ml",
    description:
      "LUNA Hydrating Crei Creme Rich Moisturizer is an intensive nourishing barrier cream for dry and compromised skin. Rich in ceramides, shea butter, and lipids, it forms an invisible protective lock to prevent trenespidermal water loss and keep skin plump for 72 hours.",
    benefits: [
      "Intensely nourishes and repairs dry skin barriers.",
      "Keeps skin hydrated for up to 72 hours.",
      "Packed with active skin ceramides and lipids.",
    ],
    howToUse:
      "Apply a generous layer to face and neck as the final step of your evening skincare routine. Pat gently for full absorption.",
    ingredients:
      "Ceramide NP, Shea Butter, Caprylic/Capric Trygliceride, Glycerin, Aqua, Phytosphingosine, Olive Fruit Oil, Carbomer.",
  },
};

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    cart,
    wishlist,
    cartOpen,
    addToCart,
    removeFromCart,
    updateCartQty,
    toggleWishlist,
    setCartOpen,
  } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      setIsLoading(true);
      setErrorMessage(null);
      setIsNotFound(false);
      const res = await getCustomerProductDetails(id);
      if (isMounted) {
        if (res && res.success && res.resources) {
          setProduct(res.resources);
        } else if (res && (res as any).id) {
          setProduct(res);
        } else {
          // Check if fallback product exists in mock database
          const mockProduct = productsDatabase.find((p) => p.id === id || p.slug_url === id);
          if (mockProduct) {
            setProduct(mockProduct);
          } else {
            setProduct(null);
            if (res && res.message) {
              setErrorMessage(res.message);
              if (res.message.toLowerCase().includes('not found') || res.message.includes('404')) {
                setIsNotFound(true);
              }
            } else {
              setIsNotFound(true);
              setErrorMessage('Product not found.');
            }
          }
        }
        setIsLoading(false);
      }
    }
    loadProduct();
    return () => { isMounted = false; };
  }, [id]);

  // Page title dynamic setup
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Mohima Premium Beauty`;
    } else if (isNotFound) {
      document.title = "Product Not Found | Mohima Premium Beauty";
    }
  }, [product, isNotFound]);

  // UI States
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "qna">(
    "details",
  );

  // Dynamic variants state
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product?.attributes?.length > 0) {
      const initialAttrs: Record<string, string> = {};
      product.attributes.forEach((attr: any) => {
        if (attr.values && attr.values.length > 0) {
          initialAttrs[attr.name] = attr.values[0];
        }
      });
      setSelectedAttributes(initialAttrs);
    }
  }, [product]);

  const activeVariant = React.useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;
    return product.variants.find((variant: any) => {
      return Object.entries(selectedAttributes).every(([key, value]) => {
        return variant.attributes && variant.attributes[key] === value;
      });
    });
  }, [product, selectedAttributes]);

  // Q&A States
  const [qnas, setQnas] = useState<QnA[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionName, setNewQuestionName] = useState("");
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  const defaultMetadata = product ? (productMetadataMap[product.id] || {
    brand: typeof product.brand === "object" ? product.brand?.name : (product.brand || "Mohima Curated"),
    madeIn: product.made_in || "South Korea",
    skinType: product.skin_type || "All skin types",
    size: product.unit?.name || product.size || "100ml",
    description: product.description || `The premium formulation of ${product.name} is designed to restore skin barrier health and maintain glass skin radiance. Sourced directly from authentic laboratories.`,
    benefits: product.benefits || [
      "100% Authentic premium skincare formulation.",
      "Hypoallergenic and dermatologically tested.",
      "Free from sulfates, parabens, and artificial fragrances.",
    ],
    howToUse:
      product.how_to_use || "Dispense a moderate amount and apply evenly onto the face. Gently tap to optimize absorption as part of your daily skincare routine.",
    ingredients:
      product.ingredients || "Aqua, Butylene Glycol, Glycerin, Niacinamide, Sodium Hyaluronate, Centella Asiatica Extract, Allantoin, Panthenol, Carbomer, Phenoxyethanol, Ethylhexylglycerin.",
  }) : null;

  const metadata = product ? {
    ...defaultMetadata!,
    brand: typeof product.brand === "object" ? (product.brand?.name || "Mohima Curated") : (product.brand || defaultMetadata!.brand),
    description: product.description || defaultMetadata!.description,
    ingredients: product.ingredients || defaultMetadata!.ingredients,
  } : null;

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    title: "",
    content: "",
  });

  // Interactive reviews filtering, sorting and interactions
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">(
    "recent",
  );
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Load reviews and Q&As on mount/product change
  useEffect(() => {
    if (product) {
      const prodReviews = initialReviews[product.id] || defaultReviews;
      const prodQnAs = initialQnAs[product.id] || defaultQnAs;

      setReviews(prodReviews);
      setQnas(prodQnAs);
    }
  }, [product?.id]);

  const handleLikeQuestion = (qId: string) => {
    setQnas((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, likes: q.likes + 1 } : q)),
    );
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newQuestionName.trim()) return;

    setIsSubmittingQuestion(true);

    const userQuestion: QnA = {
      id: `q-new-${Date.now()}`,
      question: newQuestion.trim(),
      askedBy: newQuestionName.trim(),
      date: "Just now",
      likes: 0,
    };

    setTimeout(() => {
      setQnas((prev) => [...prev, userQuestion]);
      setIsSubmittingQuestion(false);
      setNewQuestion("");

      setTimeout(() => {
        setQnas((prev) =>
          prev.map((q) => {
            if (q.id === userQuestion.id) {
              return {
                ...q,
                answer:
                  "Thank you for your question! For best results with this formulation, we recommend doing a patch test on a small area (like your inner arm or jawline) first. If no irritation occurs within 24 hours, you can proceed with confidence. Typically, this product can be integrated into your morning and evening skincare routine after toner, followed by a moisturizer.",
              };
            }
            return q;
          }),
        );
      }, 2000);
    }, 800);
  };

  // Generate thumbnail gallery images
  const galleryImages = React.useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imgs.push(...product.images);
    }
    if (product.thumbnail && !imgs.includes(product.thumbnail)) {
      imgs.unshift(product.thumbnail);
    }
    if (product.image && !imgs.includes(product.image)) {
      imgs.push(product.image);
    }
    if (imgs.length === 0) {
      imgs.push("/images/product_snail.png");
    }
    return imgs;
  }, [product]);

  const handleQuantityChange = (type: "inc" | "dec") => {
    if (type === "inc") {
      setQuantity((q) => q + 1);
    } else {
      setQuantity((q) => (q > 1 ? q - 1 : 1));
    }
  };

  const handleAddCartWithFeedback = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart(product, quantity, false);
      setIsAdding(false);
    }, 600);
  };

  const handleBuyNow = () => {
    setIsBuying(true);
    setTimeout(() => {
      addToCart(product, quantity);
      setIsBuying(false);
      setCartOpen(true);
    }, 600);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.title || !newReview.content) {
      alert("Please fill in all review fields.");
      return;
    }
    const createdReview: Review = {
      id: `r-new-${Date.now()}`,
      name: newReview.name,
      rating: newReview.rating,
      date: "Just now",
      title: newReview.title,
      content: newReview.content,
      verified: true,
      helpfulCount: 0,
      tags: ["Customer Choice"],
    };
    setReviews([createdReview, ...reviews]);
    setShowReviewModal(false);
    setNewReview({ name: "", rating: 5, title: "", content: "" });
  };

  const handleVoteHelpful = (reviewId: string) => {
    if (helpfulVotes[reviewId]) return;
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 }
          : r,
      ),
    );
  };

  const getAvatarBg = (name: string) => {
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colors = [
      "bg-amber-50 text-amber-700 border-amber-200/50",
      "bg-emerald-50 text-emerald-700 border-emerald-200/50",
      "bg-blue-50 text-blue-700 border-blue-200/50",
      "bg-rose-50 text-rose-700 border-rose-200/50",
      "bg-violet-50 text-violet-700 border-violet-200/50",
    ];
    return colors[hash % colors.length];
  };

  const parseReviewDate = (dateStr: string) => {
    if (dateStr === "Just now") return 99999999999999;
    const parsed = Date.parse(dateStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  const isWishlisted = product ? wishlist.includes(product.id) : false;
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Recommendations (Other products)
  const recommendedProducts = React.useMemo(() => {
    if (!product) return [];
    return productsDatabase
      .filter((p) => String(p.id) !== String(product.id))
      .map((p) => ({
        ...p,
        slug_url: p.slug_url || (p as any).slug || `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${p.id}`,
      }))
      .slice(0, 4);
  }, [product]);

  // Calculate discount percentage
  const discountPercent = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  // Star metrics breakdown
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : product?.rating?.toFixed(1) || "4.8";

  const displayPrice = activeVariant ? Number(activeVariant.discount_price || activeVariant.price) : Number(product?.price || 0);
  const displayOriginalPrice = activeVariant ? Number(activeVariant.price) : Number(product?.originalPrice || 0);
  const isDiscounted = activeVariant ? (activeVariant.discount_price && Number(activeVariant.discount_price) < Number(activeVariant.price)) : (product?.originalPrice && product.originalPrice > product.price);
  
  const currentDiscountPercent = isDiscounted
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] font-sans">
        <Suspense fallback={<div className="h-20 bg-white"></div>}>
          <Header />
        </Suspense>
        <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-[#CC826A]/30 border-t-[#CC826A] rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || !metadata || isNotFound) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] font-sans">
        <Suspense fallback={<div className="h-20 bg-white"></div>}>
          <Header />
        </Suspense>
        <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#CC826A]/10 text-[#CC826A] rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={40} />
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#121212] mb-3">
            Product Not Found
          </h1>
          <p className="text-[#565656] max-w-md mb-8 text-sm sm:text-base leading-relaxed">
            {errorMessage || "The product you are looking for does not exist or has been removed."}
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#121212] text-white text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-black transition-all shadow-sm"
            >
              Back to Home
            </Link>
            <Link
              href="/products"
              className="px-6 py-3 bg-white border border-[#121212]/15 text-[#121212] text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-gray-50 transition-all shadow-xs"
            >
              Browse All Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#121212] font-sans">
      <Suspense fallback={<div className="h-20 bg-white"></div>}>
        <Header />
      </Suspense>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-6 select-none">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#565656] mb-6 flex-wrap font-medium">
          <Link href="/" className="hover:text-[#CC826A] transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-[#565656]/50 shrink-0" />
          <Link href="/products" className="hover:text-[#CC826A] transition-colors">
            Products
          </Link>
          {product?.category?.breadcrumbs && Array.isArray(product.category.breadcrumbs) && product.category.breadcrumbs.length > 0 ? (
            product.category.breadcrumbs.map((crumb: any) => (
              <React.Fragment key={crumb.id || crumb.slug}>
                <ChevronRight size={12} className="text-[#565656]/50 shrink-0" />
                <Link
                  href={`/products?category_id=${crumb.id}`}
                  className="hover:text-[#CC826A] transition-colors"
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))
          ) : product?.category ? (
            <>
              <ChevronRight size={12} className="text-[#565656]/50 shrink-0" />
              <Link
                href={`/products?category_id=${product.category.id}`}
                className="hover:text-[#CC826A] transition-colors"
              >
                {typeof product.category === 'object' ? product.category.name : product.category}
              </Link>
            </>
          ) : null}
          <ChevronRight size={12} className="text-[#565656]/50 shrink-0" />
          <span className="text-[#121212] font-semibold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Product Shell Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Media Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden border border-black/[0.03] group shadow-xs">
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isBestSeller && (
                  <span className="bg-[#121212] text-[#FAF9F6] text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-xs">
                    Best Seller
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-[#CC826A] text-[#FAF9F6] text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-xs">
                    New
                  </span>
                )}
                {currentDiscountPercent > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm shadow-xs">
                    {currentDiscountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Main Image */}
              <Image
                src={galleryImages[activeImageIdx]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-all duration-500 group-hover:scale-103"
                sizes="(max-w-7xl) 55vw, 100vw"
              />

              {/* Wishlist Button Overlaid Top-Right */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 p-2.5 rounded-full border border-black/[0.04] bg-white/80 hover:bg-white backdrop-blur-xs shadow-xs transition-colors duration-300 cursor-pointer ${
                  isWishlisted
                    ? "text-red-500"
                    : "text-[#121212] hover:text-red-500"
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart
                  size={16}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImages.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-square w-full bg-white rounded-xl overflow-hidden border transition-all duration-300 ${
                    activeImageIdx === idx
                      ? "border-[#CC826A] scale-[0.98] ring-2 ring-[#CC826A]/20"
                      : "border-black/[0.04] hover:border-black/20"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info & Checkout panel */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="flex flex-col gap-1.5">
              {/* Product Name */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-wide text-[#121212] uppercase leading-tight">
                {product.name}
              </h1>
              {/* Ratings */}
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center text-[#CC826A] gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={
                        i < Math.floor(parseFloat(avgRating))
                          ? "#CC826A"
                          : "transparent"
                      }
                      stroke="#CC826A"
                      className="transition-colors duration-200"
                    />
                  ))}
                  <span className="text-xs font-bold text-[#121212] ml-1.5">
                    {avgRating}
                  </span>
                </div>
                <span className="text-[#565656]/40">|</span>
                <a
                  href="#reviews-section"
                  className="text-xs text-[#565656] hover:text-[#CC826A] transition-colors underline font-medium"
                >
                  {reviews.length} Verified Reviews
                </a>
              </div>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-4 py-4 border-y border-[#E5E5E5]">
              <span className="text-2xl font-bold text-[#121212] tracking-wider">
                ৳{displayPrice.toLocaleString()}
              </span>
              {isDiscounted && (
                <>
                  <span className="text-sm text-[#565656]/60 line-through">
                    ৳{displayOriginalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-red-500 bg-red-50 px-2 py-0.5 rounded-sm uppercase">
                    Save ৳
                    {(displayOriginalPrice - displayPrice).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-xs sm:text-sm text-[#565656] font-light leading-relaxed whitespace-pre-line">
                {product.short_description}
              </p>
            )}

            {/* Brand & Category Info Grid */}
            <div className="grid grid-cols-[90px_1fr] gap-y-1 text-sm text-[#121212] font-sans my-2">
              <span className="text-[#565656] font-normal">Brand :</span>
              <span className="font-normal text-[#121212]">
                {metadata.brand}
              </span>
              <span className="text-[#565656] font-normal">Category:</span>
              <span className="font-normal text-[#121212]">
                {typeof product.category === "object" ? (product.category?.name || "Skincare") : (product.category || "Skincare")}
              </span>
            </div>

            {/* Variant Selectors */}
            {product?.attributes?.length > 0 && (
              <div className="flex flex-col gap-4">
                {product.attributes.map((attribute: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <span className="text-[10px] tracking-widest font-bold text-[#565656] uppercase">
                      Select {attribute.name}:
                    </span>
                    <div className="flex gap-3 flex-wrap">
                      {attribute.values.map((val: string) => {
                        const isSelected = selectedAttributes[attribute.name] === val;
                        return (
                          <button
                            key={val}
                            onClick={() => setSelectedAttributes((prev) => ({ ...prev, [attribute.name]: val }))}
                            className={`text-xs font-semibold px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#121212] text-white border-transparent shadow-xs"
                                : "bg-white text-[#121212] border-[#E5E5E5] hover:border-black"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Actions: Stepper and Add To Bag */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-[#E5E5E5] rounded-full bg-white px-4 h-12 sm:w-32 flex-shrink-0">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="text-[#565656] hover:text-[#CC826A] transition-colors p-1"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  id="qty-dec-btn"
                >
                  -
                </button>
                <span className="text-sm font-bold text-[#121212] w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="text-[#565656] hover:text-[#CC826A] transition-colors p-1"
                  aria-label="Increase quantity"
                  id="qty-inc-btn"
                >
                  +
                </button>
              </div>

              {/* Add To Cart CTA */}
              <button
                onClick={handleAddCartWithFeedback}
                disabled={isAdding || isBuying}
                id="add-to-bag-btn"
                className="flex-1 h-12 bg-transparent border border-[#D49783] text-[#D49783] text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 sm:px-6 rounded-full hover:bg-[#D49783]/10 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdding ? (
                  <span className="w-3.5 h-3.5 border-2 border-[#D49783] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart size={13} />
                )}
                <span>{isAdding ? "Adding..." : "Add to cart"}</span>
              </button>

              {/* Buy Now CTA */}
              <button
                onClick={handleBuyNow}
                disabled={isAdding || isBuying}
                id="buy-now-btn"
                className="flex-1 h-12 bg-[#CC826A] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 sm:px-6 rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuying ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check size={13} />
                )}
                <span>{isBuying ? "Processing..." : "Buy Now"}</span>
              </button>
            </div>

            {/* Cruelty-free/Vegan Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-[#E5E5E5] pt-6 mt-2 text-center text-[#565656]">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  100% Authentic
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-[#CC826A]/10 text-[#CC826A] flex items-center justify-center">
                  <Truck size={16} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  Fast Shipping
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RotateCcw size={16} />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  Easy Returns
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Tabs Section (Under product grid) */}
        <div className="mt-16 border-t border-[#E5E5E5] pt-10 text-left">
          {/* Tab Headers */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "details"
                  ? "bg-[#CC826A]/10 text-[#CC826A] border border-[#CC826A]/20"
                  : "bg-[#121212]/5 text-[#565656] hover:bg-[#121212]/10 border border-transparent"
              }`}
              id="tab-details"
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "reviews"
                  ? "bg-[#CC826A]/10 text-[#CC826A] border border-[#CC826A]/20"
                  : "bg-[#121212]/5 text-[#565656] hover:bg-[#121212]/10 border border-transparent"
              }`}
              id="tab-reviews"
            >
              Review ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("qna")}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "qna"
                  ? "bg-[#CC826A]/10 text-[#CC826A] border border-[#CC826A]/20"
                  : "bg-[#121212]/5 text-[#565656] hover:bg-[#121212]/10 border border-transparent"
              }`}
              id="tab-qna"
            >
              Q&A ({qnas.length})
            </button>
          </div>

          {/* Tab Body contents */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-black/[0.03] shadow-xs">
            {activeTab === "details" && (
              <div className="space-y-6">
                {/* Meta details list */}
                <div className="space-y-1.5 text-xs sm:text-sm text-[#121212] font-sans">
                  <div>
                    <strong>Brand:</strong> {metadata.brand}
                  </div>
                  <div>
                    <strong>Made In:</strong> {metadata.madeIn}
                  </div>
                  <div>
                    <strong>Skin Type:</strong> {metadata.skinType}
                  </div>
                  {metadata.shade && (
                    <div>
                      <strong>Shade:</strong> {metadata.shade}
                    </div>
                  )}
                  <div>
                    <strong>Size:</strong> {metadata.size}
                  </div>
                </div>

                {/* Description Text */}
                <div
                  className="text-xs sm:text-sm text-[#565656] font-light leading-relaxed space-y-2 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_strong]:font-semibold [&_strong]:text-[#121212]"
                  dangerouslySetInnerHTML={{ __html: metadata.description }}
                />

                {/* Bullet List */}
                <ol className="list-decimal pl-5 text-xs sm:text-sm text-[#565656] font-light space-y-1">
                  {metadata.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ol>

                {/* How to use */}
                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#121212] uppercase tracking-wider">
                    How to use:
                  </h4>
                  <p className="text-xs sm:text-sm text-[#565656] font-light leading-relaxed">
                    {metadata.howToUse}
                  </p>
                </div>

                {/* Ingredients */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#121212] uppercase tracking-wider">
                    Ingredients:
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[#565656] font-light leading-relaxed break-words font-mono">
                    {metadata.ingredients}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-6">
                  {/* Rating breakdown summary */}
                  <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.03] shadow-xs flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 hover:shadow-md">
                    {/* Glowing peach accent */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E0A996] via-[#CC826A] to-[#D48F78]" />

                    <span className="text-6xl font-serif text-[#121212] font-semibold tracking-tight">
                      {avgRating}
                    </span>

                    <div className="flex items-center text-[#CC826A] my-3 gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={
                            i < Math.floor(parseFloat(avgRating))
                              ? "#CC826A"
                              : "transparent"
                          }
                          stroke="#CC826A"
                          className="transition-transform duration-300 hover:scale-110"
                        />
                      ))}
                    </div>

                    <span className="text-xs text-[#565656] tracking-widest font-semibold uppercase mb-6">
                      Based on {reviews.length} ratings
                    </span>

                    {/* Progress bars */}
                    <div className="w-full space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(
                          (r) => r.rating === stars,
                        ).length;
                        const percent = reviews.length
                          ? (count / reviews.length) * 100
                          : 0;
                        const isActive = ratingFilter === stars;
                        return (
                          <button
                            key={stars}
                            onClick={() =>
                              setRatingFilter(isActive ? null : stars)
                            }
                            className={`w-full flex items-center gap-3 text-xs text-[#565656] hover:bg-black/[0.02] p-1.5 rounded-lg -mx-1.5 transition-all duration-200 cursor-pointer ${
                              isActive
                                ? "bg-[#CC826A]/5 text-[#CC826A] font-semibold"
                                : "opacity-85 hover:opacity-100"
                            }`}
                            title={`Filter reviews by ${stars} stars`}
                          >
                            <span className="w-8 text-left flex items-center gap-0.5">
                              {stars}
                              <Star
                                size={10}
                                fill="#CC826A"
                                stroke="#CC826A"
                                className="inline mb-0.5"
                              />
                            </span>
                            <div className="flex-1 bg-neutral-100 h-2 rounded-full overflow-hidden border border-black/[0.01]">
                              <div
                                className="bg-[#CC826A] h-full rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="w-6 text-right text-[#121212] font-semibold">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {ratingFilter !== null && (
                      <button
                        onClick={() => setRatingFilter(null)}
                        className="text-[11px] text-[#CC826A] hover:text-[#121212] underline mt-4 font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer"
                      >
                        Clear Star Filter
                      </button>
                    )}
                  </div>

                  {/* Individual Reviews List */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Filter and Sort Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-black/[0.03] text-left">
                      <div className="flex items-center flex-wrap gap-2.5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#121212]">
                          Verified Reviews (
                          {
                            reviews.filter(
                              (r) =>
                                ratingFilter === null ||
                                r.rating === ratingFilter,
                            ).length
                          }
                          )
                        </h3>
                        {ratingFilter !== null && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] bg-[#CC826A]/10 text-[#CC826A] border border-[#CC826A]/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                            {ratingFilter} Stars
                            <button
                              onClick={() => setRatingFilter(null)}
                              className="hover:text-black font-extrabold cursor-pointer transition-colors"
                              title="Clear Star Filter"
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#565656]/80 font-medium">
                          Sort By:
                        </span>
                        <select
                          value={sortBy}
                          onChange={(e) =>
                            setSortBy(
                              e.target.value as "recent" | "highest" | "lowest",
                            )
                          }
                          className="bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#CC826A] font-semibold cursor-pointer shadow-xs transition-colors"
                        >
                          <option value="recent">Most Recent</option>
                          <option value="highest">Highest Rating</option>
                          <option value="lowest">Lowest Rating</option>
                        </select>
                      </div>
                    </div>

                    {/* Reviews List */}
                    {reviews.filter(
                      (r) => ratingFilter === null || r.rating === ratingFilter,
                    ).length === 0 ? (
                      <div className="py-16 bg-white rounded-3xl border border-black/[0.03] text-center text-neutral-400 font-light text-sm flex flex-col items-center gap-2">
                        <MessageSquare size={24} className="opacity-30" />
                        <span>No reviews match the selected filter.</span>
                        {ratingFilter !== null && (
                          <button
                            onClick={() => setRatingFilter(null)}
                            className="text-[#CC826A] font-bold text-xs hover:underline mt-2 cursor-pointer"
                          >
                            Show all reviews
                          </button>
                        )}
                      </div>
                    ) : (
                      [...reviews]
                        .filter(
                          (r) =>
                            ratingFilter === null || r.rating === ratingFilter,
                        )
                        .sort((a, b) => {
                          if (sortBy === "highest") {
                            return (
                              b.rating - a.rating ||
                              parseReviewDate(b.date) - parseReviewDate(a.date)
                            );
                          }
                          if (sortBy === "lowest") {
                            return (
                              a.rating - b.rating ||
                              parseReviewDate(b.date) - parseReviewDate(a.date)
                            );
                          }
                          return (
                            parseReviewDate(b.date) - parseReviewDate(a.date)
                          );
                        })
                        .map((review) => (
                          <div
                            key={review.id}
                            className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.03] flex flex-col gap-4 shadow-xs transition-all duration-300 hover:translate-y-[-2px] hover:shadow-sm"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-4">
                              {/* Left Profile Info */}
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-full border flex items-center justify-center text-xs font-bold ${getAvatarBg(review.name)} shadow-2xs`}
                                >
                                  {review.name.charAt(0)}
                                </div>
                                <div className="space-y-0.5">
                                  <div className="text-xs font-bold text-[#121212] uppercase flex items-center flex-wrap gap-2">
                                    <span>{review.name}</span>
                                    {review.verified && (
                                      <span className="inline-flex items-center gap-0.5 text-[8px] bg-emerald-50 text-emerald-700 border border-emerald-200/50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                        <Check size={8} strokeWidth={3} />
                                        Verified Buy
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-[#565656]/50 font-medium">
                                    {review.date}
                                  </div>
                                </div>
                              </div>

                              {/* Stars */}
                              <div className="flex items-center text-[#CC826A] gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    fill={
                                      i < review.rating
                                        ? "#CC826A"
                                        : "transparent"
                                    }
                                    stroke="#CC826A"
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Review Content */}
                            <div className="space-y-2">
                              <h4 className="text-sm font-bold text-[#121212] uppercase tracking-wide">
                                {review.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-[#565656] leading-relaxed font-light">
                                {review.content}
                              </p>
                            </div>

                            {/* Tags capsules */}
                            {review.tags && review.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {review.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[9px] bg-neutral-50 text-neutral-600 border border-neutral-200/30 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Expert Reply */}
                            {review.reply && (
                              <div className="mt-2 pl-4 border-l-2 border-[#CC826A] bg-[#FAF9F6]/60 p-4 rounded-r-2xl space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] bg-[#CC826A] text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                                    {review.reply.author}
                                  </span>
                                  <span className="text-[10px] text-[#565656]/50 font-medium">
                                    {review.reply.date}
                                  </span>
                                </div>
                                <p className="text-xs text-[#565656] leading-relaxed font-light italic">
                                  &ldquo;{review.reply.content}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Actions bar (Helpful) */}
                            <div className="flex items-center justify-between border-t border-black/[0.03] pt-4 mt-1">
                              <button
                                onClick={() => handleVoteHelpful(review.id)}
                                disabled={helpfulVotes[review.id]}
                                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 px-3.5 py-2 rounded-full border ${
                                  helpfulVotes[review.id]
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700 scale-[1.02]"
                                    : "bg-white border-black/[0.04] text-[#565656]/70 hover:bg-[#CC826A]/5 hover:border-[#CC826A]/20 hover:text-[#CC826A] active:scale-95 cursor-pointer"
                                }`}
                              >
                                <ThumbsUp
                                  size={11}
                                  className={
                                    helpfulVotes[review.id]
                                      ? "fill-current"
                                      : ""
                                  }
                                />
                                <span>
                                  {helpfulVotes[review.id]
                                    ? "Helpful!"
                                    : "Helpful"}{" "}
                                  ({review.helpfulCount || 0})
                                </span>
                              </button>

                              <span className="text-[10px] text-[#565656]/40 hover:text-[#CC826A] transition-colors cursor-pointer font-bold uppercase tracking-widest">
                                Report
                              </span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "qna" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Questions List */}
                  <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#121212] mb-4">
                      Customer Questions ({qnas.length})
                    </h3>

                    {qnas.length === 0 ? (
                      <p className="text-xs sm:text-sm text-[#565656] font-light">
                        No questions asked yet. Be the first to ask!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {qnas.map((q) => (
                          <div
                            key={q.id}
                            className="bg-[#FAF9F6] p-5 rounded-xl border border-black/[0.02] flex flex-col gap-3.5 transition-all duration-300"
                          >
                            {/* Question Row */}
                            <div className="flex gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-[#CC826A] text-[#FAF9F6] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                                Q
                              </span>
                              <div className="flex-1">
                                <h4 className="text-xs sm:text-sm font-semibold text-[#121212] leading-snug">
                                  {q.question}
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#565656]/60">
                                  <span className="font-semibold text-[#565656]/80">
                                    {q.askedBy}
                                  </span>
                                  <span>•</span>
                                  <span>{q.date}</span>
                                </div>
                              </div>
                            </div>

                            {/* Answer Row */}
                            {q.answer ? (
                              <div className="flex gap-2.5 pl-2 border-l-2 border-[#CC826A]/30">
                                <span className="w-5 h-5 rounded-full bg-[#121212] text-[#FAF9F6] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                                  A
                                </span>
                                <div className="flex-1">
                                  <p className="text-xs sm:text-sm text-[#565656] font-light leading-relaxed">
                                    {q.answer}
                                  </p>
                                  <div className="flex items-center justify-between mt-2.5">
                                    <span className="text-[10px] text-[#CC826A] font-bold uppercase tracking-wider">
                                      Mohima Expert Team
                                    </span>

                                    {/* Helpful Like Button */}
                                    <button
                                      onClick={() => handleLikeQuestion(q.id)}
                                      className="flex items-center gap-1.5 text-[10px] text-[#565656]/60 hover:text-[#CC826A] active:scale-95 transition-all cursor-pointer bg-white px-2.5 py-1 rounded-full border border-black/[0.04]"
                                    >
                                      <ThumbsUp size={10} />
                                      <span>Helpful ({q.likes})</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex gap-2.5 pl-2 border-l-2 border-[#CC826A]/20 items-center py-1">
                                <span className="w-5 h-5 rounded-full bg-[#565656]/10 text-[#565656]/60 text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                                  A
                                </span>
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="text-xs text-[#565656]/60 italic font-light">
                                    Expert response pending...
                                  </span>
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#CC826A] animate-ping" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Ask a Question Form */}
                  <div className="lg:col-span-5 bg-[#FAF9F6] p-6 rounded-2xl border border-black/[0.02] space-y-4">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#121212] mb-1">
                        Have a Question?
                      </h3>
                      <p className="text-xs text-[#565656] font-light leading-relaxed">
                        Get responses from our skin consultants or store staff
                        within a few hours.
                      </p>
                    </div>

                    <form
                      onSubmit={handleQuestionSubmit}
                      className="space-y-3.5"
                    >
                      {/* Name input */}
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-[#565656] mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nafis S."
                          value={newQuestionName}
                          onChange={(e) => setNewQuestionName(e.target.value)}
                          className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3.5 py-2 text-xs text-[#121212] focus:outline-none focus:border-[#CC826A]"
                        />
                      </div>

                      {/* Question input */}
                      <div>
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-[#565656] mb-1">
                          Your Question
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="e.g. Is it safe to use this product twice a day?"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3.5 py-2.5 text-xs text-[#121212] focus:outline-none focus:border-[#CC826A] resize-none"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmittingQuestion}
                        className="w-full bg-[#121212] text-[#FAF9F6] text-[10px] font-bold uppercase tracking-widest py-3 rounded-full hover:bg-[#CC826A] transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingQuestion ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <HelpCircle size={12} />
                            <span>Ask Question</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommended routines section */}
        <section className="mt-20 pt-16 border-t border-[#E5E5E5] text-left">
          <div className="flex flex-col gap-2 mb-10">
            <span className="text-[10px] tracking-[0.3em] font-bold text-[#CC826A] uppercase">
              RECOMMENDED REGIMENS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-wide text-[#121212] uppercase">
              You May Also Love
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {recommendedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer />

      {/* Review Modal Form */}
      {showReviewModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop with premium blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setShowReviewModal(false)}
          />
          {/* Panel */}
          <div className="relative bg-[#FAF9F6] rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl border border-black/[0.04] text-left transition-all transform duration-300 scale-100 max-h-[90vh] overflow-y-auto animate-scale-up">
            {/* Corner Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E0A996] via-[#CC826A] to-[#D48F78]" />

            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 text-[#121212] hover:text-[#CC826A] transition-colors duration-200 cursor-pointer"
              aria-label="Close modal"
              id="close-review-modal-btn"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl sm:text-2xl font-normal tracking-wide uppercase text-[#121212] mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-[#565656] font-light mb-6">
              Your honest feedback helps us curate the best authentic beauty
              formulations.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#565656] mb-1.5">
                  Your Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohima Kabir"
                  value={newReview.name}
                  onChange={(e) =>
                    setNewReview({ ...newReview, name: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5E5E5] focus:ring-2 focus:ring-[#CC826A]/20 focus:border-[#CC826A] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none transition-all"
                  id="review-name-input"
                />
              </div>

              {/* Rating selection with interactive hover text */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#565656] mb-1.5">
                  Your Overall Rating
                </label>
                <div className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-black/[0.02]">
                  <div className="flex gap-2 text-[#CC826A]">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onMouseEnter={() => setHoverRating(stars)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() =>
                          setNewReview({ ...newReview, rating: stars })
                        }
                        className="p-1 hover:scale-115 active:scale-95 transition-all duration-150 cursor-pointer"
                        id={`star-btn-${stars}`}
                      >
                        <Star
                          size={22}
                          fill={
                            stars <= (hoverRating ?? newReview.rating)
                              ? "#CC826A"
                              : "transparent"
                          }
                          stroke="#CC826A"
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[9px] font-bold text-[#CC826A] tracking-wider uppercase min-h-[12px] transition-all">
                    {(hoverRating ?? newReview.rating) === 5 &&
                      "Perfect - Absolute Holy Grail!"}
                    {(hoverRating ?? newReview.rating) === 4 &&
                      "Great - Highly recommend!"}
                    {(hoverRating ?? newReview.rating) === 3 &&
                      "Good - Decent formulation."}
                    {(hoverRating ?? newReview.rating) === 2 &&
                      "Fair - Needs improvement."}
                    {(hoverRating ?? newReview.rating) === 1 &&
                      "Poor - Not satisfied at all."}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#565656] mb-1.5">
                  Review Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your main takeaway (e.g. Glass Skin Glow!)"
                  value={newReview.title}
                  onChange={(e) =>
                    setNewReview({ ...newReview, title: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5E5E5] focus:ring-2 focus:ring-[#CC826A]/20 focus:border-[#CC826A] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none transition-all"
                  id="review-title-input"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-[#565656] mb-1.5">
                  Detailed Review
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about the texture, hydration level, scent, skin irritation, or results you noticed..."
                  value={newReview.content}
                  onChange={(e) =>
                    setNewReview({ ...newReview, content: e.target.value })
                  }
                  className="w-full bg-white border border-[#E5E5E5] focus:ring-2 focus:ring-[#CC826A]/20 focus:border-[#CC826A] rounded-xl px-4 py-3 text-xs text-[#121212] focus:outline-none transition-all resize-none"
                  id="review-content-input"
                />
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                id="submit-review-btn"
                className="w-full bg-[#121212] hover:bg-[#CC826A] text-[#FAF9F6] text-xs font-bold uppercase tracking-widest py-4 rounded-full transition-all duration-300 shadow-md mt-4 cursor-pointer active:scale-98"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
