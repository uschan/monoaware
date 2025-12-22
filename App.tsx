
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './views/LandingPage';
import { Hub } from './views/Hub';
import { AntiLifeSimulator } from './views/AntiLifeSimulator';
import { BiasDetector } from './views/BiasDetector';
import { WorldSim } from './views/WorldSim';
import { SubtextAnalyzer } from './views/SubtextAnalyzer';
import { EgoBoundary } from './views/EgoBoundary';
import { LanguageSmell } from './views/LanguageSmell';
import { DecisionPath } from './views/DecisionPath';
import { CostCalc } from './views/CostCalc';
import { DeceptionDetector } from './views/DeceptionDetector';
import { ExtremeSim } from './views/ExtremeSim';
import { PersonalityJury } from './views/PersonalityJury';
import { CyberDebate } from './views/CyberDebate';
import { CodeArchaeologist } from './views/CodeArchaeologist';
import { DevilsAdvocate } from './views/DevilsAdvocate';
import { ConceptStitcher } from './views/ConceptStitcher';

import { SettingsModal } from './components/SettingsModal';
import { AppRoute } from './types';

const App: React.FC = () => {
  // Start at Landing Page
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('LANDING');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderView = () => {
    switch (currentRoute) {
      case 'LANDING': return <LandingPage onEnter={() => setCurrentRoute('HUB')} />;
      case 'ANTI_LIFE': return <AntiLifeSimulator />;
      case 'BIAS_DETECTOR': return <BiasDetector />;
      case 'WORLD_SIM': return <WorldSim />;
      case 'SUBTEXT': return <SubtextAnalyzer />;
      case 'EGO_BOUNDARY': return <EgoBoundary />;
      case 'LANG_SMELL': return <LanguageSmell />;
      case 'DECISION_PATH': return <DecisionPath />;
      case 'COST_CALC': return <CostCalc />;
      case 'DECEPTION': return <DeceptionDetector />;
      case 'EXTREME_SIM': return <ExtremeSim />;
      case 'JURY': return <PersonalityJury />;
      case 'CYBER_DEBATE': return <CyberDebate />;
      case 'CODE_ARCH': return <CodeArchaeologist />;
      case 'DEVILS_ADVOCATE': return <DevilsAdvocate />;
      case 'CONCEPT_STITCHER': return <ConceptStitcher />;
      case 'HUB':
      default:
        return <Hub onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <>
      <Layout 
        activeRoute={currentRoute} 
        onNavigate={setCurrentRoute}
        onOpenSettings={() => setIsSettingsOpen(true)}
      >
        {renderView()}
      </Layout>
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default App;
