import React, { Suspense, useEffect } from "react";

const Posts = React.lazy(() => import("../components/Posts"));

const Home = () => {
  useEffect(() => {
    document.title = "Home - My Blog"; 
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
