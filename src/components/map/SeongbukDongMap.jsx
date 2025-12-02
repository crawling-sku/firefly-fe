import { useState, useMemo, useRef, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { geoMercator, geoCentroid } from 'd3-geo';
import styles from './SeongbukDongMap.module.css';

import seongbukDongGeo from '../../assets/map/seongbuk_dong.json';
import TrafficLight from './TrafficLight';
import { getSeongbukDistricts, getSeongbukFacilities, getSeongbukDistrictDetail } from '../../api/safety';

import pinCCTV from '../../assets/pins/pin_cctv.png';
import pinLamp from '../../assets/pins/pin_lamp.png';
import pinBell from '../../assets/pins/pin_bell.png';
import pin112 from '../../assets/pins/pin_112.png';
import pinMark from '../../assets/pins/pin_mark.png';
import pinSign from '../../assets/pins/pin_sign.png';
import pinOther from '../../assets/pins/pin_other.png';
import DistrictInfoPanel from './DistrictInfoPanel';

const FACILITY_ICONS = {
  CCTV: pinCCTV,
  보안등: pinLamp,
  안심벨: pinBell,
  '112 신고 안내': pin112,
  노면표기: pinMark,
  안내표지판: pinSign,
  기타: pinOther,
};

const DONG_ALIAS_MAP = {
  정릉1동: '정릉동',
  정릉2동: '정릉동',
  정릉3동: '정릉동',
  정릉4동: '정릉동',

  돈암1동: '돈암동',
  돈암2동: '돈암동',

  길음1동: '길음동',
  길음2동: '길음동',

  월곡1동: '하월곡동',
  월곡2동: '하월곡동',
  월곡동: '하월곡동',
  상월곡동: '하월곡동',

  장위1동: '장위동',
  장위2동: '장위동',
  장위3동: '장위동',

  삼선동1가: '삼선동',
  삼선동2가: '삼선동',
  삼선동3가: '삼선동',
  삼선동4가: '삼선동',
  삼선동5가: '삼선동',

  동선동1가: '동선동',
  동선동2가: '동선동',
  동선동3가: '동선동',
  동선동4가: '동선동',

  보문동1가: '보문동',
  보문동2가: '보문동',
  보문동3가: '보문동',
  보문동4가: '보문동',

  안암동1가: '안암동',
  안암동2가: '안암동',
  안암동3가: '안암동',
  안암동4가: '안암동',
};

const normalizeDongName = (name = '') => {
  if (!name) return '';

  const clean = name.replace(/\s+/g, '');

  if (DONG_ALIAS_MAP[clean]) return DONG_ALIAS_MAP[clean];

  if (clean.startsWith('정릉')) return '정릉동';
  if (clean.startsWith('길음')) return '길음동';
  if (clean.startsWith('돈암')) return '돈암동';
  if (clean.startsWith('장위')) return '장위동';

  if (clean.includes('월곡')) return '하월곡동';

  return clean;
};

const GRADE_FILL = {
  안전: '#E8F5E8',
  주의: '#FFE08A',
  위험: '#FFE8E8',
};

const SeongbukDongMap = () => {
  const [districts, setDistricts] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [selectedDong, setSelectedDong] = useState(null);
  const [selectedDongDetail, setSelectedDongDetail] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelLoading, setPanelLoading] = useState(false);

  const mapRef = useRef(null);

  const projection = useMemo(() => geoMercator().fitSize([800, 400], seongbukDongGeo), []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtRes, facilityRes] = await Promise.all([getSeongbukDistricts(), getSeongbukFacilities()]);

        setDistricts(districtRes.districts || []);
        setFacilities(facilityRes.facilities || facilityRes || []);
      } catch (err) {
        console.error('Failed to fetch safety map data:', err);
      }
    };

    fetchData();
  }, []);

  const gradeByDong = useMemo(() => {
    const map = {};
    districts.forEach((d) => {
      const key = normalizeDongName(d.emdName);
      if (!key) return;
      map[key] = d.grade;
    });
    return map;
  }, [districts]);

  const selectedDongNorm = selectedDong ? normalizeDongName(selectedDong) : null;

  const handleDongClick = async (rawDongName) => {
    const emdName = normalizeDongName(rawDongName);

    try {
      setPanelLoading(true);
      setSelectedDong(rawDongName);
      const detail = await getSeongbukDistrictDetail(emdName);
      setSelectedDongDetail(detail);
      setPanelOpen(true);
    } catch (err) {
      console.error('Failed to fetch district detail:', err);
      setSelectedDongDetail(null);
      setPanelOpen(false);
    } finally {
      setPanelLoading(false);
    }
  };

  const handleClosePanel = () => {
    setPanelOpen(false);
    setSelectedDong(null);
    setSelectedDongDetail(null);
  };

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
                const grade = gradeByDong[normDongName] || '주의';
                const fillColor = GRADE_FILL[grade] || '#FFFFFF';

                const isSelected = selectedDongNorm && normDongName === normalizeDongName(selectedDong);

                return (
                  <g key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onClick={() => handleDongClick(rawDongName)}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: '#64748B',
                          strokeWidth: isSelected ? 2 : 0.8,
                          outline: 'none',
                          transition: 'all 0.2s ease-out',
                          cursor: 'pointer',
                        },
                        hover: {
                          fill: '#CFE8FF',
                          stroke: '#409EE3',
                          strokeWidth: 1.5,
                          outline: 'none',
                          cursor: 'pointer',
                          filter: 'drop-shadow(0 0 3px rgba(37, 99, 235, 0.5))',
                          transition: 'all 0.2s ease-out',
                        },
                        pressed: {
                          fill: fillColor,
                          stroke: '#409EE3',
                          strokeWidth: 2,
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

          {facilities.map((f, idx) => {
            if (!selectedDongNorm) return null;
            if (f.lng == null || f.lat == null) return null;

            const facilityDongNorm = normalizeDongName(f.emd_name);
            if (facilityDongNorm !== selectedDongNorm) return null;

            const projected = projection([f.lng, f.lat]);
            if (!projected) return null;

            const [x, y] = projected;
            const icon = FACILITY_ICONS[f.facility_type] || FACILITY_ICONS['기타'];

            return (
              <image
                key={`facility-${idx}`}
                href={icon}
                x={x - 8}
                y={y - 16}
                width={8}
                height={8}
                style={{ pointerEvents: 'auto' }}
              >
                <title>{`${f.emd_name} · ${f.facility_type}`}</title>
              </image>
            );
          })}
        </ComposableMap>

        <div className={styles.trafficWrapper}>
          <TrafficLight />
        </div>

        <DistrictInfoPanel
          open={panelOpen}
          onClose={handleClosePanel}
          dongName={selectedDong}
          detail={selectedDongDetail}
          loading={panelLoading}
        />
      </div>
    </section>
  );
};

export default SeongbukDongMap;
