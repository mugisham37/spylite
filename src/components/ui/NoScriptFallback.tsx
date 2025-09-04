interface NoScriptFallbackProps {
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
}

export default function NoScriptFallback({
  children,
  fallbackContent,
}: NoScriptFallbackProps) {
  return (
    <>
      <noscript>
        {fallbackContent || (
          <div className="min-h-screen flex-center bg-main-bg p-8">
            <div className="col-center gap-6 text-center max-w-2xl">
              <h1 className="text-dark-brown font-bold text-3xl">
                JavaScript Required
              </h1>
              <p className="font-paragraph text-dark-brown/80 text-lg leading-relaxed">
                This website uses advanced animations and interactive features
                that require JavaScript to function properly. Please enable
                JavaScript in your browser settings to experience the full site.
              </p>
              <div className="col-center gap-4 mt-4">
                <h2 className="text-dark-brown font-bold text-xl">
                  How to enable JavaScript:
                </h2>
                <div className="grid gap-3 text-left">
                  <div className="bg-milk p-4 rounded-lg">
                    <h3 className="font-bold text-dark-brown mb-2">
                      Chrome/Edge:
                    </h3>
                    <p className="font-paragraph text-dark-brown/80 text-sm">
                      Settings → Privacy and security → Site Settings →
                      JavaScript → Allowed
                    </p>
                  </div>
                  <div className="bg-milk p-4 rounded-lg">
                    <h3 className="font-bold text-dark-brown mb-2">Firefox:</h3>
                    <p className="font-paragraph text-dark-brown/80 text-sm">
                      Type &quot;about:config&quot; → search
                      &quot;javascript.enabled&quot; → set to true
                    </p>
                  </div>
                  <div className="bg-milk p-4 rounded-lg">
                    <h3 className="font-bold text-dark-brown mb-2">Safari:</h3>
                    <p className="font-paragraph text-dark-brown/80 text-sm">
                      Preferences → Security → Enable JavaScript
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </noscript>
      <div className="js-required">{children}</div>
    </>
  );
}
