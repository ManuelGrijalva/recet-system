import React from 'react';
import { recipePdfUrl } from '../lib/exportUrls';
import { PdfDownloadLink } from './PdfDownloadLink';

export function RecipePdfButton({ recipeId }: { recipeId: string }): React.JSX.Element {
  return <PdfDownloadLink href={recipePdfUrl(recipeId)} label="Descargar PDF" />;
}
