import React, { useEffect, useState } from 'react';
import { PreferenceSection } from './preferenceSection';
import { preferencesService, UIPreferences } from './preferencesService';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Sliders } from 'lucide-react';

export const PreferencesPage: React.FC = () => {
  const [prefs, setPrefs] = useState<UIPreferences>({
    denseMode: false,
    autocompleteAI: true,
    telemetryLogging: true,
  });

  useEffect(() => {
    void (async () => {
      try {
        const data = await preferencesService.getPreferences();
        setPrefs(data);
      } catch {
        // Fallback
      }
    })();
  }, []);

  const handleToggle = (key: keyof UIPreferences) => {
    const nextVal = !prefs[key];
    setPrefs((prev) => ({ ...prev, [key]: nextVal }));
    void (async () => {
      try {
        await preferencesService.savePreference(key, nextVal);
      } catch {
        setPrefs((prev) => ({ ...prev, [key]: !nextVal }));
      }
    })();
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Application Preferences
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fine-tune workflow parameters, AI autocomplete heuristics, and layout densities.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <PreferenceSection
            title="Dense Interface Layout"
            description="Reduce layout line padding to prioritize screen information density."
            isEnabled={prefs.denseMode}
            onToggle={() => handleToggle('denseMode')}
          />
          <PreferenceSection
            title="Inline AI Autocomplete"
            description="Inject generative prompt completions dynamically in editor areas."
            isEnabled={prefs.autocompleteAI}
            onToggle={() => handleToggle('autocompleteAI')}
          />
          <PreferenceSection
            title="Performance Telemetry"
            description="Send anonymous diagnostic execution measurements to trace platform stability."
            isEnabled={prefs.telemetryLogging}
            onToggle={() => handleToggle('telemetryLogging')}
          />
        </div>
      </div>
    </PageWrapper>
  );
};
