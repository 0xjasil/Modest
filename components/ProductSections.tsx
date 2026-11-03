import React from "react";
import ProductCard, { type Product } from "@/components/ProductCard";
import { SectionHeader } from "@/components/ProductGrid";

const HEALTH: Product[] = [
  { id:"h1", brand:"Mountainor", category:"skincare", rating:4.4, reviewCount:312,
    name:"Mountainor Liposomal Glutathione Tablets for Glowing Skin",
    price:849, originalPrice:1199, discount:29,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/7/d/7daa03b8904417322507_1.jpg" },
  { id:"h2", brand:"Nutrova", category:"skincare", rating:4.5, reviewCount:198,
    name:"Nutrova Collagen+ Antioxidants Marine Collagen Supplement",
    price:2575, originalPrice:2999, discount:14,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/4/8/480b2a7CERAV00000010_1.jpg" },
  { id:"h3", brand:"Oziva", category:"haircare", rating:4.3, reviewCount:445,
    name:"Oziva Advanced Hair Growth Actives & Biotin",
    price:1849, originalPrice:2099, discount:11,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/8/3/836fd53FOXTA00000081_1.jpg" },
  { id:"h4", brand:"Chicnutrix", category:"skincare", rating:4.6, reviewCount:267,
    name:"Chicnutrix Mighty Collagen Japanese Marine Collagen",
    price:999, originalPrice:1800, discount:44,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/e/9/e9e5b79DOTKE00000213l_1.jpg" },
  { id:"h5", brand:"Chicnutrix", category:"skincare", rating:4.4, reviewCount:189,
    name:"Chicnutrix Glow Advanced Glutathione Fizzy Tabs",
    price:909, originalPrice:1399, discount:35,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/c/0/c050529INSIG00000812_01.jpg" },
  { id:"h6", brand:"Oziva", category:"skincare", rating:4.5, reviewCount:523,
    name:"Oziva Bioactive Gluta Fizzy Effervescent Tablets",
    price:2375, originalPrice:4200, discount:43,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/4/5/4556818STAZE00000102_1.jpg" },
];

const GIFTS: Product[] = [
  { id:"g1", brand:"L'Oréal Paris", category:"makeup", rating:4.4, reviewCount:312,
    name:"L'Oréal Paris Golden Glam Festive Gift Set",
    price:1718, originalPrice:2147, discount:20,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/8/d/8d07f53FACES00000523_1.jpg" },
  { id:"g2", brand:"PIXI", category:"makeup", rating:4.6, reviewCount:98,
    name:"PIXI On-The-Glow Mini Blush Duo Kit",
    price:2200, originalPrice:2500, discount:12,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/c/5/c591c1a8809516795705x_1.jpg" },
  { id:"g3", brand:"Moryelle", category:"skincare", rating:4.7, reviewCount:145,
    name:"Moryelle Beauté Radiance Gifting Ritual",
    price:3499, originalPrice:4999, discount:30,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/2/7/2783ca3NYKAF00000028p.jpg" },
  { id:"g4", brand:"inde wild", category:"makeup", rating:4.3, reviewCount:76,
    name:"inde wild Ice And Spice Dewy Lip Treatment Set",
    price:1528, originalPrice:1798, discount:15,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/6/7/673a1e8SWIAC00000247_s1.jpg" },
  { id:"g5", brand:"Moryelle", category:"fragrance", rating:4.5, reviewCount:203,
    name:"Moryelle Beauté Aura Fragrance Luxe Discovery Set",
    price:2210, originalPrice:3299, discount:33,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/e/1/e100d9e8904245702540_1.jpg" },
  { id:"g6", brand:"GUESS", category:"fragrance", rating:4.4, reviewCount:167,
    name:"GUESS Seductive Eau de Toilette Festive Gift Set",
    price:4875, originalPrice:6500, discount:25,
    image:"https://images-static.nykaa.com/media/catalog/product/tr:w-220,h-220,cm-pad_resize/5/4/5445facCONAC00000023ab_ab1.png" },
];

function Row({ id, title, subtitle, href, products }:
  { id: string; title: string; subtitle: string; href: string; products: Product[] }) {
  return (
    <section className="bg-mb-bg py-8 px-4 md:px-6 border-t border-mb-border-lite" aria-labelledby={id}>
      <div className="mx-auto max-w-content">
        <SectionHeader title={title} subtitle={subtitle} viewAllHref={href} />
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export default function ProductSections() {
  return (
    <>
      <Row id="health-h" title="Health & Wellness" subtitle="Supplements, botanical elixirs & daily wellness" href="/category/health-wellness" products={HEALTH} />
      <Row id="gifts-h"  title="Moryelle Beauté Gifting Studio" subtitle="Curated luxury rituals for every occasion" href="/category/gifting" products={GIFTS} />
    </>
  );
}
