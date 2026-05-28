import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, MapPin, ExternalLink, Mountain } from 'lucide-react';

const MASSIFS = {
  VANOISE: { id: 'VANOISE', name: 'Vanoise' },
  BEAUFORTAIN: { id: 'BEAUFORTAIN', name: 'Beaufortain' }
};

const RISK_SCALE = [
  { level: 1, name: 'Faible', color: 'bg-green-500 text-white', desc: 'L\'instabilité du manteau neigeux ne concerne que quelques pentes.' },
  { level: 2, name: 'Limité', color: 'bg-yellow-400 text-slate-800', desc: 'Instabilité dans certaines pentes raides, mais globalement stable.' },
  { level: 3, name: 'Marqué', color: 'bg-orange-500 text-white', desc: 'Instabilité marquée sur de nombreuses pentes raides.' },
  { level: 4, name: 'Fort', color: 'bg-red-600 text-white', desc: 'Forte instabilité. Déclenchements probables avec faible surcharge.' },
  { level: 5, name: 'Très Fort', color: 'bg-slate-900 text-red-500 border border-red-500', desc: 'Instabilité généralisée. Nombreuses et très grandes avalanches spontanées.' }
];

export default function AvalancheApp() {
  const [activeMassif, setActiveMassif] = useState(MASSIFS.VANOISE.id);
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [activeMassif]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Section */}
      <header className="bg-slate-900 text-white p-4 shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Mountain className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2">
                BERA <span className="font-light text-slate-400 hidden sm:inline">| Risque Avalanche</span>
              </h1>
              <p className="text-xs text-slate-400">Données issues de Météo-France</p>
            </div>
          </div>
          
          {/* Massif Selector Navigation */}
          <nav className="flex bg-slate-800 p-1 rounded-lg w-full sm:w-auto overflow-x-auto shadow-inner border border-slate-700">
            {Object.values(MASSIFS).map((massif) => (
              <button
                key={massif.id}
                onClick={() => setActiveMassif(massif.id)}
                className={`
                  flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${activeMassif === massif.id 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'}
                `}
              >
                <MapPin className="w-4 h-4" />
                {massif.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: BERA Iframe Viewer */}
          <div className="w-full lg:w-3/4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[800px] xl:min-h-[1000px]">
            {/* Header of the viewer */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                Bulletin du Massif : <span className="text-blue-600 font-bold">{MASSIFS[activeMassif].name}</span>
              </h2>
              <a 
                href={`https://bulletin.metabera.ovh/bera.php?massif=${activeMassif}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                title="Ouvrir dans un nouvel onglet"
              >
                Plein écran <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 z-10 backdrop-blur-sm mt-12">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium">Récupération du dernier bulletin...</p>
                <p className="text-sm text-slate-400 mt-2">Source : Météo-France</p>
              </div>
            )}

            {/* The Document */}
            <iframe 
              src={`https://bulletin.metabera.ovh/bera.php?massif=${activeMassif}`}
              className="w-full flex-grow border-0 bg-white"
              onLoad={handleIframeLoad}
              title={`BERA ${MASSIFS[activeMassif].name}`}
            />
          </div>

          {/* Right Column: Educational Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col gap-4">
            
            {/* Risk Scale Legend */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Échelle de Risque
              </h3>
              <div className="space-y-4">
                {RISK_SCALE.map((risk) => (
                  <div key={risk.level} className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-3 font-semibold text-slate-700">
                      <span className={`w-7 h-7 rounded flex items-center justify-center font-bold text-sm shadow-sm ${risk.color}`}>
                        {risk.level}
                      </span>
                      {risk.name}
                    </div>
                    <p className="text-slate-500 text-xs ml-10 leading-relaxed">{risk.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contextual Information Panel */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Informations
              </h3>
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Ce service récupère les données brutes des flux ouverts de <strong>Météo-France</strong> et les rend lisibles sur le web. 
                <br/><br/>
                En saison hivernale, un nouveau bulletin (BERA) est publié <strong>tous les jours vers 16h00</strong>.
              </p>
              
              <a 
                href="https://meteofrance.com/meteo-montagne/alpes-du-nord/risques-avalanche" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 px-4 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium shadow-sm"
              >
                Site officiel Météo-France <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
