import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, MessageCircle, Eye, ShoppingBag, ChevronDown, Palette, Star, Award, Truck } from 'lucide-react';
import { useEffect, useRef } from 'react';
import HeroSection from '../components/home/HeroSection';
import ServicesSection from '../components/home/ServicesSection';
import GalleryPreview from '../components/home/GalleryPreview';
import FeaturesSection from '../components/home/FeaturesSection';
import ContactSection from '../components/home/ContactSection';

const HomePage = () => {
    return (
        <div className="min-h-screen" style={{ background: 'var(--dark-bg)' }}>
            <HeroSection />
            <FeaturesSection />
            <ServicesSection />
            <GalleryPreview />
            <ContactSection />
        </div>
    );
};

export default HomePage;
