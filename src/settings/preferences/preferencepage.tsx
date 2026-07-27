// frontend/src/settings/preferences/PreferencesPage.tsx
import React, { useEffect, useState } from 'react';
import { PreferenceSection } from './preferenceSection';
import { preferencesService, UIPreferences } from './preferencesService';

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
        // Fallback securely behind isolated local system parameters state bounds
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Application Workspace Preferences
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Fine-tune workflow parameters, automation heuristics, and layout densities.
        </p>
      </div>
      <hr className="border-slate-800" />
      <div className="space-y-4">
        <PreferenceSection
          title="Dense Architecture Mode"
          description="Reduce text layout line padding parameters to prioritize screen information volume density."
          isEnabled={prefs.denseMode}
          onToggle={() => {
            handleToggle('denseMode');
          }}
        />
        <PreferenceSection
          title="Inline Context Automation"
          description="Inject generative prompt auto-completions in work areas dynamically using Aether inference algorithms."
          isEnabled={prefs.autocompleteAI}
          onToggle={() => {
            handleToggle('autocompleteAI');
          }}
        />
        <PreferenceSection
          title="Performance Matrix Telemetry"
          description="Allow transmission of diagnostic execution measurements anonymously to trace exceptions."
          isEnabled={prefs.telemetryLogging}
          onToggle={() => {
            handleToggle('telemetryLogging');
          }}
        />
      </div>
    </div>
  );
};
