'use client';

import { Ship, Plane, Search, Truck, MessageSquare, BarChart3, Check } from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

export function ServicesDetail() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Ship,
      titleKey: 'servicesDetail.chinaTitle',
      features: ['servicesDetail.chinaF1', 'servicesDetail.chinaF2', 'servicesDetail.chinaF3', 'servicesDetail.chinaF4', 'servicesDetail.chinaF5'],
    },
    {
      icon: Plane,
      titleKey: 'servicesDetail.dubaiTitle',
      features: ['servicesDetail.dubaiF1', 'servicesDetail.dubaiF2', 'servicesDetail.dubaiF3', 'servicesDetail.dubaiF4'],
    },
    {
      icon: Search,
      titleKey: 'servicesDetail.sourcingTitle',
      features: ['servicesDetail.sourcingF1', 'servicesDetail.sourcingF2', 'servicesDetail.sourcingF3', 'servicesDetail.sourcingF4'],
    },
    {
      icon: Truck,
      titleKey: 'servicesDetail.logisticsTitle',
      features: ['servicesDetail.logisticsF1', 'servicesDetail.logisticsF2', 'servicesDetail.logisticsF3', 'servicesDetail.logisticsF4'],
    },
  ];

  const infoCards = [
    { icon: MessageSquare, titleKey: 'servicesDetail.consultTitle', descKey: 'servicesDetail.consultDesc' },
    { icon: BarChart3, titleKey: 'servicesDetail.reportsTitle', descKey: 'servicesDetail.reportsDesc' },
  ];

  return (
    <section id="services" className="relative z-10 py-20 lg:py-28 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            {t('servicesDetail.title')}
          </h2>
          <span className="section-title-underline" />
        </div>

        {/* Service cards with bullet lists */}
        <div className="space-y-6">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={i}
                className="card-accent-left bg-white dark:bg-slate-800 rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="bg-blue-600 p-2.5 rounded-lg text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                    {t(svc.titleKey)}
                  </h3>
                </div>
                <div className="space-y-3 ps-2">
                  {svc.features.map((fKey, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600 dark:text-slate-300">{t(fKey)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Info cards (no bullets) */}
          {infoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={`info-${i}`}
                className="card-accent-left bg-white dark:bg-slate-800 rounded-xl p-6 lg:p-8 shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-indigo-600 p-2.5 rounded-lg text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white">
                    {t(card.titleKey)}
                  </h3>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed ps-2">
                  {t(card.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
