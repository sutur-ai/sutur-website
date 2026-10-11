'use client';

import { useInView } from '../../lib/useInView';
import { PhotoshopLogo } from './PhotoshopLogo';
import styles from './Photoshop.module.css';

export function PhotoshopVisual() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`vis rv${inView ? '' : ' idle'}`} role="img" aria-label="Rafic in Photoshop: it types a new headline, then changes the sun shape from orange to violet">
      <div className={styles['ps']}>
        <div className={styles['ps-menu']}><PhotoshopLogo /><span>File</span><span>Edit</span><span>Image</span><span>Layer</span><span>Type</span><span>Select</span><span>Filter</span><span>3D</span><span>View</span><span>Window</span><span>Help</span></div>
        <div className={styles['ps-opt']}>
          <div className={styles['ps-optset'] + ' ' + styles['stg'] + ' ' + styles['o1']}>
            <span className={styles['ps-tool']} style={{ background: '#595959', color: '#fff' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6V4h16v2M12 4v16M9 20h6"></path></svg></span>
            <span className={styles['ps-sel']}>Montserrat</span><span className={styles['ps-sel']}>ExtraBold</span><span className={styles['ps-sel']}>48 pt</span><span className={styles['ps-sel']}>Sharp</span><span>Color</span><span className={styles['ps-sw']} style={{ background: '#f57e20' }}></span>
          </div>
          <div className={styles['ps-optset'] + ' ' + styles['stg'] + ' ' + styles['o2']}>
            <span className={styles['ps-tool']} style={{ background: '#595959', color: '#fff' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle></svg></span>
            <span className={styles['ps-sel']}>Shape</span><span>Fill:</span><span className={styles['ps-sw'] + ' ' + styles['fill']}></span><span>Stroke:</span><span className={styles['ps-sw'] + ' ' + styles['white']} style={{ background: 'transparent', borderStyle: 'dashed' }}></span><span>W: 992 px</span><span>H: 992 px</span>
          </div>
        </div>
        <div className={styles['ps-main']}>
          <div className={styles['ps-tools']} aria-hidden="true">
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"></path></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3"><rect x="4" y="4" width="16" height="16"></rect></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 18c0-8 16-12 16-4 0 4-8 4-10 2"></path></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2v16h16"></path><path d="M2 6h16v16"></path></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 4l6 6-9 9H5v-6z"></path></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.5 14.5L4 20M18 3a3 3 0 0 1 3 3c0 3-6 9-9 9l-3-3c0-3 6-9 9-9z"></path></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 20H9L3 14l10-10 8 8-6 6"></path></svg></span>
            <span className={styles['ps-tool'] + ' ' + styles['t-type']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6V4h16v2M12 4v16M9 20h6"></path></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 19l7-7-7-7-7 7z"></path><path d="M12 2v5"></path></svg></span>
            <span className={styles['ps-tool'] + ' ' + styles['t-shape']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="8"></circle></svg></span>
            <span className={styles['ps-tool']}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6"></circle><path d="M20 20l-4.5-4.5"></path></svg></span>
          </div>
          <div className={styles['ps-doc']}>
            <div className={styles['ps-tab']}><span>spring-campaign.psd @ 50% (RGB/8)</span> ×</div>
            <div className={styles['ps-canvas']}>
              <div className={styles['ps-art']}>
                <span className={styles['ps-sun']}></span>
                <span className={styles['ps-sun-sel']}></span>
                <span className={styles['ps-h']}>Spring<br />is here</span>
                <span className={styles['ps-tbox']}></span>
                <span className={styles['ps-type']}><span className={styles['ps-type-t']}>SALE −20%</span><span className={styles['ps-caret']}></span></span>
              </div>
              <div className={styles['ps-picker']}>
                <span className={styles['ps-picker-t']}>Color Picker (Fill)</span>
                <span className={styles['ps-grad']}><i></i></span>
                <span className={styles['ps-hex']}><span>#</span><span>906FB1</span></span>
                <span className={styles['ps-ok']}>OK</span>
              </div>
              <svg className={styles['ps-cur']} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2l16 9-7 2-3 7z" fill="#ffffff" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round"></path></svg>
            </div>
          </div>
          <div className={styles['ps-side']}>
            <div className={styles['ps-ptabs']}><b>Layers</b><span>Channels</span><span>Paths</span></div>
            <div className={styles['ps-layer'] + ' ' + styles['l-new']}><svg className={styles['ps-eye']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg><span className={styles['ps-th']} style={{ background: '#ffffff', color: '#333333' }}>T</span>SALE −20%</div>
            <div className={styles['ps-layer']}><svg className={styles['ps-eye']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg><span className={styles['ps-th']} style={{ background: '#ffffff', color: '#333333' }}>T</span>Spring is here</div>
            <div className={styles['ps-layer'] + ' ' + styles['l-sun']}><svg className={styles['ps-eye']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg><span className={styles['ps-th'] + ' ' + styles['sun']}></span>Sun</div>
            <div className={styles['ps-layer']}><svg className={styles['ps-eye']} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"></path><circle cx="12" cy="12" r="3"></circle></svg><span className={styles['ps-th']} style={{ background: '#3b1447' }}></span>Background</div>
            <div className={styles['ps-props']}>
              <div className={styles['ps-ptabs']} style={{ padding: '0 0 4px', background: 'transparent', border: '0' }}><b>Properties</b></div>
              <div className={styles['ps-prow']}><span>Fill</span><span className={styles['ps-sw'] + ' ' + styles['fill']}></span></div>
              <div className={styles['ps-prow']}><span>Stroke</span><span>None</span></div>
              <div className={styles['ps-prow']}><span>Opacity</span><span>100%</span></div>
            </div>
          </div>
        </div>
        <div className={styles['ps-status']}><span>50%</span><span>1600 px × 2000 px (72 ppi)</span></div>
      </div>
      <div className={styles['ps-rafic']}>
        <span className={styles['ps-rafic-l']}><span className={styles['pulse']}></span><img src="/brand/design-system/sutur-icon-soft.png" alt="" width="18" height="18" /><span className={styles['ps-say'] + ' ' + styles['stg'] + ' ' + styles['o1']}>Adding “SALE −20%”</span><span className={styles['ps-say'] + ' ' + styles['stg'] + ' ' + styles['o2']}>Changing the sun to violet</span></span>
        <span className={styles['kept']}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"></path><path d="M3 3v5h5"></path></svg>Original kept</span>
        <span className={styles['stop']}><span className={styles['stop-sq']}></span>Stop</span>
      </div>
    </div>
  );
}
