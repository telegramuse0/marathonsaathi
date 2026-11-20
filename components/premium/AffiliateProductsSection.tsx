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
            return (
              <article className="affiliate-card" key={product.id}>
                <div className="affiliate-image">
                  {product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" /> : <span aria-hidden="true">🏃</span>}
                  {product.category && <span className="affiliate-category">{product.category}</span>}
                </div>
                <div className="affiliate-info">
                  <h3>{product.name}</h3>
                  <div className="affiliate-actions">
                    {product.amazon_url ? <a href={product.amazon_url} target="_blank" rel="sponsored noreferrer">Amazon <span aria-hidden="true">↗</span></a> : <span className="affiliate-action-disabled">Amazon link pending</span>}
                    {product.flipkart_url ? <a href={product.flipkart_url} target="_blank" rel="sponsored noreferrer">Flipkart <span aria-hidden="true">↗</span></a> : <span className="affiliate-action-disabled">Flipkart link pending</span>}
                  </div>
                  {product.description && <p>{product.description}</p>}
                  <div className="affiliate-bottom">
                    <strong>{product.price !== null ? `₹${product.price.toLocaleString('en-IN')}` : 'Recommended gear'}</strong>
                  </div>
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

