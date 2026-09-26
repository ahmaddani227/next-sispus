const AdminFooter = () => {
  return (
    <footer className="flex h-11 shrink-0 flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-white px-4 sm:px-8 py-2 text-[11px] text-slate-500 gap-1">
      <div>SIPUS Ar-Rasyid v1.0 &bull; Sistem Manajemen Perpustakaan</div>
      <div className="flex items-center gap-4">
        <span className="text-slate-500">
          Developed by{" "}
          <a
            href="https://github.com/ahmaddani227"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline text-emerald-800 font-semibold"
          >
            @ahmaddani
          </a>
        </span>
      </div>
    </footer>
  );
}

export default AdminFooter