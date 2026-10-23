export function SpecsTable({ specs }: { specs: Record<string, string> }) {
  const rows = Object.entries(specs);
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="specs-heading">
      <h2 id="specs-heading" className="mb-3 text-xl font-semibold">
        Specifications
      </h2>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Technical specifications</caption>
        <tbody>
          {rows.map(([name, value]) => (
            <tr key={name} className="border-b border-border odd:bg-surface/60">
              <th scope="row" className="w-2/5 px-3 py-2.5 font-medium text-muted">
                {name}
              </th>
              <td className="px-3 py-2.5">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
