'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Icon } from './Icon';

type Product = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  price: number | null;
  amazon_url: string | null;
  flipkart_url: string | null;
  is_featured: boolean | null;
};

export default function AffiliateProductsSection({ featuredOnly = true }: { featuredOnly?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      let query = supabase.from('products')
        .select('id,name,description,category,image_url,price,amazon_url,flipkart_url,is_featured')
        .eq('is_active', true);
      if (featuredOnly) query = query.eq('is_featured', true);
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(featuredOnly ? 4 : 100);

      if (error) {
        console.error('Could not load affiliate products:', error);
        return;
      }
      if (active) setProducts((data || []) as Product[]);
    };
    void loadProducts();
    return () => { active = false; };
  }, [featuredOnly]);

  return (
    <section className="affiliate-section page-width" id="store">
      <div className="section-heading affiliate-heading">
        <div><span className="eyebrow">GEAR UP FOR THE MILES</span><h2>{featuredOnly ? <>Runner’s <em>favorites.</em></> : <>Runner’s <em>Shop.</em></>}</h2></div>
        <span className="affiliate-note">Some links may earn us a small commission.</span>
      </div>
      {!featuredOnly && <p className="shop-intro">Explore running essentials selected for your training and race day.</p>}
      {products.length ? (
        <div className="affiliate-grid">
          {products.map((product) => {
            const buyUrl = product.amazon_url || product.flipkart_url;
            return (
              <article className="affiliate-card" key={product.id}>
                <div className="affiliate-image">
                  {product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" /> : <span aria-hidden="true">🏃</span>}
                  {product.category && <span className="affiliate-category">{product.category}</span>}
                </div>
                <div className="affiliate-info">
                  <h3>{product.name}</h3>
                  {product.price !== null && <strong className="affiliate-price">₹{product.price.toLocaleString('en-IN')}</strong>}
                  {buyUrl ? <a className="affiliate-buy-now" href={buyUrl} target="_blank" rel="sponsored noreferrer">Buy Now <span aria-hidden="true">↗</span></a> : <span className="affiliate-buy-now is-disabled">Buy Now · Link coming soon</span>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="affiliate-empty">Recommended running gear will appear here soon.</div>
      )}
      {featuredOnly && <div className="affiliate-shop-link"><Link href="/shop">Shop all running gear <Icon name="arrow" size={16} /></Link></div>}
    </section>
  );
}

