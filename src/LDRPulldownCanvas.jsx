import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

const formatOhms = (r) => {
  if (r >= 1e6) return `${(r / 1e6).toFixed(2)} MΩ`;
  if (r >= 1e3) return `${(r / 1e3).toFixed(2)} kΩ`;
  return `${r.toFixed(0)} Ω`;
};

const VCC = 5;
const V_LOW = 0.3 * VCC; // ~1.5 V
const V_HIGH = 0.6 * VCC; // ~3.0 V

export default function LDRPulldownCanvas() {
  const [rd, setRd] = useState(30000);
  const [rldr, setRldr] = useState(20000);

  const vpin = useMemo(() => (VCC * rd) / (rldr + rd), [rldr, rd]);
  const state = vpin >= V_HIGH ? "HIGH" : vpin <= V_LOW ? "LOW" : "Indefinido";

  const data = useMemo(() => {
    const points = [];
    const rMin = 1e3;
    const rMax = 1e6;
    const n = 120;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const logR = Math.log10(rMin) + t * (Math.log10(rMax) - Math.log10(rMin));
      const R = 10 ** logR;
      const V = (VCC * rd) / (R + rd);
      points.push({
        R,
        logR,
        V: +V.toFixed(4),
        Rlabel: formatOhms(R),
      });
    }
    return points;
  }, [rd]);

  const logTicks = [1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6].map((R) => Math.log10(R));

  return (
    <div className="w-full min-h-screen bg-neutral-50 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-2"
        >
          Simulador LDR + Pull‑down (Arduino)
        </motion.h1>
        <p className="text-neutral-600 mb-6">
          Visualiza cómo cambia el voltaje en el pin (<code>Vpin</code>) al variar la
          resistencia de la LDR (<code>R<sub>LDR</sub></code>) y la resistencia de pull‑down (<code>R<sub>d</sub></code>). Umbrales a 5 V: LOW ≤ {V_LOW.toFixed(1)} V, HIGH ≥ {V_HIGH.toFixed(1)} V.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-medium mb-4">Ajustes</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Pull‑down R<sub>d</sub>: <span className="font-semibold">{formatOhms(rd)}</span>
              </label>
              <input
                type="range"
                min={5000}
                max={220000}
                step={1000}
                value={rd}
                onChange={(e) => setRd(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>5 kΩ</span>
                <span>220 kΩ</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                LDR R<sub>LDR</sub>: <span className="font-semibold">{formatOhms(rldr)}</span>
              </label>
              <input
                type="range"
                min={1000}
                max={1000000}
                step={1000}
                value={rldr}
                onChange={(e) => setRldr(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-neutral-500 mt-1">
                <span>1 kΩ</span>
                <span>1 MΩ</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-neutral-50 rounded-xl p-3">
                <div className="text-neutral-500">Vpin</div>
                <div className="text-xl font-semibold">{vpin.toFixed(3)} V</div>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <div className="text-neutral-500">Estado digital</div>
                <div className={`text-xl font-semibold ${state === "HIGH" ? "text-emerald-600" : state === "LOW" ? "text-blue-600" : "text-amber-600"}`}>
                  {state}
                </div>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <div className="text-neutral-500">Umbral HIGH (3.0 V) ⇒ R<sub>LDR</sub> ≤</div>
                <div className="text-lg font-semibold">{formatOhms((2 / 3) * rd)}</div>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3">
                <div className="text-neutral-500">Umbral LOW (1.5 V) ⇒ R<sub>LDR</sub> ≥</div>
                <div className="text-lg font-semibold">{formatOhms((7 / 3) * rd)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-5">
            <h2 className="text-lg font-medium mb-4">Curva Vpin vs R<sub>LDR</sub> (log en X)</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="logR"
                    type="number"
                    domain={[Math.log10(1e3), Math.log10(1e6)]}
                    ticks={[1e3,2e3,5e3,1e4,2e4,5e4,1e5,2e5,5e5,1e6].map((R)=>Math.log10(R))}
                    tickFormatter={(log) => {
                      const R = 10 ** log;
                      if (R >= 1e6) return `${R / 1e6}MΩ`;
                      if (R >= 1e3) return `${R / 1e3}kΩ`;
                      return `${R}Ω`;
                    }}
                    label={{ value: "Resistencia LDR", position: "insideBottom", offset: -2 }}
                  />
                  <YAxis domain={[0, 5]} tickFormatter={(v) => `${v}V`} />
                  <Tooltip
                    formatter={(value, name, props) =>
                      name === "Vpin" ? [`${value} V`, "Vpin"] : [props.payload.Rlabel, "R_LDR"]
                    }
                    labelFormatter={(log) => `R_LDR ≈ ${formatOhms(10 ** log)}`}
                  />
                  <ReferenceLine y={V_LOW} strokeDasharray="4 4" />
                  <ReferenceLine y={V_HIGH} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="V" name="Vpin" dot={false} />
                  <ReferenceLine x={Math.log10(rldr)} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              Líneas horizontales: ~{V_LOW.toFixed(1)} V (LOW) y ~{V_HIGH.toFixed(1)} V (HIGH). Línea vertical punteada: valor actual de R<sub>LDR</sub>.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-5">
          <h2 className="text-lg font-medium mb-3">Circuito</h2>
          <pre className="bg-neutral-50 rounded-xl p-4 text-sm overflow-auto">{`+5V
 │
[LDR]
 │
 ├───→ (Nodo / Pin Arduino)
 │
[Rd]  (pull‑down)
 │
GND`}</pre>
          <ul className="list-disc ml-6 mt-3 text-sm text-neutral-700 space-y-1">
            <li>Fórmula: <code>Vpin = VCC · Rd / (R_LDR + Rd)</code></li>
            <li>A 5 V, umbrales digitales típicos: LOW ≤ 1.5 V, HIGH ≥ 3.0 V.</li>
            <li>Para conmutación limpia cerca de los umbrales, añade histéresis (ej.: 74HC14).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
