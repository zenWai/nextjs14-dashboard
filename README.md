## Next.js App Router

<ul>
<li>Created a database in the same region as the application code to reduce latency between server and database.</li>
<li>Fetched data on the server with React Server Components. This allows to keep expensive data fetches and logic on the server, reduces the client-side JavaScript bundle, and prevents database secrets from being exposed to the client.</li>
<li>Used SQL to only fetch required data, reducing the amount of data transferred for each request and the amount of JavaScript needed to transform the data in-memory.</li>
<li>Parallelize data fetching with JavaScript - where it made sense to do so.</li>
<li>Implemented Streaming to prevent slow data requests from blocking the page, and to allow the user to start interacting with the UI without waiting for everything to load.</li>
<li>Move data fetching down to the components that need it, thus isolating which parts of routes should be dynamic in preparation for Partial Prerendering.</li>
</ul>
