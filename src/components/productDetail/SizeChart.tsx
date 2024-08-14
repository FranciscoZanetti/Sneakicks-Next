import { useState, useEffect } from 'react';
import '@/styles/productDetail.css';

interface SizeConversions {
  [key: number]: { eu: number; cm: number };
}

const sizeConversions: SizeConversions = {
  3: { eu: 36, cm: 21 },
  3.5: { eu: 36.5, cm: 21.5 },
  4: { eu: 37, cm: 22 },
  4.5: { eu: 37.5, cm: 22.5 },
  5: { eu: 38, cm: 23 },
  5.5: { eu: 38.5, cm: 23.5 },
  6: { eu: 39, cm: 24 },
  6.5: { eu: 39.5, cm: 24.5 },
  7: { eu: 40, cm: 25 },
  7.5: { eu: 40.5, cm: 25.5 },
  8: { eu: 41, cm: 26 },
  8.5: { eu: 41.5, cm: 26.5 },
  9: { eu: 42, cm: 27 },
  9.5: { eu: 42.5, cm: 27.5 },
  10: { eu: 43, cm: 28 },
  10.5: { eu: 43.5, cm: 28.5 },
  11: { eu: 44, cm: 29 },
  11.5: { eu: 44.5, cm: 29.5 },
  12: { eu: 45, cm: 30 },
  12.5: { eu: 45.5, cm: 30.5 },
  13: { eu: 46, cm: 31 },
  13.5: { eu: 46.5, cm: 31.5 },
  14: { eu: 47, cm: 32 },
  14.5: { eu: 47.5, cm: 32.5 },
  15: { eu: 48, cm: 33 },
  15.5: { eu: 48.5, cm: 33.5 },
};

const SizeChart = () => {
  const [selectedUSA, setSelectedUSA] = useState<number | undefined>();
  const [selectedEU, setSelectedEU] = useState<number | undefined>();
  const [selectedCM, setSelectedCM] = useState<number | undefined>();

  useEffect(() => {
    if (selectedUSA !== undefined) {
      const conversion = sizeConversions[selectedUSA];
      if (conversion) {
        setSelectedEU(conversion.eu);
        setSelectedCM(conversion.cm);
      }
    }
  }, [selectedUSA]);

  useEffect(() => {
    if (selectedEU !== undefined) {
      const foundUSA = Object.keys(sizeConversions).find(key => sizeConversions[parseFloat(key)].eu === selectedEU);
      if (foundUSA) {
        setSelectedUSA(parseFloat(foundUSA));
        setSelectedCM(sizeConversions[parseFloat(foundUSA)].cm);
      }
    }
  }, [selectedEU]);

  useEffect(() => {
    if (selectedCM !== undefined) {
      const foundUSA = Object.keys(sizeConversions).find(key => sizeConversions[parseFloat(key)].cm === selectedCM);
      if (foundUSA) {
        setSelectedUSA(parseFloat(foundUSA));
        setSelectedEU(sizeConversions[parseFloat(foundUSA)].eu);
      }
    }
  }, [selectedCM]);

  return (
    <article className="details-text">
      <h3>Guía de talles</h3>
      <form className="size-unit-form" action="/productDetail" method="get">
        <article className="size-unit-container">
          <div className="size-unit">
            <label htmlFor="estadosunidos">Estados Unidos:</label>
            <select value={selectedUSA ?? 'initial'} onChange={(e) => setSelectedUSA(parseFloat(e.target.value))} name="estadosunidos" id="estadosunidos">
              <option value="initial" disabled hidden>Seleccionar</option>
              {Object.keys(sizeConversions).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </article>
        <article className="size-unit-container">
          <div className="size-unit">
            <label htmlFor="europa">Europa:</label>
            <select value={selectedEU ?? 'initial'} onChange={(e) => setSelectedEU(parseFloat(e.target.value))} name="europa" id="europa">
              <option value="initial" disabled hidden>Seleccionar</option>
              {Object.values(sizeConversions).map(conv => (
                <option key={conv.eu} value={conv.eu}>{conv.eu}</option>
              ))}
            </select>
          </div>
        </article>
        <article className="size-unit-container">
          <div className="size-unit">
            <label htmlFor="centimetros">Centímetros:</label>
            <select value={selectedCM ?? 'initial'} onChange={(e) => setSelectedCM(parseFloat(e.target.value))} name="centimetros" id="centimetros">
              <option value="initial" disabled hidden>Seleccionar</option>
              {Object.values(sizeConversions).map(conv => (
                <option key={conv.cm} value={conv.cm}>{conv.cm}</option>
              ))}
            </select>
          </div>
        </article>
      </form>
    </article>
  );
}

export default SizeChart;
