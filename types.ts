
export type AppRoute = 
  | 'LANDING'
  | 'HUB'
  | 'ANTI_LIFE'
  | 'BIAS_DETECTOR'
  | 'WORLD_SIM'
  | 'SUBTEXT'
  | 'EGO_BOUNDARY'
  | 'LANG_SMELL'
  | 'DECISION_PATH'
  | 'COST_CALC'
  | 'DECEPTION'
  | 'EXTREME_SIM'
  | 'JURY'
  | 'CYBER_DEBATE'
  | 'CODE_ARCH'
  | 'DEVILS_ADVOCATE'
  | 'CONCEPT_STITCHER';

export interface AppDefinition {
  id: AppRoute;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  isDev?: boolean;
}

export interface AntiLifeResult {
  deathTime: string;
  causeOfDeath: string;
  clinicalAnalysis: string;
  fatalSymptom: string;
  preventableMeasure: string;
  survivalRate: number;
}

export interface Virus {
  name: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  symptom: string;
  treatment: string;
}

export interface BiasResult {
  infectionRate: number;
  overallDiagnosis: string;
  viruses: Virus[];
  quarantineAdvice: string;
}

export interface TimelineEvent {
  year: string;
  event: string;
  impact: string;
}

export interface WorldSimResult {
  chaosLevel: number;
  divergencePoint: string;
  timeline: TimelineEvent[];
  breakingNews: {
    headline: string;
    source: string;
    date: string;
  };
  newLaws: string[];
  survivorGuide: {
    role: string;
    keySkill: string;
    mustHaveItem: string;
  };
}

export interface SubtextResult {
  bullshitMeter: number;
  voiceStressAnalysis: string;
  declassifiedContent: Array<{
    original: string;
    decoded: string;
    intent: string;
  }>;
  verdict: string;
  powerDynamics: string;
}

export interface EgoBoundaryResult {
  integrityScore: number;
  yieldPoint: {
    trigger: string;
    pressureLevel: string;
  };
  fractureMode: string;
  structuralWeaknesses: Array<{
    location: string;
    description: string;
    riskLevel: string;
  }>;
  reinforcementPlan: string;
}

export interface LangSmellResult {
  composition: Array<{
    label: string;
    percentage: number;
    colorCode?: string;
  }>;
  scentProfile: {
    topNote: string;
    middleNote: string;
    baseNote: string;
  };
  toxicityPPM: number;
  aiProbability: number;
  detectionLog: string;
}

export interface DecisionInput {
  title: string;
  category?: string;
  timeframe?: string;
  urgency?: number;
  currentState?: string;
  constraints?: string;
  irreversibles?: string;
  options: Array<{
    name: string;
    desc: string;
    pros: string;
    cons: string;
    emotionalPull: number;
  }>;
  weights?: {
    riskTolerance: number;
    stabilityPref: number;
    growthPriority: number;
    shortTermPressure: number;
  };
}

export interface DecisionPathResult {
  decision_nature: {
    type: string;
    core_conflict: string;
    key_uncertainty: string;
  };
  comparison_matrix: Array<{
    option: string;
    short_term_gain: string;
    medium_term_risk: string;
    long_term_ceiling: string;
    irreversibility: string;
    exit_path: string;
    emotional_sustainability: string;
  }>;
  risk_warnings: Array<{
    option: string;
    underestimated_risk: string;
    why_it_is_dangerous: string;
  }>;
  experimentation_suggestions: Array<{
    option: string;
    test_method: string;
    cost: string;
    timeframe: string;
  }>;
  stop_loss_signals: Array<{
    option: string;
    signal: string;
    action: string;
  }>;
  cooling_advice: {
    emotional_bias_detected: string;
    recommended_wait_time: string;
    recheck_questions: string[];
  };
}

export interface CostCalcResult {
  invoiceId: string;
  currencyUnit: string;
  lineItems: Array<{
    category: string;
    description: string;
    cost: string;
  }>;
  totalCost: string;
  finePrint: string;
}

export interface DeceptionResult {
  bluePillNarrative: string;
  redPillTruth: string;
  glitchFactor: number;
  systemFailureLog: string[];
  realityPatch: string;
}

export interface ExtremeSimResult {
  disasterLevel: string;
  currentImpact: string;
  cascadeTimeline: Array<{
    time: string;
    event: string;
    magnitude: number;
  }>;
  finalCollapse: string;
  tippingPoint: string;
}

export interface JuryResult {
  councilName: string;
  chaosMeter: number;
  jurors: Array<{
    archetype: string;
    icon: string;
    stance: 'SUPPORT' | 'OPPOSE' | 'ABSTAIN';
    intensity: number;
    monologue: string;
  }>;
  finalDecree: string;
}

export interface DebateResult {
  topic: string;
  redFighter: {
    name: string;
    style: string;
  };
  blueFighter: {
    name: string;
    style: string;
  };
  rounds: Array<{
    roundName: string;
    redMove: {
      name: string;
      content: string;
      damage: number;
    };
    blueMove: {
      name: string;
      content: string;
      damage: number;
    };
  }>;
  winner: 'RED' | 'BLUE' | 'DRAW';
  fatalityMove: string;
}

export interface CodeArchResult {
  carbonDating: string;
  techStackLayer: string;
  authorProfile: {
    mentalState: string;
    caffeineLevel: string;
    hairLossRisk: string;
  };
  spaghettiIndex: number;
  excavationReport: string;
  fossilFaults: string[];
  curatorNote: string;
}

export interface DevilsResult {
  verdict: string;
  logicalCrimes: Array<{
    name: string;
    description: string;
    sentence: string;
  }>;
  tortureSession: Array<{
    tool: string;
    method: string;
    outcome: string;
  }>;
  forcedConfession: string;
  sanityScore: number;
}

export interface StitcherResult {
  startupName: string;
  tagline: string;
  userPersona: {
    name: string;
    description: string;
    desire: string;
  };
  revenueModel: string;
  growthHack: string;
  vcVerdict: string; 
  unicornProbability: number; 
}
