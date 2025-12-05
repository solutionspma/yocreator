export default function Studio() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">Studio</h1>
      <ul className="mt-8 space-y-4">
        <li><a href="/studio/voice">Voice Generator</a></li>
        <li><a href="/studio/avatar">Avatar Builder</a></li>
        <li><a href="/studio/video">Video Creator</a></li>
        <li><a href="/studio/projects">My Projects</a></li>
      </ul>
    </main>
  );
}
