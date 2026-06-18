// Shared loading skeleton for studio pages. Shown instantly on navigation while
// a page's data loads, so clicks respond at once instead of appearing to hang.
// The rail comes from the layout and stays put; only this body is replaced.
export function PageSkeleton() {
  return (
    <>
      <header className="admin-topbar">
        <div className="topbar-head">
          <div className="crumbs">
            <span className="sk sk-pill" />
          </div>
          <span className="sk sk-h1" />
          <span className="sk sk-sub" />
        </div>
      </header>
      <div className="admin-content">
        <div className="sk-stack">
          <span className="sk sk-panel" />
          <span className="sk sk-panel" />
          <span className="sk sk-panel" />
        </div>
      </div>
    </>
  )
}
