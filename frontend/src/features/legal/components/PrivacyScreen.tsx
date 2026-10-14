import React from 'react';
import { LegalPage } from './LegalPage';
import { LEGAL_UPDATED_AT, PRIVACY_INTRO, PRIVACY_SECTIONS } from '../lib/legalContent';

export function PrivacyScreen(): React.JSX.Element {
  return (
    <LegalPage
      title="Política de privacidad"
      updatedAt={LEGAL_UPDATED_AT}
      intro={PRIVACY_INTRO}
      sections={PRIVACY_SECTIONS}
    />
  );
}
