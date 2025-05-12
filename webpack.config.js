module.exports = {
  // Other webpack configuration options...

  resolve: {
    fallback: {
      "https": require.resolve("https-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "stream": require.resolve("stream-browserify"),
      "http": require.resolve("stream-http"),
      "fs": false, // You might not need a fallback for fs
      "os": require.resolve("os-browserify/browser"),
      "child_process": false, // You might not need a fallback for child_process
      "crypto": require.resolve("crypto-browserify"),
      "http2": false, // You might not need a fallback for http2
      "zlib": require.resolve("browserify-zlib"),
      "net": false // You might not need a fallback for net
    }
  },
};
