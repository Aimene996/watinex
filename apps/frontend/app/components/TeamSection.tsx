'use client';

import { useLanguage } from '../providers/LanguageProvider';

export function TeamSection() {
  const { t } = useLanguage();

  const members = [
    { nameKey: 'team.m1Name', roleKey: 'team.m1Role', initials: 'أب', gradient: 'from-blue-500 to-indigo-600' },
    { nameKey: 'team.m2Name', roleKey: 'team.m2Role', initials: 'يخ', gradient: 'from-cyan-500 to-blue-600' },
    { nameKey: 'team.m3Name', roleKey: 'team.m3Role', initials: 'سب', gradient: 'from-violet-500 to-indigo-600' },
    { nameKey: 'team.m4Name', roleKey: 'team.m4Role', initials: 'كم', gradient: 'from-blue-600 to-cyan-500' },
    { nameKey: 'team.m5Name', roleKey: 'team.m5Role', initials: 'نح', gradient: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <section id="team" className="relative z-10 py-20 lg:py-28 px-4 overflow-hidden">
      {/* Background with blur blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#070e1a] via-[#0c1a33] to-[#0a1628]" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
            {t('team.title')}
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {members.map((member, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center"
            >
              {/* Glassmorphism card */}
              <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 pb-6 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                {/* Avatar */}
                <div className="relative mx-auto mb-4">
                  <div className={`w-20 h-20 lg:w-24 lg:h-24 mx-auto rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg shadow-blue-900/30 ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-500 group-hover:scale-105`}>
                    <span className="text-xl lg:text-2xl font-bold text-white/90 drop-shadow-sm">
                      {member.initials}
                    </span>
                  </div>
                  {/* Online dot */}
                  <div className="absolute bottom-0 right-1/2 translate-x-[30px] lg:translate-x-[36px] w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-[#0c1a33] shadow-sm shadow-emerald-500/40" />
                </div>

                {/* Name & Role */}
                <h4 className="font-bold text-white text-sm lg:text-base leading-tight">
                  {t(member.nameKey)}
                </h4>
                <p className="text-blue-300/60 text-xs lg:text-sm mt-1.5 font-medium">
                  {t(member.roleKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
