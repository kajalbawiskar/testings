import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import { resolve } from "path";
import { Readable } from "stream";

// Define your routes
const links = [
  { url: "/", changefreq: "monthly", priority: 0.7 },
  // { url: '/signup', changefreq: 'monthly', priority: 0.7 }
  // Add any other routes here
];

const hostname = "https://user.confidanto.com";
const sitemapPath = resolve("public", "sitemap.xml");

(async () => {
  try {
    console.log("Generating sitemap...");
    console.log("Hostname:", hostname);
    console.log("Sitemap path:", sitemapPath);
    console.log("Links:", links);

    // Create a sitemap stream
    const sitemap = new SitemapStream({ hostname });
    const writeStream = createWriteStream(sitemapPath);

    // Manually write links to the sitemap
    links.forEach((link) => {
      sitemap.write(link);
    });

    sitemap.end();

    // Pipe the sitemap stream to the write stream
    sitemap.pipe(writeStream);

    // Wait for the write stream to finish
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    console.log("Sitemap created successfully!");
  } catch (error) {
    console.error("Error creating sitemap:", error);
  }
})();
