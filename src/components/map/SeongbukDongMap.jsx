import { useState, useMemo, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoMercator, geoCentroid } from 'd3-geo';
import styles from './SeongbukDongMap.module.css';

import seongbukDongGeo from '../../assets/map/seongbuk_dong.json';
import TrafficLight from './TrafficLight';
import { getSeongbukDistricts } from '../../api/safety';

const normalizeDongName = (name = '') => {
  const n = name.replace(/\s+/g, '');

  if (n.startsWith('정릉')) return '정릉동';
  if (n.startsWith('길음')) return '길음동';
  if (n.startsWith('돈암')) return '돈암동';
  if (n.startsWith('장위')) return '장위동';
  if (n.startsWith('월곡')) return '월곡동';

  return n;
};

const GRADE_FILL = {
  안전: '#E8F5E8',
  주의: '#FFE08A',
  위험: '#FFE8E8',
};

const SeongbukDongMap = () => {
  const [hoveredDong, setHoveredDong] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [districts, setDistricts] = useState([]);
  const mapRef = useRef(null);

  const projection = useMemo(() => geoMercator().fitSize([800, 400], seongbukDongGeo), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSeongbukDistricts();
        setDistricts(data.districts || []);
      } catch (err) {
        console.error('Failed to fetch districts:', err);
      }
    };

    fetchData();
  }, []);

  const gradeByDong = useMemo(() => {
    const map = {};
    districts.forEach((d) => {
      const key = normalizeDongName(d.emdName);
      if (!key) return;
      map[key] = d.grade; // "안전", "주의", "위험"
    });
    return map;
  }, [districts]);

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>성북구 안전 지도</h2>
      </div>

      <div className={styles.mapContainer} ref={mapRef}>
        <div className={styles.seongbukBadge}>성북구</div>

        <ComposableMap projection={projection} width={800} height={400} style={{ width: '100%', height: '100%' }}>
          <Geographies geography={seongbukDongGeo}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const centroid = projection(geoCentroid(geo)) || [0, 0];

                const rawDongName =
                  geo.properties.dong_name ||
                  geo.properties.ADM_NM ||
                  geo.properties.EMD_NM ||
                  geo.properties.dong ||
                  geo.properties.name;

                const normDongName = normalizeDongName(rawDongName);
                const grade = gradeByDong[normDongName]; // "안전", "주의", "위험"
                const fillColor = GRADE_FILL[grade] || '#FFFFFF';

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onMouseEnter={(event) => {
                        setHoveredDong(rawDongName);
                        const bounds = mapRef.current?.getBoundingClientRect();
                        if (!bounds) return;
                        setTooltipPos({
                          x: event.clientX - bounds.left + 12,
                          y: event.clientY - bounds.top + 12,
                        });
                      }}
                      onMouseLeave={() => setHoveredDong(null)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: '#64748B',
                          strokeWidth: 0.8,
                          outline: 'none',
                          transition: 'all 0.2s ease-out',
                          cursor: 'pointer',
                        },
                        hover: {
                          fill: '#CFE8FF',
                          stroke: '#409EE3',
                          strokeWidth: 1,
                          outline: 'none',
                          cursor: 'pointer',
                          filter: 'drop-shadow(0 0 3px rgba(37, 99, 235, 0.5))',
                          transition: 'all 0.2s ease-out',
                        },
                        pressed: {
                          fill: fillColor,
                          stroke: '#409EE3',
                          strokeWidth: 1,
                          outline: 'none',
                        },
                      }}
                    />

                    <text x={centroid[0]} y={centroid[1]} textAnchor='middle' className={styles.mapLabel}>
                      {rawDongName}
                    </text>
                  </g>
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <div className={styles.trafficWrapper}>
          <TrafficLight />
        </div>
      </div>
    </section>
  );
};

export default SeongbukDongMap;
