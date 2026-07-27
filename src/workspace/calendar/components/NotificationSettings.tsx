import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

export const NotificationSettings: React.FC = () => {
  const { settings, updateSettings } = useNotifications();

  return (
    <div style={{ padding: '16px' }}>
      <h3>Notification Preferences</h3>
      <label style={{ display: 'block', marginBottom: '8px' }}>
        <input
          type="checkbox"
          checked={settings.enableDesktopNotifications}
          onChange={(e) => {
            updateSettings({ enableDesktopNotifications: e.target.checked });
          }}
        />
        Enable Desktop Alerts
      </label>
    </div>
  );
};
