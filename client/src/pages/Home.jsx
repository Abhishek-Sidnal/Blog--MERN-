import React, { Suspense, useEffect } from "react";

// Lazy load the Posts component
const Posts = React.lazy(() => import("../components/Posts"));

const Home = () => {
  // Update the document title for SEO
  useEffect(() => {
    document.title = "Home - My Blog"; // Customize the title
  }, []);

  return (
    <section className="min-h-screen bg-background text-primary-text p-6">
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
    </section>
  );
};

export default Home;
