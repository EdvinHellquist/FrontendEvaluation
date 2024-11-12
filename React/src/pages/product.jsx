import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import { url, port } from '../../serverip';
import '../css/product.css';
import Footer from '../components/footer';

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productImage, setProductImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(url + port + `/shop/products${id}`);
        const response = await fetch(url + ':' + port + `/shop/products${id}`);
        const data = await response.json();
        setProduct(data);
        const image = await import(`../assets/images/${data.image}`/* @vite-ignore */);
        setProductImage(image.default);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;
  return (
    <div>
      <Navbar/>
      <div className="product-details">
        {productImage && <img src={productImage} alt={product.name} className="product-image" />}
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <div className="color-swatch" style={{ backgroundColor: product.color }}></div>
      </div>
      <Footer></Footer>
    </div>
    
  );
}
