const fs = require('fs');
const path = require('path');

const pages = [
  "src/app/(app)/visitor/shipments/page.tsx",
  "src/app/(app)/visitor/addresses/page.tsx",
  "src/app/(app)/owner/linking/page.tsx",
  "src/app/(app)/owner/addresses/[na_id]/variants/page.tsx",
  "src/app/(app)/gov/users/page.tsx",
  "src/app/(app)/gov/linking/[id]/page.tsx",
  "src/app/(app)/gov/issuance/policy/page.tsx",
  "src/app/(app)/gov/issuance/page.tsx",
  "src/app/(app)/gov/home/page.tsx",
  "src/app/(app)/gov/config/page.tsx",
  "src/app/(app)/gov/audit/page.tsx",
  "src/app/(app)/gov/addresses/page.tsx",
  "src/app/(app)/carrier/shipments/[id]/confirm/page.tsx",
  "src/app/(app)/carrier/shipments/page.tsx",
  "src/app/(app)/carrier/log/page.tsx",
  "src/app/(app)/carrier/home/page.tsx"
];

const basePath = "c:/Users/Kimo Store/Desktop/project-tna/project-a/frontend/tna-project";

const roleArabic = {
    'visitor': 'الزائر',
    'owner': 'المالك',
    'gov': 'الحكومة',
    'carrier': 'الناقل'
};

pages.forEach((page, idx) => {
  const fullPath = path.join(basePath, page);
  const parts = page.split('/');
  const role = parts[4]; // Wait, parts are: src, app, (app), gov, home, page.tsx
  // Actually, parts[0]="src", parts[1]="app", parts[2]="(app)", parts[3]=role, parts[4]=first subroute...
  const roleName = parts[3]; 
  let title = parts.slice(4, -1).join(' ').replace(/[[\]]/g, '').toUpperCase();
  if (!title) title = roleName.toUpperCase() + ' HOME';

  const arabicRoleLabel = roleArabic[roleName] || roleName;

  const component = `'use client';
import React from 'react';

export default function Page() {
    return (
        <div className="flex flex-col min-h-screen p-6 md:p-10 font-arabic bg-slate-50/50" dir="rtl">
            <div className="mb-8 flex items-center justify-between animate-in fade-in slide-in-from-bottom duration-500">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">نظام ${arabicRoleLabel}</h1>
                    <p className="text-slate-500 font-medium tracking-wide">صفحة ${title}</p>
                </div>
                <div className="h-14 w-14 bg-[#199bd7]/10 rounded-full flex items-center justify-center text-[#199bd7] shadow-sm">
                    <span className="material-symbols-outlined text-2xl">grid_view</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 p-8 flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom duration-700">
                <div className="mb-6 p-6 bg-slate-50 rounded-full shadow-inner ring-1 ring-slate-100">
                    <span className="material-symbols-outlined text-6xl text-slate-300">view_quilt</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">واجهة ${title}</h2>
                <p className="text-slate-500 max-w-md leading-relaxed mb-8">
                    هذه الصفحة تم تحديثها واستبدال النموذج المبدئي بتصميم أساسي. سيتم دمج المحتوى الفعلي هنا قريباً بحسب الصلاحيات المحددة لـ ${arabicRoleLabel}.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                    <button className="px-6 py-2.5 bg-[#199bd7] text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:bg-[#1A73C1] transition-all transform hover:-translate-y-0.5">
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[20px]">refresh</span>
                           تحديث البيانات
                        </div>
                    </button>
                    <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-all">
                        <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                           العودة
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Background design pattern */}
            <div className="fixed inset-0 pointer-events-none -z-10" style={{
                backgroundImage: 'radial-gradient(#199bd7 0.5px, transparent 0.5px), radial-gradient(#199bd7 0.5px, transparent 0.5px)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
                opacity: 0.05
            }} />
        </div>
    );
}
`;
  
  if (fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, component);
  }
});

console.log("DONE");
