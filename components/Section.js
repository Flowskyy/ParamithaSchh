export default function Section({ 
  children, 
  className = "", 
  id = "",
  noPadding = false,
  title,
  subtitle
}) {
  return (
    <section 
      id={id} 
      className={`relative w-full overflow-hidden ${!noPadding ? 'py-16 md:py-24' : ''} ${className}`}
    >
      <div className="container mx-auto px-6 relative z-10">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
            {subtitle && <p className="text-lg text-slate-500">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
