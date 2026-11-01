/** Deretan bintang: terisi ⭐ dan kosong (abu-abu). */
export function DeretBintang({
  dapat,
  total,
  ukuran = "text-2xl",
}: {
  dapat: number;
  total: number;
  ukuran?: string;
}) {
  return (
    <span className={`inline-flex gap-1 ${ukuran}`} aria-label={`${dapat}/${total}`} role="img">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} aria-hidden className={i < dapat ? "" : "opacity-30 grayscale"}>
          ⭐
        </span>
      ))}
    </span>
  );
}
