import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  User, 
  ShoppingBag, 
  MessageSquare, 
  Bell, 
  Star, 
  Tags, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t('secureAuth'),
      description: t('secureAuthDesc')
    },
    {
      icon: User,
      title: t('profileMgmt'),
      description: t('profileMgmtDesc')
    },
    {
      icon: ShoppingBag,
      title: t('productReq'),
      description: t('productReqDesc')
    },
    {
      icon: MessageSquare,
      title: t('privateBidding'),
      description: t('privateBiddingDesc')
    },
    {
      icon: Bell,
      title: t('realTimeNotif'),
      description: t('realTimeNotifDesc')
    },
    {
      icon: Star,
      title: t('reviewSystem'),
      description: t('reviewSystemDesc')
    },
    {
      icon: Tags,
      title: t('tagMatching'),
      description: t('tagMatchingDesc')
    },
    {
      icon: Globe,
      title: t('multiLang'),
      description: t('multiLangDesc')
    }
  ];

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 card-hover fade-in">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:py-24 lg:py-32">
          <div className="text-center slide-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="btn-primary bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 flex items-center space-x-2 group"
              >
                <span>{t('getStarted')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                to="#features"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                {t('learnMore')}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="relative">
          <svg
            className="absolute bottom-0 w-full h-6 text-gray-50"
            preserveAspectRatio="none"
            viewBox="0 0 1440 54"
            fill="currentColor"
          >
            <path d="M0 22C120 22 120 4 240 4C360 4 360 22 480 22C600 22 600 4 720 4C840 4 840 22 960 22C1080 22 1080 4 1200 4C1320 4 1320 22 1440 22V54H0V22Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('features')}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="fade-in">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Secure Transactions</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
            <div className="fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold text-indigo-600 mb-2">LKR</div>
              <div className="text-gray-600">Sri Lankan Rupees</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and shop owners who trust BidTech for their trading needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>{t('getStarted')}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;