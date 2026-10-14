import React from 'react';
import { LegalPage } from './LegalPage';
import { LEGAL_UPDATED_AT, TERMS_INTRO, TERMS_SECTIONS } from '../lib/legalContent';

export function TermsScreen(): React.JSX.Element {
  return (
    <LegalPage
      title="Condiciones del servicio"
      updatedAt={LEGAL_UPDATED_AT}
      intro={TERMS_INTRO}
      sections={TERMS_SECTIONS}
    />
  );
}
