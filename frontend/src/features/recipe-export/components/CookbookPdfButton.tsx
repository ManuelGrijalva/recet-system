import React from 'react';
import { cookbookPdfUrl } from '../lib/exportUrls';
import { PdfDownloadLink } from './PdfDownloadLink';

export function CookbookPdfButton(): React.JSX.Element {
  return <PdfDownloadLink href={cookbookPdfUrl()} label="Descargar mi recetario en PDF" />;
}
