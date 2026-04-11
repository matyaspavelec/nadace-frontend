// Centrální helper pro logování chyb z fetchů.
// Místo `.catch(() => {})` použij `.catch(logError('scope'))` aby se chyby
// neztratily a v dev konzoli byly hned vidět.

export function logError(scope) {
  return (err) => {
    // V produkci posílá Next chyby do server logu, lokálně do konzole.
    // Záměrně nepoužíváme alert/toast – initial fetch fail nemá blokovat UI.
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn(`[${scope}]`, err?.error || err?.message || err);
    }
  };
}
