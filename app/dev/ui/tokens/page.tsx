import { colors } from '@/styles/tokens/colors';

export default function TokensDevPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold">Design Tokens</h1>
      <section>
        <h2 className="text-base font-semibold text-gray-700 mb-3">Colors</h2>
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(colors).map(([key, shades]) =>
            typeof shades === 'object'
              ? Object.entries(shades).map(([shade, hex]) => (
                  <div key={`${key}-${shade}`} className="flex flex-col gap-1">
                    <div className="h-10 rounded-md border" style={{ backgroundColor: hex as string }} />
                    <p className="text-xs text-gray-600">{key}.{shade}</p>
                    <p className="text-xs text-gray-400">{hex as string}</p>
                  </div>
                ))
              : null
          )}
        </div>
      </section>
    </div>
  );
}
