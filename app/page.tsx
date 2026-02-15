'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Ship,
  Plane,
  Package,
  MessageCircle,
  Clock,
  Shield,
  TrendingUp,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
  Globe,
  Zap,
  Award
} from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './providers/LanguageProvider';
import heroImage from './pat-whelen-xSsWBa4rb6E-unsplash.jpg';

export default function WatinexLanding() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [isFAQSectionOpen, setIsFAQSectionOpen] = useState(true);

  const services = [
    { icon: Ship, titleKey: 'landing.service1Title', descKey: 'landing.service1Desc', gradient: 'from-cyan-500 to-blue-600' },
    { icon: Plane, titleKey: 'landing.service2Title', descKey: 'landing.service2Desc', gradient: 'from-orange-500 to-red-600' },
    { icon: Package, titleKey: 'landing.service3Title', descKey: 'landing.service3Desc', gradient: 'from-purple-500 to-pink-600' }
  ];

  const faqs = [
    { questionKey: 'landing.faqQ1', answerKey: 'landing.faqA1' },
    { questionKey: 'landing.faqQ2', answerKey: 'landing.faqA2' },
    { questionKey: 'landing.faqQ3', answerKey: 'landing.faqA3' },
    { questionKey: 'landing.faqQ4', answerKey: 'landing.faqA4' },
    { questionKey: 'landing.faqQ5', answerKey: 'landing.faqA5' }
  ];

  const whatsappNumber = '+213794964029';
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`;

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-500">
        
        {/* Enhanced Decorative Background Elements with Animated Particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-orange-400/15 to-red-600/15 rounded-full blur-3xl animate-float-delayed"></div>
          
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-500/30 rounded-full animate-particle-1"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-500/40 rounded-full animate-particle-2"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-purple-500/30 rounded-full animate-particle-3"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.03]"></div>
        </div>

        {/* Navigation - Enhanced with backdrop blur */}
        <nav className="relative z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16 lg:h-20">
              {/* Logo with enhanced animation */}
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Ship className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                </div>
                <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent tracking-tight">
                  Watinex
                </span>
              </div>

              {/* Theme & Language */}
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </nav>

        {/* ENHANCED HERO SECTION - no overflow-hidden to prevent text clipping */}
        <section className="relative z-10 pt-12 lg:pt-24 pb-16 lg:pb-32 px-4 overflow-visible">
          <div className="max-w-7xl mx-auto overflow-visible">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-visible">
              
              {/* Left Column - Content (no min-w-0 to avoid clipping headline) */}
              <div className="space-y-8 animate-fade-in-up overflow-visible">
                
                {/* Premium Badge with Sparkle Effect */}
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 backdrop-blur-sm group hover:border-cyan-500/50 transition-all duration-300 cursor-default">
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-cyan-700 via-blue-700 to-purple-700 dark:from-cyan-300 dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                    {t('landing.heroBadge')}
                  </span>
                  <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Main Headline - padding-inline-end so right-edge text is not clipped */}
                <div className="space-y-2 w-full max-w-full overflow-visible pe-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.2] tracking-tight overflow-visible break-words hyphens-none" style={{ wordBreak: 'normal' }}>
                    <span className="inline-block pe-[0.15em] max-w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                      {t('landing.heroYourGoodsFrom')}
                    </span>
                    <span className="block mt-2 pe-[0.15em] max-w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-fade-in-up animate-gradient" style={{ animationDelay: '0.2s' }}>
                      {t('landing.heroChinaDubai')}
                    </span>
                    <span className="block mt-2 pe-[0.15em] max-w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                      {t('landing.heroToAlgeria')}
                    </span>
                  </h1>
                  
                  {/* Decorative line */}
                  <div className="flex items-center gap-3 pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"></div>
                    <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <div className="h-1 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced Subtitle with Better Hierarchy */}
                <div className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium max-w-2xl">
                    {t('landing.heroSubtitle')}
                  </p>
                  
                  {/* Stats Row - Social Proof */}
                  <div className="flex flex-wrap gap-6 lg:gap-8 pt-2">
                    <div className="flex items-center gap-2 group cursor-default">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all">
                        <Package className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">500+</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Shipments/Month</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 group cursor-default">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
                        <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">98%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Success Rate</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 group cursor-default">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all">
                        <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">15+</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Countries</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Benefits Pills - Enhanced Design */}
                <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <div className="group relative overflow-hidden px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border border-cyan-200/50 dark:border-cyan-800/50 hover:border-cyan-400/70 dark:hover:border-cyan-600/70 transition-all duration-300 cursor-default hover:scale-105 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-2">
                      <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                      <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{t('landing.heroBenefit1')}</span>
                      <Zap className="w-3 h-3 text-cyan-500 dark:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50 hover:border-blue-400/70 dark:hover:border-blue-600/70 transition-all duration-300 cursor-default hover:scale-105 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{t('landing.heroBenefit2')}</span>
                      <Zap className="w-3 h-3 text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200/50 dark:border-purple-800/50 hover:border-purple-400/70 dark:hover:border-purple-600/70 transition-all duration-300 cursor-default hover:scale-105 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{t('landing.heroBenefit3')}</span>
                      <Zap className="w-3 h-3 text-purple-500 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* CTA Buttons - Enhanced with better hierarchy */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 active:scale-95"
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-shift"></div>
                    
                    {/* Button content */}
                    <div className="relative flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>{t('landing.ctaStartImport')}</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </a>

                  <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl">
                    {t('landing.ctaViewServices')}
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Trust Indicators - Enhanced with icons */}
                <div className="flex flex-wrap gap-6 pt-8 border-t border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                      <Shield className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('landing.trustCustoms')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('landing.trustSupport')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 group cursor-default">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('landing.trustTracking')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Hero Image (no blur on image) */}
              <div className="relative animate-fade-in-up overflow-visible" style={{ animationDelay: '0.4s' }}>
                {/* Main image container - sharp image, no blur */}
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl group">
                  {/* Light gradient overlay only - no blur */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
                  
                  {/* Hero image - pat-whelen containers, no blur */}
                  <Image
                    src={heroImage}
                    alt="Import Export Logistics - Shipping containers and cargo"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    quality={95}
                  />
                  
                  {/* Live tracking badge - solid background, no blur */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl p-4 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white">{t('landing.liveTracking')}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">Real-time updates</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <Ship className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-6 right-6 w-20 h-20 border-t-4 border-r-4 border-white/30 rounded-tr-3xl z-20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative z-10 py-16 lg:py-24 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                {t('landing.servicesTitle')}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                {t('landing.servicesSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 overflow-visible">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-slate-800 rounded-2xl p-8 pb-10 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 overflow-visible"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl pointer-events-none`}></div>
                  
                  <div className="relative mb-6">
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                    <div className={`relative bg-gradient-to-br ${service.gradient} p-4 rounded-xl inline-block`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {t(service.descKey)}
                  </p>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-base text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-2 transition-all"
                  >
                    {t('landing.getStarted')}
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative z-10 py-16 lg:py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <button
                onClick={() => setIsFAQSectionOpen(!isFAQSectionOpen)}
                className="w-full group"
              >
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {t('landing.faqTitle')}
                    </h2>
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                      {isFAQSectionOpen ? (
                        <Minus className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      ) : (
                        <Plus className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
                    {t('landing.faqSubtitle')}
                  </p>
                </div>
              </button>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                isFAQSectionOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="font-semibold text-lg text-slate-900 dark:text-white pr-4">
                        {t(faq.questionKey)}
                      </span>
                      {openFAQ === index ? (
                        <Minus className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                      ) : (
                        <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openFAQ === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="px-6 pb-5 text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-4">
                        {t(faq.answerKey)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-16 lg:py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 lg:p-12 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>

              <div className="relative text-center text-white space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {t('landing.ctaTitle')}
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                  {t('landing.ctaSubtitle')}
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 text-lg font-semibold text-cyan-600 bg-white rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('landing.ctaButton')}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 bg-slate-900 dark:bg-slate-950 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
                    <Ship className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold">Watinex</span>
                </div>
                <p className="text-base text-slate-400 leading-relaxed">
                  {t('landing.footerTagline')}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">{t('landing.quickLinks')}</h3>
                <ul className="space-y-2 text-base text-slate-400">
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">{t('landing.servicesLink')}</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">{t('landing.pricingLink')}</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">{t('landing.trackingLink')}</a></li>
                  <li><a href="#" className="hover:text-cyan-400 transition-colors">{t('landing.faqLink')}</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">{t('landing.contact')}</h3>
                <ul className="space-y-2 text-base text-slate-400">
                  <li className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-cyan-400" />
                    <span>{whatsappNumber}</span>
                  </li>
                  <li>{t('landing.algeria')}</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
              <p>{t('landing.copyright')}</p>
            </div>
          </div>
        </footer>

        {/* Floating WhatsApp Button */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 group"
          aria-label={t('landing.ctaButton')}
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
        </a>

      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(1.1);
          }
          66% {
            transform: translate(20px, -20px) scale(0.9);
          }
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes particle-1 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(100px, -100px);
            opacity: 0.7;
          }
        }

        @keyframes particle-2 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
          50% {
            transform: translate(-80px, 80px);
            opacity: 0.8;
          }
        }

        @keyframes particle-3 {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          50% {
            transform: translate(60px, 120px);
            opacity: 0.6;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }

        .animate-particle-1 {
          animation: particle-1 15s ease-in-out infinite;
        }

        .animate-particle-2 {
          animation: particle-2 18s ease-in-out infinite;
        }

        .animate-particle-3 {
          animation: particle-3 20s ease-in-out infinite;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        body {
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        }

        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}