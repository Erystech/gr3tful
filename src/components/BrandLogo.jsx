export function BrandMark({ className = '', decorative = false }) {
  return <img src="/brand/mark.svg" width="512" height="512" alt={decorative ? '' : 'Gr3tful'} className={`shrink-0 ${className}`} />;
}

export default function BrandLogo({ className = '', inverse = false, wordmarkOnly = false }) {
  const asset = wordmarkOnly ? 'wordmark' : 'logo';
  return (
    <span role="img" aria-label="Gr3tful" className={`brand-logo ${inverse ? 'brand-logo--inverse' : ''} ${className}`}>
      <img src={`/brand/${asset}-on-light.svg`} alt="" className="brand-logo__light" />
      <img src={`/brand/${asset}-on-dark.svg`} alt="" className="brand-logo__dark" />
    </span>
  );
}
