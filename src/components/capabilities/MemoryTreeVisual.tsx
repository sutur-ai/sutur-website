"use client";

import { useInView } from '../../lib/useInView';
import styles from './MemoryTree.module.css';

export function MemoryTreeVisual() {
  const { ref, inView } = useInView();
  return (
    <div className={`vis rv${inView ? "" : " idle"}`} ref={ref} role="img" aria-label="A tree: Rafic at the top, three decisions below it. From each decision Rafic learns something and files it into its memory: a new skill, a new habit and a new reminder">
      <div className={styles["tree"]}>
        <svg className={styles["tree-lines"]} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 15 L 50 22 M18 22 L 82 22 M18 22 L 18 27 M50 22 L 50 27 M82 22 L 82 27"></path>
          <path className={styles["dash"]} d="M18 46 L 18 57 M50 46 L 50 57 M82 46 L 82 57"></path>
        </svg>
        <div className={[styles["tn"], styles["t-root"]].join(" ")} style={{ left: "50%", top: "9%" }}><img loading="lazy" decoding="async" src="/brand/design-system/sutur-icon-soft.webp" width="140" height="168" alt="" />Rafic</div>
        <div className={[styles["tn"], styles["t-dec"], styles["d1"]].join(" ")} style={{ left: "18%", top: "36%" }}><span className={styles["t-dec-k"]}>Decision</span>Closed September&apos;s books in 5 steps<br /><span className={styles["t-learn"]}>Learned a skill</span></div>
        <div className={[styles["tn"], styles["t-dec"], styles["d2"]].join(" ")} style={{ left: "50%", top: "36%" }}><span className={styles["t-dec-k"]}>Decision</span>Sent the Beit Mery quote as a PDF, in French<br /><span className={styles["t-learn"]}>Learned a habit</span></div>
        <div className={[styles["tn"], styles["t-dec"], styles["d3"]].join(" ")} style={{ left: "82%", top: "36%" }}><span className={styles["t-dec-k"]}>Decision</span>Wrote your brief on Monday morning<br /><span className={styles["t-learn"]}>Learned a routine</span></div>
        <span className={[styles["fly"], styles["f1"]].join(" ")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg>monthly-close.md</span>
        <span className={[styles["fly"], styles["f2"]].join(" ")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6"></path></svg>quotes-pdf-in-french.md</span>
        <span className={[styles["fly"], styles["f3"]].join(" ")}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>Weekly brief · Mon 07:30</span>
        <div className={styles["mem"]}>
          <div className={styles["mem-h"]}><span><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>Rafic&apos;s memory</span><span className={styles["mem-only"]}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>Only yours</span></div>
          <div className={styles["mem-cols"]}>
            <div className={styles["mem-col"]}>
              <div className={styles["mem-col-h"]}><i className={styles["sk"]}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2l2.6 6.4L21 9l-5 4.4L17.5 20 12 16.6 6.5 20 8 13.4 3 9l6.4-.6z"></path></svg></i>Skills</div>
              <div className={[styles["mf"], styles["new"], styles["n1"]].join(" ")}><span>monthly-close.md</span><em>New</em></div>
              <div className={styles["mf"]}><span>supplier-follow-up.md</span></div>
              <div className={styles["mf"]}><span>vat-check.md</span></div>
            </div>
            <div className={styles["mem-col"]}>
              <div className={styles["mem-col-h"]}><i className={styles["hb"]}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 2l4 4-4 4"></path><path d="M3 11V9a3 3 0 0 1 3-3h15"></path><path d="M7 22l-4-4 4-4"></path><path d="M21 13v2a3 3 0 0 1-3 3H3"></path></svg></i>Habits</div>
              <div className={[styles["mf"], styles["new"], styles["n2"]].join(" ")}><span>quotes-pdf-in-french.md</span><em>New</em></div>
              <div className={styles["mf"]}><span>copy-account-manager.md</span></div>
              <div className={styles["mf"]}><span>amounts-in-usd.md</span></div>
            </div>
            <div className={styles["mem-col"]}>
              <div className={styles["mem-col-h"]}><i className={styles["rm"]}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg></i>Reminders</div>
              <div className={[styles["mf"], styles["new"], styles["n3"]].join(" ")}><span>Weekly brief · Mon 07:30</span><em>New</em></div>
              <div className={styles["mf"]}><span>Overdue check · daily 09:00</span></div>
              <div className={styles["mf"]}><span>Stock alert · Fri 16:00</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
