'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Product = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  price: number | null;
  amazon_url: string | null;
  flipkart_url: string | null;
};

export default function AffiliateProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let active = true;
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id,name,description,category,image_url,price,amazon_url,flipkart_url')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Could not load affiliate products:', error);
        return;
      }
      if (active) setProducts((data || []) as Product[]);
    };
    void loadProducts();
    return () => { active = false; };
  }, []);

  return (
    <section className="affiliate-section page-width" id="store">
      <div className="section-heading affiliate-heading">
        <div><span className="eyebrow">GEAR UP FOR THE MILES</span><h2>Runner’s <em>favorites.</em></h2></div>
        <span className="affiliate-note">Some links may earn us a small commission.</span>
      </div>
      {products.length ? (
        <div className="affiliate-grid">
          {products.map((product) => {
            const link = product.amazon_url || product.flipkart_url;
            return (
              <article className="affiliate-card" key={product.id}>
                <div className="affiliate-image">
                  {product.image_url ? <img src={product.image_url} alt={product.name} loading="lazy" /> : <span aria-hidden="true">🏃</span>}
                  {product.category && <span className="affiliate-category">{product.category}</span>}
                </div>
                <div className="affiliate-info">
                  <h3>{product.name}</h3>
                  {product.description && <p>{product.description}</p>}
                  <div className="affiliate-bottom">
                    <strong>{product.price !== null ? `₹${product.price.toLocaleString('en-IN')}` : 'Recommended gear'}</strong>
                    {link && <a href={link} target="_blank" rel="sponsored noreferrer">View product <span aria-hidden="true">↗</span></a>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="affiliate-empty">Recommended running gear will appear here soon.</div>
      )}
    </section>
  );
}
