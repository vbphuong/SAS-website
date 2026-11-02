export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <span className="footer-brand">Student Academic Success</span>
        <div className="footer-right">
          <span>Swinburne University of Technology</span>
          <span>·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
