
import PromoBannerSection from '../components/home/PromoBannerSection';
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
            <PromoBannerSection />
            <ContactSection />
        </div>
    );
};

export default HomePage;
