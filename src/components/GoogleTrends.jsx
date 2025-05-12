import React from 'react';
import Script from 'react-load-script';

export default function GoogleTrends({ type, keyword, geo, time, url, property }) {
  const handleScriptLoad = (_) => {
    window.trends.embed.renderExploreWidgetTo(
      document.getElementById('widget'),
      type,
      {
        comparisonItem: [{ keyword, geo, time }],
        category: 0,
        property: property,
      },
      {
        exploreQuery: `q=${encodeURI(keyword)}&geo=US&date=today 12-m&gprop`,
        guestPath: 'https://trends.google.com:443/trends/embed/',
      },
    )
  };

  const renderGoogleTrend = (_) => {
    return <Script url={url} onLoad={handleScriptLoad} />
  };

  return <div className="googleTrend">{renderGoogleTrend()}</div>
}
